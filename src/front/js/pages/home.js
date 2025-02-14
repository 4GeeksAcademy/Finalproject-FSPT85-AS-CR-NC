import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center">
			<img src="https://www.enterprise.es/content/dam/ecom/utilitarian/emea/meet-the-fleet/one-enterprise-fleet-emea.jpg" className="img-fluid" alt="..." />
        

			<h2>Lista vehículos</h2>
            {store.vehicles.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Potencia</th>
                            <th>Plazas</th>
                            <th>Combustible</th>
                            <th>Autonomía</th>
                            <th>Foto</th>
                            <th>Año</th>
                            <th>Precio por día</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.id}</td>
                                <td>{vehicle.marca}</td>
                                <td>{vehicle.modelo}</td>
                                <td>{vehicle.potencia}</td>
                                <td>{vehicle.plazas}</td>
                                <td>{vehicle.combustible}</td>
                                <td>{vehicle.autonomia}</td>
                                <td>
                                    <img
                                        src={vehicle.foto}
                                        alt={`${vehicle.marca} ${vehicle.modelo}`}
                                        style={{ width: "50px", height: "auto" }}
                                    />
                                </td>
                                <td>{vehicle.año}</td>
                                <td>{vehicle.precio_por_dia.toFixed(2)} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading vehicles...</p>
            )}
		</div>
	);
};
