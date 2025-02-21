import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
import "../../styles/home.css";
import imagehome from "../../img/home.jpg"
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faTruckFast, faHouse, faPhone } from '@fortawesome/free-solid-svg-icons'


export const Home = () => {
    const { store } = useContext(Context);
    const primerostresVehiculos = store.vehicles.slice(0, 3);

	return (
		<div className="text-center">
			<img src={imagehome} className="img-fluid" alt="..." />
            <h1 className="mt-3 mb-5 fs-3" style={{ color: "#112d4e" }}>Bienvenidos a @4Cars, tu alquiler fácil</h1>
            
            <h3 className="mt-5 mb-5 fs-4" style={{ color: "#112d4e" }}>Vehículos más populares</h3>
            {primerostresVehiculos.length > 0 ? (
                primerostresVehiculos.map((vehicle, index) => (
                    <div key={index} className="card mb-3 mx-auto p-5 mb-5" style={{ maxWidth: "1200px", border: "2px solid #112d4e" }}>
                        <div className="row no-gutters">
                            <div className="col-md-4">
                                <div className="card-body">
                                    <h5 className="card-title" style={{ color: "#112d4e" }}>{`${vehicle.marca} ${vehicle.modelo}`}</h5>
                                    <p className="card-text">
                                        <strong>Potencia:</strong> {vehicle.potencia}<br />
                                        <strong>Plazas:</strong> {vehicle.plazas}<br />
                                        <strong>Combustible:</strong> {vehicle.combustible}<br />
                                        <strong>Autonomía:</strong> {vehicle.autonomia}<br />
                                        <strong>Año:</strong> {vehicle.año}<br />
                                        <strong>Precio por día:</strong> {vehicle.precio_por_dia.toFixed(2)} €
                                    </p>
                                    <Link to={`/vehicle/${vehicle.id}`} className="btn btn-primary" style={{ backgroundColor: "#112d4e", color: "white" }}>Ver detalles</Link>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <img src={vehicle.foto} alt={`${vehicle.marca} ${vehicle.modelo}`} className="card-img" />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>Cargando vehículos...</p>
            )}
            
            <div className="row mt-5 p-5" id="contacto" style={{ border: "2px solid #112d4e" }}>
                <div className="col mx-5">
                <h5 className="card-title my-2" style={{ color: "#112d4e" }}>Más información</h5>
                <p className="py-3">Si tienes cualquier duda por favor deja tus datos y te escribiremos</p>
                <form>
                    <div className="form-group">
                        <label for="formGroupExampleInput">Nombre</label>
                        <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Nombre completo" />
                    </div>
                    <div className="form-group">
                        <label for="formGroupExampleInput2">Email</label>
                        <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Dirección de correo" />
                    </div>
                    <button type="submit" className="btn btn-secondary btn-lg btn-block my-3" style={{ backgroundColor: "#112D4E", color: "white" }}>Enviar</button>
                </form>
                </div>
                <div className="col mx-5">
                <h5 className="card-title my-5" style={{ color: "#112d4e" }}>Llámanos</h5>
                <FontAwesomeIcon icon={faPhone} size="2x" color="#112d4e"/>
                <h2 className="my-3" style={{ color: "#112d4e" }}>911000222</h2>
                <p>Te ofreceremos toda la información que necesites y te asesoraremos sobre las mejores opciones de alquiler para tus necesidades</p>
                </div>
            </div>
        </div>
    );
};
