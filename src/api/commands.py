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
            #Turismos
            Vehiculo(marca="Volkswagen", modelo="Golf", potencia="150 CV", plazas=5, combustible="Diesel",
                     autonomia="850 km", foto="url_foto_1", año=2022, precio_por_dia=35.0, descripcion="El Volkswagen Golf 2022 es la opción ideal para quienes buscan un coche potente, económico y cómodo. Con su motor de 150 CV y una autonomía de 850 km, podrás recorrer grandes distancias con total tranquilidad, disfrutando de una conducción suave y segura. Su diseño moderno y elegante, junto a su capacidad para 5 plazas, lo convierte en el compañero perfecto para viajes largos, escapadas de fin de semana o traslados de negocios. Este modelo es perfecto para quienes buscan un vehículo versátil que se adapte a diferentes necesidades. Ya sea que necesites eficiencia en el combustible o un coche cómodo y fiable, el Volkswagen Golf 2022 lo tiene todo. ¡No dudes en reservarlo y disfruta de una experiencia de conducción única!"),
            Vehiculo(marca="Toyota", modelo="Corolla Hybrid", potencia="140 CV", plazas=5, combustible="Híbrido",
                     autonomia="900 km", foto="url_foto_3", año=2023, precio_por_dia=35.0, descripcion="El Toyota Corolla Hybrid 2023 es la opción perfecta para quienes buscan un coche que combine rendimiento, confort y sostenibilidad. Con su motor híbrido de 140 CV y una autonomía de 900 km, este vehículo te ofrece lo mejor de dos mundos: la eficiencia del motor eléctrico y la potencia del motor de combustión. Su capacidad para 5 plazas hace de este modelo una opción ideal para familias o grupos de amigos que deseen disfrutar de un viaje cómodo y eco-amigable. Diseñado para ofrecer la máxima eficiencia en consumo de combustible, el Corolla Hybrid 2023 es perfecto para quienes buscan un coche económico sin sacrificar el confort. Ideal para recorrer largas distancias o para el día a día, este modelo destaca por su fiabilidad, tecnología avanzada y su compromiso con el medio ambiente. ¡Haz tu reserva y comienza a disfrutar de la conducción híbrida de última generación!"),
            Vehiculo(marca="Renault", modelo="Zoe", potencia="110 CV", plazas=5, combustible="Eléctrico",
                     autonomia="400 km", foto="url_foto_3", año=2023, precio_por_dia=35.0, descripcion="El Renault Zoe 2023 es el coche eléctrico ideal para aquellos que desean una conducción ágil, ecológica y moderna. Con 110 CV de potencia y una autonomía de hasta 400 km, este compacto eléctrico está diseñado para maximizar tu experiencia de conducción sin preocuparte por el impacto ambiental. Su capacidad para 5 plazas lo convierte en una opción perfecta tanto para trayectos urbanos como para escapadas por carretera. Este modelo se destaca por su tecnología de vanguardia y eficiencia energética, brindándote una conducción silenciosa y suave. Si estás buscando un coche que ofrezca el equilibrio perfecto entre sostenibilidad y rendimiento, el Renault Zoe 2023 es tu mejor elección. Reserva el tuyo y comienza a disfrutar de la libertad de conducir sin emisiones, mientras aprovechas todas las ventajas que te ofrece un coche eléctrico de última generación."),
            #Sedan/Berlinas
            Vehiculo(marca="BMW", modelo="Serie 3", potencia="286 CV", plazas=5, combustible="Diesel",
                     autonomia="950 km", foto="url_foto_2", año=2022, precio_por_dia=40.0, descripcion="El BMW Serie 3 2022 es un sedán deportivo que combina 286 CV de potencia, un diseño sofisticado y un rendimiento excepcional. Con una autonomía de hasta 950 km, este modelo es ideal para quienes buscan comodidad y potencia en cada trayecto, ya sea en la ciudad o en la carretera. Sus 5 plazas ofrecen un interior espacioso y cómodo, perfecto para viajes largos o para disfrutar de un día de conducción sin preocupaciones. Este vehículo no solo destaca por su rendimiento en carretera, sino también por su tecnología avanzada y su capacidad para ofrecer una experiencia de conducción única. Si deseas combinar elegancia, eficiencia y una potencia inigualable, el BMW Serie 3 2022 es la elección perfecta. ¡Haz tu reserva ahora y vive la experiencia de conducir un auténtico símbolo de la ingeniería alemana!"),
            Vehiculo(marca="Hyundai", modelo="Ioniq Hybrid", potencia="141 CV", plazas=5, combustible="Híbrido",
                     autonomia="1000 km", foto="url_foto_3", año=2023, precio_por_dia=40.0, descripcion="El Hyundai Ioniq Hybrid 2023 es el vehículo perfecto para quienes buscan un equilibrio entre potencia, sostenibilidad y eficiencia. Con 141 CV, este modelo híbrido ofrece una autonomía de hasta 1000 km, permitiéndote disfrutar de largos viajes con menos paradas para recargar y reduciendo al mínimo tu impacto ambiental. Su diseño moderno y aerodinámico se complementa con un interior cómodo, perfecto para hasta 5 personas. Equipado con las últimas innovaciones en tecnología híbrida, el Ioniq Hybrid 2023 garantiza una conducción suave y eficiente tanto en la ciudad como en la carretera. Con este vehículo, no solo estarás apostando por un rendimiento excepcional, sino también por un futuro más verde y sostenible. Si deseas una opción moderna y ecológica, el Hyundai Ioniq Hybrid 2023 es la elección ideal para tu próxima aventura. ¡Haz tu reserva y disfruta de la conducción responsable hoy mismo!"),
            Vehiculo(marca="Tesla", modelo="Model 3", potencia="283 CV", plazas=5, combustible="Eléctrico",
                     autonomia="600 km", foto="url_foto_3", año=2023, precio_por_dia=40.0, descripcion="El Tesla Model 3 2023 redefine lo que significa conducir un vehículo eléctrico. Con 283 CV y una autonomía de hasta 600 km, este elegante sedán ofrece un rendimiento impresionante, permitiéndote realizar viajes largos sin comprometer la sostenibilidad. Equipado con tecnología de punta, el Model 3 combina un diseño minimalista y moderno con una conducción ultra silenciosa y ágil que hará que cada trayecto sea una experiencia única. Con capacidad para 5 pasajeros, el Tesla Model 3 2023 no solo destaca por su eficiencia energética, sino también por su confort y versatilidad. Ideal tanto para recorridos urbanos como para aventuras en carretera, este vehículo representa el futuro de la movilidad. Aprovecha la oportunidad de conducir un vehículo totalmente eléctrico, sin sacrificar rendimiento, confort o estilo. ¡Reserva el Tesla Model 3 2023 y vive la innovación eléctrica como nunca antes!"),
            #Furgonetas
            Vehiculo(marca="Ford", modelo="Transit Custom", potencia="170 CV", plazas=9, combustible="Diesel",
                     autonomia="850 km", foto="url_foto_3", año=2023, precio_por_dia=45.0, descripcion="La Ford Transit Custom 2023 es la furgoneta ideal para quienes necesitan potencia, espacio y fiabilidad. Con 170 CV y una autonomía de 850 km, esta furgoneta está diseñada para afrontar cualquier desafío, ya sea en la ciudad o en carretera. Con capacidad para 9 personas, es la opción perfecta para traslados de grupos grandes o para aquellos que requieren gran capacidad de carga sin sacrificar el confort. El Ford Transit Custom es más que una furgoneta; es tu aliado de confianza para el trabajo, el ocio o cualquier necesidad de transporte. Diseñada para ofrecer versatilidad, tiene espacio suficiente para todo lo que necesites, además de un rendimiento eficiente y robusto que garantiza su durabilidad en todo tipo de condiciones. Si buscas una furgoneta que combine practicidad y confort, elige la Transit Custom 2023. ¡Reserva hoy mismo y haz tu trabajo más fácil y cómodo!"),
            Vehiculo(marca="Toyota", modelo="Proace Verso Hibryd", potencia="180 CV", plazas=9, combustible="Híbrido",
                     autonomia="900 km", foto="url_foto_3", año=2022, precio_por_dia=45.0, descripcion="La Toyota Proace Verso Híbrido 2022 es una furgoneta que no solo ofrece potencia y capacidad, sino también una alternativa más ecológica y eficiente. Con 180 CV y una autonomía de 900 km, este modelo híbrido combina lo mejor de dos mundos: la eficiencia del combustible híbrido con el poder necesario para transporte de 9 personas de manera cómoda y confiable. Ideal para viajes largos, excursiones familiares o traslados de grupos, la Proace Verso Híbrido te permitirá disfrutar de un viaje cómodo, con el espacio adecuado para todos los pasajeros y equipaje. Además, su tecnología híbrida reduce las emisiones, brindándote una experiencia más ecológica y rentable, sin comprometer el rendimiento. Si buscas una furgoneta amigable con el medio ambiente, pero sin sacrificar comodidad ni capacidad, la Toyota Proace Verso Híbrido 2022 es la opción perfecta para ti. ¡Reserva ahora y comienza tu próxima aventura con estilo y sostenibilidad!"),
            Vehiculo(marca="Mercedes-Benz", modelo="eVito Tourer", potencia="283 CV", plazas=8, combustible="Eléctrico",
                     autonomia="370 km", foto="url_foto_3", año=2023, precio_por_dia=45.0, descripcion="El Mercedes-Benz eVito Tourer 2023 es la opción ideal para quienes buscan una furgoneta eléctrica que combine potencia, espacio y tecnología avanzada. Con 283 CV y una autonomía de 370 km, este vehículo eléctrico está diseñado para transportar hasta 8 personas con la máxima comodidad, sin comprometer la sostenibilidad. Perfecto para empresas, familias numerosas o cualquier grupo que desee viajar de manera eficiente y respetuosa con el medio ambiente. La eVito Tourer 2023 ofrece un confort superior, con amplios asientos y un sistema de conducción silencioso y suave, lo que garantiza una experiencia de viaje excepcional. Su motor eléctrico te permitirá moverte sin ruidos molestos y sin emisiones, mientras disfrutas de la fiabilidad y prestigio que solo Mercedes-Benz puede ofrecer. Si necesitas una solución de transporte eléctrica y moderna para tu grupo, ¡el eVito Tourer es la furgoneta perfecta para ti!"),

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