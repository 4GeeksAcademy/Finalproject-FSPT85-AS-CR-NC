
import click
from api.models import db, Usuario, Vehiculo, Reserva
from flask import Flask
from datetime import datetime, timedelta

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = Usuario(
                email=f"test_user{x}@test.com",
                contraseña="123456", 
                nombre=f"Usuario{x}",
                apellidos="Test",
                direccion="Calle Falsa 123",
                poblacion="Madrid",
                telefono="600123456",
                fecha_nacimiento=datetime(1990, 1, 1),
                fecha_obtencion_carnet=datetime(2010, 5, 20)
            )
            db.session.add(user)
            db.session.commit()
            print(f"{count} usuarios de prueba creados.")

    @app.cli.command("insert-test-vehiculos")
    def insert_test_vehiculos():
        print("Creating test vehiculos")
        vehiculos = [
            Vehiculo(marca="Toyota", modelo="Corolla", potencia="120 CV", plazas=5, combustible="Gasolina",
                     autonomia="700 km", foto="url_foto_1", año=2022, precio_por_dia=50.0),
            Vehiculo(marca="Ford", modelo="Focus", potencia="150 CV", plazas=5, combustible="Diesel",
                     autonomia="800 km", foto="url_foto_2", año=2021, precio_por_dia=45.0),
        ]
        db.session.add_all(vehiculos)
        db.session.commit()
        print("Vehículos de prueba creados.")


    @app.cli.command("insert-test-reservas")
    def insert_test_reservas():
        print("Creating test reservas")
        usuario = Usuario.query.first() 
        vehiculo = Vehiculo.query.first() 
        
        if not usuario or not vehiculo:
            print("No hay usuarios o vehículos en la base de datos.")
            return
        
        reserva = Reserva(
            usuario_id=usuario.id,
            vehiculo_id=vehiculo.id,
            fecha_inicio=datetime.now(),
            fecha_fin=datetime.now() + timedelta(days=5),
            destino="Barcelona",
            estado="pendiente"
        )
        db.session.add(reserva)
        db.session.commit()
        print("Reserva de prueba creada.")


    @app.cli.command("insert-test-data")
    def insert_test_data():
        """ Inserta usuarios, vehículos y reservas de prueba en una sola ejecución """
        insert_test_users("3")
        insert_test_vehiculos()
        insert_test_reservas()
        print("Base de datos poblada con datos de prueba.")