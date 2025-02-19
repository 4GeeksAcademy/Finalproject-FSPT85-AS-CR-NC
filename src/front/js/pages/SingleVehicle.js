import React, { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/singleVehicle.css";
import { Modal, Button, Carousel } from "react-bootstrap";
import { DateRange } from "react-date-range";
import Swal from 'sweetalert2';

export const SingleVehicle = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dateRange, setDateRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: "selection"
    }]);

    useEffect(() => {
        actions.fetchVehicleById(id);
    }, [id]);

    if (!store.selectedVehicle) {
        return <div>Loading vehicle...</div>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Lógica para asegurarte de que los campos no estén vacíos
        if (!name || !email || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all fields!',
            });
            return;
        }

        // Mostrar una alerta de éxito si todo está bien
        Swal.fire({
            icon: 'success',
            title: 'Welcome!',
            text: `Welcome, ${name}. Your registration was successful.`,
        });

        // Aquí podrías hacer la lógica para enviar los datos al servidor, etc.
    };

    const handleConfirm = () => {
        const startDate = dateRange[0].startDate;
        const endDate = dateRange[0].endDate;
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        if (!store.selectedVehicle) {
            alert("No se encontraron datos del vehículo. Inténtalo de nuevo.");
            return;
        }

        const vehicleData = store.selectedVehicle;

        navigate("/checkout", {
            state: {
                startDate,
                endDate,
                totalDays,
                ...vehicleData
            }
        });
    };

    const { marca, modelo, potencia, plazas, combustible, autonomia, foto, año, precio_por_dia } = store.selectedVehicle;

    return (
        <div>
            <div className="text-center mt-5">
                <h1>Características del vehículo</h1>
            </div>

            {/* Carrousel de imágenes principales con placeholders */}
            <div className="container mt-4">
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://placehold.co/500x300"
                            alt="Placeholder slide 1"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://placehold.co/500x300"
                            alt="Placeholder slide 2"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://placehold.co/500x300"
                            alt="Placeholder slide 3"
                        />
                    </Carousel.Item>
                </Carousel>
            </div>

            {/* Parte de la información y el carrousel pequeño */}
        <div>
            <div className="container mt-5">
                <div className="row">
                    {/* Columna de información */}
                    <div className="col-md-6">
                        <div className="card">
                            <img
                                src={foto || "https://via.placeholder.com/800x400?text=Main+Vehicle+Image"}
                                className="card-img-top"
                                alt={`${marca} ${modelo}`}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{`${marca} ${modelo}`}</h5>
                                <p className="card-text">
                                    <strong>Potencia:</strong> {potencia}<br />
                                    <strong>Plazas:</strong> {plazas}<br />
                                    <strong>Combustible:</strong> {combustible}<br />
                                    <strong>Autonomía:</strong> {autonomia}<br />
                                    <strong>Año:</strong> {año}<br />
                                    <strong>Precio por día:</strong> {precio_por_dia.toFixed(2)} €
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Columna de precio y reserva */}
                    <div className="col-md-6 d-flex flex-column align-items-center">
                        <div className="card text-center p-3 w-100">
                        <Carousel className="mb-3">
                            <Carousel.Item>
                                <img className="d-block w-100" src="https://placehold.co/300x200" alt="Placeholder 1" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className="d-block w-100" src="https://placehold.co/300x200" alt="Placeholder 2" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className="d-block w-100" src="https://placehold.co/300x200" alt="Placeholder 3" />
                            </Carousel.Item>
                        </Carousel>
                            <h3 className="fw-bold">{precio_por_dia.toFixed(2)} € / día</h3>
                            <Button variant="primary" className="mt-2 w-100" onClick={() => setShowModal(true)}>
                                Reserva ya
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de información adicional y contacto */}
            <div className="container mt-5">
                <div className="row">
                    {/* Formulario de registro */}
                    <div className="col-md-6">
                        <h3>Más información</h3>
                        <p>Contáctanos sin compromiso para obtener mas informacion sobre el vehiculo.</p>
                        <form onSubmit={handleSubmit}>
                            <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                            <input
                            type="email"
                            className="form-control mb-2"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                            type="password"
                            className="form-control mb-2"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button variant="dark" className="w-100" type="submit">
                                CLICK PARA MAS INFO
                            </Button>
                        </form>
                    </div>
                    {/* Sección de contacto */}
                    <div className="col-md-6 text-center">
                        <h3>Llámanos</h3>
                        <p><strong>📞 912 365 897</strong></p>
                        <p>No dudes en ponerte en contacto con nosotros, estaremos encantados de atenderte y resolver cualquier pregunta que tengas. Nuestro equipo está siempre disponible para ofrecerte el mejor servicio y garantizar que tu experiencia sea satisfactoria. ¡Llámanos ahora y hablemos sobre cómo podemos ayudarte!</p>
                    </div>
                </div>
            </div>

            {/* Modal de selección de fechas */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecciona un rango de fechas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DateRange
                        editableDateInputs={true}
                        onChange={item => setDateRange([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Confirmar reserva
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </div>
    );
};