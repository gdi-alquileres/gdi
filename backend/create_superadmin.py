from app.db import Base, engine, SessionLocal
from app.models import User
from app.auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

email = input("Email del SUPERADMIN GDI: ").strip().lower()
name = input("Nombre: ").strip() or "Administrador GDI"
password = input("Contraseña inicial: ").strip()

u = db.query(User).filter(User.email == email).first()
if u:
    u.role = "superadmin"
    u.name = name
    u.password_hash = hash_password(password)
else:
    u = User(name=name, email=email, password_hash=hash_password(password), role="superadmin")
    db.add(u)

db.commit()
print("SUPERADMIN listo:", email)
