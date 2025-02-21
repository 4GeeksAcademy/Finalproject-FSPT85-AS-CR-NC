import React, { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/singleVehicle.css";
import { Modal, Button } from "react-bootstrap";
import { DateRange } from "react-date-range";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";

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
    }, [actions, id]);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: ""
        },
        validationSchema: Yup.object({
            name: Yup.string().required("El nombre es obligatorio"),
            email: Yup.string().email("Email no válido").required("El email es obligatorio")
        }),
        onSubmit: (values, { resetForm }) => {
            const templateParams = {
                from_name: values.name,
                from_email: values.email,
                to_email: "contacto@4cars.com", // Dirección de destino válida
                message: "Quiero más información sobre el alquiler de vehículos."
            };
            
            emailjs.send("service_d69rzc5", "template_268zlr7", templateParams, "znbda1wlH4IIiEjOY")
                .then(() => {
                    Swal.fire("Enviado", "Tu mensaje ha sido enviado con éxito", "success");
                    resetForm();
                })
                .catch((error) => {
                    console.error("Error en EmailJS:", error);
                    Swal.fire("Error", "Hubo un problema al enviar el mensaje", "error");
                });
        }
    });

    if (!store.selectedVehicle) {
        return <div>Loading vehicle...</div>;
    }

    const handleConfirm = () => {
        const startDate = dateRange[0].startDate;
        const endDate = dateRange[0].endDate;
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        Swal.fire("Confirmación", "Tu reserva ha sido confirmada", "success");

        navigate("/checkout", {
            state: {
                startDate,
                endDate,
                totalDays,
                ...store.selectedVehicle
            }
        });
    };

    return (
        <div className="text-center mt-5">
            <h1>Vehicle Details</h1>
            <div className="card" style={{ width: "18rem", margin: "auto" }}>
                <img src={store.selectedVehicle.foto} className="card-img-top" alt={`${store.selectedVehicle.marca} ${store.selectedVehicle.modelo}`} />
                <div className="card-body">
                    <h5 className="card-title">{`${store.selectedVehicle.marca} ${store.selectedVehicle.modelo}`}</h5>
                    <p className="card-text">
                        <strong>Potencia:</strong> {store.selectedVehicle.potencia}<br />
                        <strong>Plazas:</strong> {store.selectedVehicle.plazas}<br />
                        <strong>Combustible:</strong> {store.selectedVehicle.combustible}<br />
                        <strong>Autonomía:</strong> {store.selectedVehicle.autonomia}<br />
                        <strong>Año:</strong> {store.selectedVehicle.año}<br />
                        <strong>Precio por día:</strong> {store.selectedVehicle.precio_por_dia.toFixed(2)} €
                    </p>
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>RESERVA YA</button>
                </div>
            </div>

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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                    <Button variant="primary" onClick={handleConfirm}>Confirmar reserva</Button>
                </Modal.Footer>
            </Modal>

            <div className="row mt-5 p-5" id="contacto" style={{ border: "2px solid #112d4e" }}>
                <div className="col mx-5">
                    <h5 className="card-title my-2" style={{ color: "#112d4e" }}>Más información</h5>
                    <p className="py-3">Si tienes cualquier duda por favor deja tus datos y te escribiremos</p>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label>
                            <input type="text" className="form-control" id="name" {...formik.getFieldProps("name")} />
                            {formik.touched.name && formik.errors.name ? <div className="text-danger">{formik.errors.name}</div> : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" className="form-control" id="email" {...formik.getFieldProps("email")} />
                            {formik.touched.email && formik.errors.email ? <div className="text-danger">{formik.errors.email}</div> : null}
                        </div>
                        <button type="submit" className="btn btn-secondary btn-lg btn-block my-3" style={{ backgroundColor: "#112D4E", color: "white" }}>Enviar</button>
                    </form>
                </div>
                <div className="col mx-5">
                    <h5 className="card-title my-5" style={{ color: "#112d4e" }}>Llámanos</h5>
                    <FontAwesomeIcon icon={faPhone} size="2x" color="#112d4e" />
                    <h2 className="my-3" style={{ color: "#112d4e" }}>911000222</h2>
                    <p>Te ofreceremos toda la información que necesites y te asesoraremos sobre las mejores opciones de alquiler para tus necesidades</p>
                </div>
            </div>
        </div>
    );
};
