from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class PropertyIn(BaseModel):
    name: str
    property_type: str = "departamento"
    address: str
    city: str = ""

class TenantIn(BaseModel):
    name: str
    dni: str = ""
    cuil: str = ""
    email: str = ""
    phone: str = ""

class LeaseIn(BaseModel):
    property_id: int
    tenant_id: int
    start_date: date
    end_date: date
    base_rent: float
    due_day: int = 10
    adjustment_method: str = "contractual"
    late_fee_type: str = "daily"
    late_fee_rate: float = 0
    grace_days: int = 0

class ChargeIn(BaseModel):
    lease_id: int
    period: str
    concept: str
    amount: float
    due_date: date

class ManualPaymentIn(BaseModel):
    lease_id: int
    amount: float
    method: str = "transferencia"

class MercadoPagoOrderIn(BaseModel):
    lease_id: int
    amount: float
    period: str


class GuarantorIn(BaseModel):
    lease_id: int
    name: str
    dni: str = ""
    cuil: str = ""
    guarantee_type: str = ""
