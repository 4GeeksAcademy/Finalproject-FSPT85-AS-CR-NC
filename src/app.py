import os
from flask import Flask, request, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from api.utils import APIException, generate_sitemap
from api.models import db, Usuario
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# 🔹 Inicializar Flask correctamente
app = Flask(__name__)

# 🔹 Habilitar CORS con soporte de credenciales
CORS(app, supports_credentials=True)

# 🔹 Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# 🔹 Configuración de JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecreta')
jwt = JWTManager(app)

# 🔹 Configuración de rutas y admin
app.register_blueprint(api, url_prefix='/api')
setup_admin(app)
setup_commands(app)

# 🔹 Manejo de errores
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# 🔹 Generación del sitemap
@app.route('/')
def sitemap():
    return generate_sitemap(app)

# 🔹 Endpoint para crear un usuario (Signup)
@app.route('/signup', methods=['POST'])
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

        return jsonify({"msg": "Usuario creado exitosamente", "user": new_user.serialize()}), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

# 🔹 Endpoint para login con depuración
@app.route('/login', methods=['OPTIONS', 'POST'])
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
        response = jsonify({"msg": "Login successful", "access_token": access_token})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    except Exception as e:
        response = jsonify({"msg": str(e)})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 500


# 🔹 Endpoint protegido con JWT
@app.route('/private', methods=['GET'])
@jwt_required()
def private_route():
    current_user_id = get_jwt_identity()
    user = Usuario.query.get(current_user_id)
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({"msg": f"Bienvenido {user.nombre}!", "user": user.serialize()}), 200

# 🔹 Servir archivos estáticos
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# 🔹 Iniciar el servidor
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    print(f"✅ Servidor corriendo en http://localhost:{PORT}")
    app.run(host='0.0.0.0', port=PORT, debug=True)