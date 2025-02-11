from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, DateTime, Float
from datetime import datetime

db = SQLAlchemy()

# Tabla de Usuario
class Usuario(db.Model):
    __tablename__ = 'usuario'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    contraseña: Mapped[str] = mapped_column(String(400), nullable=False)
    nombre: Mapped[str] = mapped_column(String(80), nullable=False)
    apellidos: Mapped[str] = mapped_column(String(160), nullable=False)
    direccion: Mapped[str] = mapped_column(String(200), nullable=False)
    poblacion: Mapped[str] = mapped_column(String(80), nullable=False)
    telefono: Mapped[str] = mapped_column(String(20), nullable=False)
    fecha_nacimiento: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    fecha_obtencion_carnet: Mapped[DateTime] = mapped_column(DateTime, nullable=False)

    reservas = relationship("Reserva", back_populates="usuario")

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "apellidos": self.apellidos,
            "direccion": self.direccion,
            "poblacion": self.poblacion,
            "telefono": self.telefono,
            "fecha_nacimiento": self.fecha_nacimiento.isoformat(),
            "fecha_obtencion_carnet": self.fecha_obtencion_carnet.isoformat()
        }

# Tabla de Vehículo
class Vehiculo(db.Model):
    __tablename__ = 'vehiculo'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    marca: Mapped[str] = mapped_column(String(100), nullable=False)
    modelo: Mapped[str] = mapped_column(String(100), nullable=False)
    potencia: Mapped[str] = mapped_column(String(10), nullable=False)
    plazas: Mapped[int] = mapped_column(Integer, nullable=False)
    combustible: Mapped[str] = mapped_column(String(20), nullable=False)
    autonomia: Mapped[str] = mapped_column(String(20), nullable=False)
    foto: Mapped[str] = mapped_column(String(300), nullable=False)
    año: Mapped[int] = mapped_column(Integer, nullable=False)
    precio_por_dia: Mapped[float] = mapped_column(Float, nullable=False)

    reservas = relationship("Reserva", back_populates="vehiculo")

    def serialize(self):
        return {
            "id": self.id,
            "marca": self.marca,
            "modelo": self.modelo,
            "potencia" : self.potencia,
            "plazas": self.plazas,
            "combustible": self.combustible,
            "autonomia": self.autonomia,
            "foto": self.foto,
            "año": self.año,
            "precio_por_dia": self.precio_por_dia
        }

# Tabla de Reserva (Historial de reservas/favoritos)
class Reserva(db.Model):
    __tablename__ = 'reserva'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey('usuario.id'), nullable=False)
    vehiculo_id: Mapped[int] = mapped_column(Integer, ForeignKey('vehiculo.id'), nullable=False)
    fecha_inicio: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    fecha_fin: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    destino: Mapped[str] = mapped_column(String(200), nullable=False)
    estado: Mapped[str] = mapped_column(String(50), nullable=False, default="pendiente")

    usuario = relationship("Usuario", back_populates="reservas")
    vehiculo = relationship("Vehiculo", back_populates="reservas")

    def calcular_dias_reserva(self):
        """Calcula la cantidad de días de la reserva."""
        return (self.fecha_fin - self.fecha_inicio).days

    def calcular_precio_total(self):
        """Calcula el precio total de la reserva."""
        dias = self.calcular_dias_reserva()
        return dias * self.vehiculo.precio_por_dia

    def serialize(self):
        return {
            "id": self.id,
            "nombre_usuario": self.usuario.nombre,
            "marca_modelo": f"{self.vehiculo.marca} {self.vehiculo.modelo}",
            "dias_reserva": self.calcular_dias_reserva(),
            "precio_total": round(self.calcular_precio_total(), 2),
            "destino": self.destino,
            "fecha_inicio": self.fecha_inicio.isoformat(),
            "fecha_fin": self.fecha_fin.isoformat(),
            "estado": self.estado
        }