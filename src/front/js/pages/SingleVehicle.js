import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";
import "../../styles/home.css";

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
        <div className="text-center mt-5">
            <h1>Vehicle Details</h1>
            <div className="card" style={{ width: "18rem", margin: "auto" }}>
                <img src={foto} className="card-img-top" alt={`${marca} ${modelo}`} />
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
    );
};