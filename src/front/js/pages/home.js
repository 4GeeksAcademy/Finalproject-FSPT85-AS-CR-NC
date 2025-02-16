import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
    const primerostresVehiculos = store.vehicles.slice(0, 3);

	return (
		<div className="text-center">
			<img src="https://www.enterprise.es/content/dam/ecom/utilitarian/emea/meet-the-fleet/one-enterprise-fleet-emea.jpg" className="img-fluid" alt="..." />
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
