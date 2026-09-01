from fastapi import FastAPI, Depends, HTTPException, Request, Header
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
import uuid

from .db import Base, engine, get_db
from .models import User, Property, Tenant, Lease, Charge, Payment, Receipt, Guarantor
from .schemas import RegisterIn, LoginIn, PropertyIn, TenantIn, LeaseIn, ChargeIn, ManualPaymentIn, MercadoPagoOrderIn, GuarantorIn, EmailUpdateIn 

from .auth import hash_password, verify_password, make_token, current_user, require_admin
from .config import settings

Base.metadata.create_all(bind=engine)
app = FastAPI(title="GDI Alquileres API", version="1.1.0")
origins = ["*"] if settings.CORS_ORIGINS.strip() == "*" else [x.strip() for x in settings.CORS_ORIGINS.split(",") if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/health")
def health():
    return {"ok": True, "app": settings.APP_NAME}

@app.post("/auth/register")
def register(data: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email.lower()).first():
        raise HTTPException(400, "El email ya está registrado")
    u = User(name=data.name, email=data.email.lower(), password_hash=hash_password(data.password), role="owner")
    db.add(u); db.commit(); db.refresh(u)
    return {"access_token": make_token(u), "token_type": "bearer", "user": {"id":u.id,"name":u.name,"role":u.role}}

@app.post("/auth/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == data.email.lower()).first()
    if not u or not verify_password(data.password, u.password_hash):
        raise HTTPException(401, "Credenciales incorrectas")
    return {"access_token": make_token(u), "token_type": "bearer", "user":{"id":u.id,"name":u.name,"role":u.role}}

@app.post("/auth/token")
def token(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == form.username.lower()).first()
    if not u or not verify_password(form.password, u.password_hash):
        raise HTTPException(401, "Credenciales incorrectas")
    return {"access_token": make_token(u), "token_type":"bearer"}

@app.get("/me")
def me(user: User = Depends(current_user)):
    return {"id":user.id,"name":user.name,"email":user.email,"role":user.role}

@app.get("/properties")
def properties(user: User = Depends(current_user), db: Session = Depends(get_db)):
    q = db.query(Property)
    if user.role not in ("admin","superadmin"):
        q = q.filter(Property.owner_id == user.id)
    return [{"id":p.id,"name":p.name,"property_type":p.property_type,"address":p.address,"city":p.city,"status":p.status} for p in q.all()]

@app.post("/properties")
def create_property(data: PropertyIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    p = Property(owner_id=user.id, **data.model_dump())
    db.add(p); db.commit(); db.refresh(p)
    return {"id":p.id, **data.model_dump(), "status":p.status}

@app.post("/tenants")
def create_tenant(data: TenantIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    t = Tenant(owner_id=user.id, **data.model_dump())
    db.add(t); db.commit(); db.refresh(t)
    return {"id":t.id, **data.model_dump()}

@app.get("/tenants")
def list_tenants(user: User = Depends(current_user), db: Session = Depends(get_db)):
    q = db.query(Tenant)
    if user.role not in ("admin","superadmin"):
        q = q.filter(Tenant.owner_id == user.id)
    return [{"id":t.id,"name":t.name,"dni":t.dni,"cuil":t.cuil,"email":t.email,"phone":t.phone} for t in q.all()]

@app.post("/leases")
def create_lease(data: LeaseIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    prop = db.get(Property, data.property_id)
    tenant = db.get(Tenant, data.tenant_id)
    if not prop or not tenant:
        raise HTTPException(404, "Propiedad o inquilino inexistente")
    if user.role not in ("admin","superadmin") and (prop.owner_id != user.id or tenant.owner_id != user.id):
        raise HTTPException(403, "Sin permiso")
    lease = Lease(owner_id=user.id, **data.model_dump())
    db.add(lease); db.commit(); db.refresh(lease)
    return {"id":lease.id, "status":lease.status}

@app.post("/charges")
def create_charge(data: ChargeIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    lease = db.get(Lease, data.lease_id)
    if not lease: raise HTTPException(404, "Contrato inexistente")
    if user.role not in ("admin","superadmin") and lease.owner_id != user.id: raise HTTPException(403, "Sin permiso")
    c = Charge(owner_id=lease.owner_id, **data.model_dump())
    db.add(c); db.commit(); db.refresh(c)
    return {"id":c.id,"status":c.status}

@app.get("/leases/{lease_id}/account-statement")
def account_statement(lease_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    lease = db.get(Lease, lease_id)
    if not lease: raise HTTPException(404, "Contrato inexistente")
    if user.role not in ("admin","superadmin") and lease.owner_id != user.id: raise HTTPException(403, "Sin permiso")
    charges = db.query(Charge).filter(Charge.lease_id == lease_id, Charge.status != "paid").all()
    total = sum(c.amount for c in charges)
    return {"lease_id":lease_id,"items":[{"id":c.id,"concept":c.concept,"amount":c.amount,"due_date":c.due_date,"status":c.status} for c in charges],"total":total}

@app.post("/payments/manual")
def manual_payment(data: ManualPaymentIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    lease = db.get(Lease, data.lease_id)
    if not lease: raise HTTPException(404, "Contrato inexistente")
    if user.role not in ("admin","superadmin") and lease.owner_id != user.id: raise HTTPException(403, "Sin permiso")
    p = Payment(owner_id=lease.owner_id, lease_id=data.lease_id, amount=data.amount, method=data.method,
                provider_status="approved", verification_status="confirmed", paid_at=datetime.utcnow())
    db.add(p); db.commit(); db.refresh(p)
    receipt = Receipt(payment_id=p.id, number=f"GDI-{p.id:06d}")
    db.add(receipt); db.commit()
    return {"payment_id":p.id,"status":"confirmed","receipt":receipt.number}

@app.post("/payments/mercadopago/create")
def mp_create(data: MercadoPagoOrderIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    lease = db.get(Lease, data.lease_id)
    if not lease: raise HTTPException(404, "Contrato inexistente")
    if user.role not in ("admin","superadmin") and lease.owner_id != user.id: raise HTTPException(403, "Sin permiso")
    ref = f"GDI-{data.lease_id}-{data.period}-{uuid.uuid4().hex[:8]}"
    p = Payment(owner_id=lease.owner_id, lease_id=data.lease_id, amount=data.amount, method="mercadopago",
                external_reference=ref, provider_status="pending", verification_status="pending")
    db.add(p); db.commit(); db.refresh(p)
    # En producción, aquí se crea la preferencia/orden con el SDK/API de Mercado Pago usando MP_ACCESS_TOKEN.
    return {"payment_id":p.id,"external_reference":ref,"provider_status":"pending","checkout_url":None,"mode":"sandbox-scaffold"}

@app.post("/webhooks/mercadopago")
async def mp_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    # Producción: validar firma x-signature con MP_WEBHOOK_SECRET y consultar el pago a Mercado Pago.
    ref = payload.get("external_reference")
    status = payload.get("status")
    provider_payment_id = str(payload.get("payment_id") or "")
    if not ref:
        return {"ok":True}
    p = db.query(Payment).filter(Payment.external_reference == ref).first()
    if not p:
        return {"ok":True}
    p.provider_status = status or p.provider_status
    p.provider_payment_id = provider_payment_id
    if status == "approved":
        p.verification_status = "confirmed"
        p.paid_at = datetime.utcnow()
        if not db.query(Receipt).filter(Receipt.payment_id == p.id).first():
            db.add(Receipt(payment_id=p.id, number=f"GDI-{p.id:06d}"))
    db.commit()
    return {"ok":True}

@app.get("/admin/stats")
def admin_stats(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return {
        "users": db.query(func.count(User.id)).scalar(),
        "properties": db.query(func.count(Property.id)).scalar(),
        "tenants": db.query(func.count(Tenant.id)).scalar(),
        "leases": db.query(func.count(Lease.id)).scalar(),
        "payments": db.query(func.count(Payment.id)).scalar(),
        "confirmed_amount": db.query(func.coalesce(func.sum(Payment.amount),0)).filter(Payment.verification_status=="confirmed").scalar()
    }

@app.get("/admin", response_class=HTMLResponse)
def admin_page():
    with open("static/admin.html", "r", encoding="utf-8") as f:
        return f.read()


@app.get("/admin/users")
def admin_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    rows = db.query(User).order_by(User.created_at.desc()).all()
    return [{"id":u.id,"name":u.name,"email":u.email,"role":u.role,"active":u.is_active,"created_at":u.created_at} for u in rows]

@app.get("/admin/properties")
def admin_properties(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    rows = db.query(Property).order_by(Property.id.desc()).all()
    return [{"id":p.id,"owner_id":p.owner_id,"name":p.name,"type":p.property_type,"address":p.address,"city":p.city,"status":p.status} for p in rows]

@app.get("/admin/payments")
def admin_payments(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    rows = db.query(Payment).order_by(Payment.created_at.desc()).limit(200).all()
    return [{"id":p.id,"lease_id":p.lease_id,"amount":p.amount,"method":p.method,
             "provider_status":p.provider_status,"verification_status":p.verification_status,
             "external_reference":p.external_reference,"created_at":p.created_at} for p in rows]

@app.patch("/admin/users/{user_id}/active")
def admin_toggle_user(user_id: int, active: bool, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    u = db.get(User, user_id)
    if not u: raise HTTPException(404, "Usuario inexistente")
    if u.role == "superadmin" and admin.role != "superadmin":
        raise HTTPException(403, "Solo SUPERADMIN")
    u.is_active = active
    db.commit()
    return {"id":u.id,"active":u.is_active}



@app.post("/guarantors")
def create_guarantor(data: GuarantorIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    lease = db.get(Lease, data.lease_id)
    if not lease: raise HTTPException(404, "Contrato inexistente")
    if user.role not in ("admin","superadmin") and lease.owner_id != user.id:
        raise HTTPException(403, "Sin permiso")
    g = Guarantor(owner_id=lease.owner_id, **data.model_dump())
    db.add(g); db.commit(); db.refresh(g)
    return {"id":g.id,"lease_id":g.lease_id,"name":g.name,"review_status":g.review_status}

@app.get("/guarantors")
def list_guarantors(user: User = Depends(current_user), db: Session = Depends(get_db)):
    q = db.query(Guarantor)
    if user.role not in ("admin","superadmin"):
        q = q.filter(Guarantor.owner_id == user.id)
    return [{"id":g.id,"lease_id":g.lease_id,"name":g.name,"dni":g.dni,"cuil":g.cuil,
             "guarantee_type":g.guarantee_type,"review_status":g.review_status} for g in q.all()]


@app.post("/bootstrap/superadmin")
def bootstrap_superadmin(
    data: RegisterIn,
    x_bootstrap_secret: str = Header(default="", alias="x-bootstrap-secret"),
    db: Session = Depends(get_db)
):
    secret = x_bootstrap_secret
    if not settings.BOOTSTRAP_ADMIN_SECRET or secret != settings.BOOTSTRAP_ADMIN_SECRET:
        raise HTTPException(403, "Bootstrap no autorizado")
    existing_super = db.query(User).filter(User.role == "superadmin").first()
    if existing_super:
        raise HTTPException(409, "Ya existe un SUPERADMIN")
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        existing.name = data.name
        existing.password_hash = hash_password(data.password)
        existing.role = "superadmin"
        existing.is_active = True
        user = existing
    else:
        user = User(name=data.name, email=data.email.lower(), password_hash=hash_password(data.password), role="superadmin")
        db.add(user)
    db.commit(); db.refresh(user)
    return {"ok":True,"id":user.id,"email":user.email,"role":user.role}

@app.patch("/me/email")
def update_my_email(
    data: EmailUpdateIn,
    user: User = Depends(current_user),
    db: Session = Depends(get_db)
):
    new_email = data.email.lower()

    existing = db.query(User).filter(
        User.email == new_email,
        User.id != user.id
    ).first()

    if existing:
        raise HTTPException(400, "Ese email ya está registrado")

    user.email = new_email
    db.commit()
    db.refresh(user)

    return {
        "ok": True,
        "id": user.id,
        "email": user.email,
        "role": user.role
    }
