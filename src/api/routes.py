"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Usuario, Vehiculo, Reserva
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


# @api.route('/hello', methods=['POST', 'GET'])
# def handle_hello():

#     response_body = {
#         "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
#     }

#     return jsonify(response_body), 200

@api.route('/vehicles', methods=['GET'])
def get_vehicles():
    try:
        vehicles = Vehiculo.query.all()
        
        serialized_vehicles = [vehicle.serialize() for vehicle in vehicles]
        
        return jsonify(serialized_vehicles), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch vehicles", "details": str(e)}), 500