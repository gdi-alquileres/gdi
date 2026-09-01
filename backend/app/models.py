from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(160), nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), default="owner")  # owner / tenant / admin / superadmin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Property(Base):
    __tablename__ = "properties"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(160), nullable=False)
    property_type = Column(String(40), default="departamento")
    address = Column(String(220), nullable=False)
    city = Column(String(120), default="")
    status = Column(String(30), default="active")
    owner = relationship("User")

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(160), nullable=False)
    dni = Column(String(30), default="")
    cuil = Column(String(30), default="")
    email = Column(String(180), default="")
    phone = Column(String(60), default="")

class Lease(Base):
    __tablename__ = "leases"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    base_rent = Column(Float, nullable=False)
    due_day = Column(Integer, default=10)
    adjustment_method = Column(String(60), default="contractual")
    late_fee_type = Column(String(20), default="daily")
    late_fee_rate = Column(Float, default=0.0)
    grace_days = Column(Integer, default=0)
    status = Column(String(30), default="active")

class Charge(Base):
    __tablename__ = "charges"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lease_id = Column(Integer, ForeignKey("leases.id"), nullable=False)
    period = Column(String(7), nullable=False)
    concept = Column(String(60), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String(30), default="pending")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lease_id = Column(Integer, ForeignKey("leases.id"), nullable=False)
    amount = Column(Float, nullable=False)
    method = Column(String(40), default="manual")
    external_reference = Column(String(120), unique=True, index=True, nullable=True)
    provider_payment_id = Column(String(120), nullable=True)
    provider_status = Column(String(40), default="pending")
    verification_status = Column(String(40), default="pending")
    paid_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Receipt(Base):
    __tablename__ = "receipts"
    id = Column(Integer, primary_key=True)
    payment_id = Column(Integer, ForeignKey("payments.id"), nullable=False)
    number = Column(String(40), unique=True, nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow)


class Guarantor(Base):
    __tablename__ = "guarantors"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lease_id = Column(Integer, ForeignKey("leases.id"), nullable=False)
    name = Column(String(160), nullable=False)
    dni = Column(String(30), default="")
    cuil = Column(String(30), default="")
    guarantee_type = Column(String(60), default="")
    review_status = Column(String(30), default="pending")
