import React, { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/singleVehicle.css";
import { Modal, Button } from "react-bootstrap";
import { DateRange } from "react-date-range";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

export const SingleVehicle = () => {
  const { store, actions } = useContext(Context);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const isAuthenticated = store.user?.token; // Verifica si el usuario está autenticado

  useEffect(() => {
    actions.fetchVehicleById(id);
  }, [id]);

  if (!store.selectedVehicle) {
    return <div>Loading vehicle...</div>;
  }

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "Acceso restringido",
        text: "Debes iniciar sesión o registrarte para reservar un vehículo.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Registrarse",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#112D4E",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/register");
        }
      });
      return;
    }
    setShowModal(true);
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
        ...vehicleData,
      },
    });
  };

  const {
    marca,
    modelo,
    potencia,
    plazas,
    combustible,
    autonomia,
    foto,
    año,
    precio_por_dia,
  } = store.selectedVehicle;

  return (
    <div className="text-center mt-5">
      <h1>Vehicle Details</h1>
      <div className="card" style={{ width: "18rem", margin: "auto" }}>
        <img src={foto} className="card-img-top" alt={`${marca} ${modelo}`} />
        <div className="card-body">
          <h5 className="card-title">{`${marca} ${modelo}`}</h5>
          <p className="card-text">
            <strong>Potencia:</strong> {potencia}
            <br />
            <strong>Plazas:</strong> {plazas}
            <br />
            <strong>Combustible:</strong> {combustible}
            <br />
            <strong>Autonomía:</strong> {autonomia}
            <br />
            <strong>Año:</strong> {año}
            <br />
            <strong>Precio por día:</strong>{" "}
            {precio_por_dia ? precio_por_dia.toFixed(2) : "N/A"} €
          </p>
          <button className="btn btn-success" onClick={handleOpenModal}>
            RESERVA YA
          </button>
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
            onChange={(item) => setDateRange([item.selection])}
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

      {/* Sección de Más información */}
      <div
        className="row mt-5 p-5"
        id="contacto"
        style={{ border: "2px solid #112d4e" }}
      >
        <div className="col mx-5">
          <h5 className="card-title my-2" style={{ color: "#112d4e" }}>
            Más información
          </h5>
          <p className="py-3">
            Si tienes cualquier duda por favor deja tus datos y te escribiremos
          </p>
          <form>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input type="text" className="form-control" id="nombre" placeholder="Nombre completo" />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control" id="email" placeholder="Dirección de correo" />
            </div>
            <button
              type="submit"
              className="btn btn-secondary btn-lg btn-block my-3"
              style={{ backgroundColor: "#112D4E", color: "white" }}
            >
              Enviar
            </button>
          </form>
        </div>
        <div className="col mx-5">
          <h5 className="card-title my-5" style={{ color: "#112d4e" }}>
            Llámanos
          </h5>
          <FontAwesomeIcon icon={faPhone} size="2x" color="#112d4e" />
          <h2 className="my-3" style={{ color: "#112d4e" }}>
            911000222
          </h2>
          <p>
            Te ofreceremos toda la información que necesites y te asesoraremos
            sobre las mejores opciones de alquiler para tus necesidades
          </p>
        </div>
      </div>
    </div>
  );
};
