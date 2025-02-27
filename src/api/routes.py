"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Usuario, Vehiculo, Reserva
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, decode_token
from datetime import datetime, timedelta
from dateutil import parser
from psycopg2.errors import UniqueViolation
from sqlalchemy.exc import IntegrityError
import logging

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


# Endpoint para crear un usuario (Signup)
@api.route('/signup', methods=['POST'])
def create_user():
    data = request.get_json()
    try:
        required_fields = ['email', 'contraseña', 'nombre', 'apellidos', 'direccion', 
                           'poblacion', 'telefono', 'fecha_nacimiento', 'fecha_obtencion_carnet']
        if not all(key in data for key in required_fields):
            return jsonify({"msg": "Faltan campos obligatorios"}), 400

        hashed_password = generate_password_hash(data['contraseña'])
        new_user = Usuario(
            email=data['email'],
            contraseña=hashed_password,
            nombre=data['nombre'],
            apellidos=data['apellidos'],
            direccion=data['direccion'],
            poblacion=data['poblacion'],
            telefono=data['telefono'],
            fecha_nacimiento=datetime.fromisoformat(data['fecha_nacimiento']),
            fecha_obtencion_carnet=datetime.fromisoformat(data['fecha_obtencion_carnet'])
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Usuario creado exitosamente",
                        "usuario": {
                "id": new_user.id,
                "email": new_user.email,
                "nombre": new_user.nombre,
                "apellidos": new_user.apellidos,
                "direccion": new_user.direccion,
                "poblacion": new_user.poblacion,
                "telefono": new_user.telefono,
                "fecha_nacimiento": new_user.fecha_nacimiento.isoformat(),
                "fecha_obtencion_carnet": new_user.fecha_obtencion_carnet.isoformat()
            }
            }), 201

    except IntegrityError as e:
        db.session.rollback()
        if isinstance(e.orig, UniqueViolation):
            return jsonify({"msg": "El correo electrónico ya está en uso. Intenta con otro."}), 400
        return jsonify({"msg": "Error en la base de datos"}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500
    
# Endpoint para login con depuración
@api.route('/login', methods=['OPTIONS', 'POST'])
def login():
    if request.method == "OPTIONS":
        response = jsonify({"msg": "OK"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response, 200

    data = request.get_json()
    if not data or "email" not in data or "contraseña" not in data:
        response = jsonify({"msg": "Faltan datos en la solicitud"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 400

    try:
        user = Usuario.query.filter_by(email=data['email']).first()
        if user is None or not check_password_hash(user.contraseña, data['contraseña']):
            response = jsonify({"msg": "Credenciales incorrectas"})
            response.headers.add("Access-Control-Allow-Origin", "*")
            return response, 401

        access_token = create_access_token(identity=str(user.id))
        response = jsonify({
            "msg": "Login successful",
            "access_token": access_token,
            "usuario": {
                "id": user.id,
                "email": user.email,
                "nombre": user.nombre,
                "apellidos": user.apellidos,
                "direccion": user.direccion,
                "poblacion": user.poblacion,
                "telefono": user.telefono,
                "fecha_nacimiento": user.fecha_nacimiento.isoformat(),
                "fecha_obtencion_carnet": user.fecha_obtencion_carnet.isoformat()
            }
        })
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    except Exception as e:
        response = jsonify({"msg": str(e)})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 500
    

# Endpoint para crear una reserva
@api.route('/create-reservation', methods=['POST'])
def create_reservation():
    data = request.get_json()
    try:
        required_fields = ['fecha_inicio', 'fecha_fin', 'vehiculo_id']
        if not all(key in data for key in required_fields):
            return jsonify({"msg": "Faltan campos obligatorios"}), 400

        try:
            fecha_inicio = datetime.fromisoformat(data['fecha_inicio'])
            fecha_fin = datetime.fromisoformat(data['fecha_fin'])
        except ValueError:
            return jsonify({"msg": "Formato de fecha inválido. Usa ISO 8601."}), 400

        vehiculo = Vehiculo.query.get(data['vehiculo_id'])
        if not vehiculo:
            return jsonify({"msg": "Vehículo no encontrado"}), 404

        new_reservation = Reserva(
            fecha_inicio=fecha_inicio,
            fecha_fin=fecha_fin,
            vehiculo_id=vehiculo.id
        )
        db.session.add(new_reservation)
        db.session.commit()
        return jsonify({"msg": "Reserva creada exitosamente", "reservation": new_reservation.serialize()}), 201

    except Exception as e:
        return jsonify({"msg": str(e)}), 500



# Endpoint para reseteo de contraseña
@api.route('/reset-password', methods=['POST'])
def reset_password_endpoint():
    data = request.get_json()
    if not data or "email" not in data:
        logging.debug("No se proporcionó el correo.")
        return jsonify({"msg": "El correo es obligatorio"}), 400

    email = data["email"]
    user = Usuario.query.filter_by(email=email).first()
    if not user:
        logging.debug("El usuario con email %s no existe.", email)
        return jsonify({"msg": "Si el correo existe, se ha generado el enlace para reiniciar la contraseña."}), 200

    token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=1))
    
    # Usa FRONTEND_URL si está definida, de lo contrario usa request.host_url
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url:
        reset_link = f"{frontend_url}/passwordupdate?token={token}"
    else:
     reset_link = f"{request.host_url}passwordupdate?token={token}"
    
    logging.debug("Enlace generado para reseteo: %s", reset_link)
    
    # Retornamos el enlace y el email para que el frontend lo use
    return jsonify({
        "msg": "Si el correo existe, se ha generado el enlace para reiniciar la contraseña.",
        "reset_link": reset_link,
        "to_email": email
    }), 200

@api.route('/update-password', methods=['PUT'])
def update_password():
    data = request.get_json()
    if not data or "token" not in data or "new_password" not in data:
        logging.debug("Token o nueva contraseña no proporcionados.")
        return jsonify({"msg": "Token y nueva contraseña son requeridos."}), 400

    token = data["token"]
    new_password = data["new_password"]

    try:
        # Decodificar el token para obtener el id del usuario (sub)
        decoded_token = decode_token(token)
        user_id = decoded_token.get("sub")
        if not user_id:
            logging.debug("Token inválido, no se encontró el 'sub'.")
            return jsonify({"msg": "Token inválido."}), 400

        # Buscar al usuario en la base de datos
        user = Usuario.query.get(user_id)
        if not user:
            logging.debug("Usuario con id %s no encontrado.", user_id)
            return jsonify({"msg": "Usuario no encontrado."}), 404

        # Actualizar la contraseña
        user.contraseña = generate_password_hash(new_password)
        db.session.commit()

        logging.debug("Contraseña actualizada para el usuario %s.", user.email)
        return jsonify({"msg": "Contraseña actualizada exitosamente."}), 200

    except Exception as e:
        logging.error("Error actualizando la contraseña: %s", str(e))
        return jsonify({"msg": "Error actualizando la contraseña.", "error": str(e)}), 500



#endpoint para obtener una lista de vehiculos
@api.route('/vehicles', methods=['GET'])
def get_vehicles():
    try:
        vehicles = Vehiculo.query.all()
        
        serialized_vehicles = [vehicle.serialize() for vehicle in vehicles]
        
        return jsonify(serialized_vehicles), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch vehicles", "details": str(e)}), 500
    
@api.route('/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    try:
        # Consulta el vehículo por su ID
        vehicle = Vehiculo.query.get(vehicle_id)
        
        if not vehicle:
            return jsonify({"error": "Vehicle not found"}), 404
        
        # Serializa y devuelve el vehículo
        return jsonify(vehicle.serialize()), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch vehicle", "details": str(e)}), 500