import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import imagehome from "../../img/home.jpg" 


export const Home = () => {
	const { store, actions } = useContext(Context);
    const primerostresVehiculos = store.vehicles.slice(0, 3);

	return (
		<div className="text-center">
			<img src={imagehome} className="img-fluid" alt="..." />
            <h1 className="mt-5 mb-5 fs-3">Bienvenidos a @4Cars, tu alquiler fácil</h1>
            <div className="container text-center mb-3 pt-3 border border-start-0 border-end-0">
                <div className="row">
                    <div className="col">
                        <div className="card mb-3" style={{ maxWidth: "400px" }}>
                            <div className="row g-0">
                                <div className="col-md-4">
                                <img src="..." className="img-fluid rounded-start" alt="..." />
                                </div>
                                <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">This is a wider card with supporting text below</p>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card mb-3" style={{ maxWidth: "400px" }}>
                            <div className="row g-0">
                                <div className="col-md-4">
                                <img src="..." className="img-fluid rounded-start" alt="..." />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">Card title</h5>
                                        <p className="card-text">This is a wider card with supporting text below</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                    <div className="card mb-3" style={{ maxWidth: "400px" }}>
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img src="..." className="img-fluid rounded-start" alt="..." />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">This is a wider card with supporting text below</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 className="mt-5 mb-5 fs-4">Vehículos más populares</h3>
            {primerostresVehiculos.length > 0 ? (
                primerostresVehiculos.map((vehicle, index) => (
                    <div
                        key={index}
                        className="card mb-3 mx-auto"
                        style={{ maxWidth: "800px" }}
                    >
                        <div className="row no-gutters">
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{`${vehicle.marca} ${vehicle.modelo}`}</h5>
                                    <p className="card-text">
                                        <strong>Potencia:</strong> {vehicle.potencia}<br />
                                        <strong>Plazas:</strong> {vehicle.plazas}<br />
                                        <strong>Combustible:</strong> {vehicle.combustible}<br />
                                        <strong>Autonomía:</strong> {vehicle.autonomia}<br />
                                        <strong>Año:</strong> {vehicle.año}<br />
                                        <strong>Precio por día:</strong> {vehicle.precio_por_dia.toFixed(2)} €
                                    </p>
                                    <Link to={`/vehicle/${vehicle.id}`} className="btn btn-primary">
                                        Ver detalles
                                    </Link>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <img
                                    src={vehicle.foto}
                                    alt={`${vehicle.marca} ${vehicle.modelo}`}
                                    className="card-img"
                                />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>Cargando vehículos...</p>
            )}
		</div>
	);
};
