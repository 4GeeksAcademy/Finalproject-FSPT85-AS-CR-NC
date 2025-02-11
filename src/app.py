import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from api.utils import APIException, generate_sitemap
from api.models import db, Usuario, Vehiculo, Reserva
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Configuración del entorno
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Configuración de JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecreta')  # Clave secreta para JWT
jwt = JWTManager(app)

# Configuración de rutas
app.register_blueprint(api, url_prefix='/api')
setup_admin(app)
setup_commands(app)

# Manejo de errores
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Generación del sitemap
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # evitar caché
    return response

# 1. Endpoint para crear un usuario (Signup)
@app.route('/signup', methods=['POST'])
def create_user():
    data = request.get_json()
    try:
        # Validar los datos recibidos
        required_fields = ['email', 'contraseña', 'nombre', 'apellidos', 'direccion', 
                           'poblacion', 'telefono', 'fecha_nacimiento', 'fecha_obtencion_carnet']
        if not all(key in data for key in required_fields):
            return jsonify({"msg": "Missing required fields"}), 400
        
        # Hashear la contraseña antes de guardarla
        hashed_password = generate_password_hash(data['contraseña'])

        # Crear un nuevo usuario
        new_user = Usuario(
            email=data['email'],
            contraseña=hashed_password,  # Guardar la contraseña hasheada
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

        return jsonify({"msg": "User created successfully", "user": new_user.serialize()}), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

# 2. Endpoint para login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        # Buscar al usuario por el correo electrónico
        user = Usuario.query.filter_by(email=data['email']).first()
        
        # Verificar que el usuario existe y la contraseña es correcta
        if user is None or not check_password_hash(user.contraseña, data['contraseña']):
            return jsonify({"msg": "Invalid credentials"}), 401
        
        # Crear un token JWT para el usuario
        access_token = create_access_token(identity=str(user.id))

        return jsonify({"msg": "Login successful", "access_token": access_token}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

# 3. Endpoint protegido /private
@app.route('/private', methods=['GET'])
@jwt_required()  # Este decorador requiere que el usuario esté autenticado
def private_route():
    current_user_id = get_jwt_identity()  # Obtiene el ID del usuario actual del token
    user = Usuario.query.get(current_user_id)  # Busca al usuario en la base de datos
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({"msg": f"Welcome {user.nombre}!", "user": user.serialize()}), 200

# Este solo se ejecuta si se corre `python app.py`
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
