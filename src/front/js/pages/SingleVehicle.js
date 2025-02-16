import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import "../../styles/home.css";
import { Carousel, Button } from "react-bootstrap";

export const SingleVehicle = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();

    useEffect(() => {
        actions.fetchVehicleById(id);
    }, [id]);

    if (!store.selectedVehicle) {
        return <div>Loading vehicle...</div>;
    }

    const { marca, modelo, potencia, plazas, combustible, autonomia, foto, año, precio_por_dia } =
        store.selectedVehicle;

    return (
        <div>
            <div className="text-center mt-5">
                <h1>Vehicle Details</h1>
            </div>

            {/* Carrusel de imágenes */}
            <div className="container mt-4">
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://via.placeholder.com/800x300?text=Image+1"
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://via.placeholder.com/800x300?text=Image+2"
                            alt="Second slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://via.placeholder.com/800x300?text=Image+3"
                            alt="Third slide"
                        />
                    </Carousel.Item>
                </Carousel>
            </div>

            {/* Parte de la info y el carrousel pequeño */}
            <div className="container mt-5">
                <div className="row">
                    {/* Columna de info */}
                    <div className="col-md-6">
                        <div className="card full-width">
                            <img
                                src={foto}
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

                    {/* Columna de fotos + precio y reserva */}
                    <div className="col-md-6 d-flex flex-column align-items-center">
                        <Carousel className="mb-3">
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://via.placeholder.com/300x150?text=Image+1"
                                    alt="First slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://via.placeholder.com/300x150?text=Image+2"
                                    alt="Second slide"
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src="https://via.placeholder.com/300x150?text=Image+3"
                                    alt="Third slide"
                                />
                            </Carousel.Item>
                        </Carousel>

                        {/* Div precio y reserva */}
                        <div className="card text-center p-3 full-width">
                            <h3 className="fw-bold">{precio_por_dia.toFixed(2)} € / día</h3>
                            <Button variant="primary" className="mt-2 w-100">
                                Reserva ya
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};