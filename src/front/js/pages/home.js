import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Hello Rigo!!</h1>
			<p>
				<img src={rigoImageUrl} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
			</p>

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
