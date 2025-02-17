import React, { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/singleVehicle.css";
import { Modal, Button } from "react-bootstrap";
import { DateRange } from "react-date-range";

export const SingleVehicle = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
        }
    ]);

    useEffect(() => {
        actions.fetchVehicleById(id);
    }, [id]);


    if (!store.selectedVehicle) {
        return <div>Loading vehicle...</div>;
    }

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
                        <strong>Precio por día:</strong> {precio_por_dia ? precio_por_dia.toFixed(2) : "N/A"} €
                    </p>
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>RESERVA YA</button>
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
    );
};
