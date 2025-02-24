import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
// import {Cloudinary} from "@cloudinary/url-gen";
import "../../styles/checkout.css";

export const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const { store } = useContext(Context);  

    const { startDate, endDate, id: vehiculoId, marca, modelo, precio_por_dia } = location.state || {};
    const { nombre, apellidos, telefono, email } = store.usuario || {};

    const [insurance, setInsurance] = useState(false);
    const [loading, setLoading] = useState(false); 

    const insuranceCostPerDay = 3;
    const totalDays = startDate && endDate 
        ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) 
        : 0;
    const baseTotal = totalDays > 0 && precio_por_dia ? totalDays * precio_por_dia : 0;
    const insuranceTotal = insurance ? totalDays * insuranceCostPerDay : 0;
    const finalTotal = baseTotal + insuranceTotal;


    // **Función para enviar email de confirmación**
const sendConfirmationEmail = () => {
    if (!email) {
        console.error("Error: No se encontró un email válido para enviar.");
        return;
    }

    console.log("📧 Enviando email de confirmación a:", email);

    const emailParams = {
        to_name: nombre,
        to_email: email,  
        reserva_display: "block",
        bienvenida_display: "none",
        marca,
        modelo,
        fecha_inicio: new Date(startDate).toLocaleDateString(),
        fecha_fin: new Date(endDate).toLocaleDateString(),
        telefono_usuario: telefono,
        finalTotal: finalTotal.toFixed(2),
    };

    emailjs.send("service_d69rzc5", "template_268zlr7", emailParams, "znbda1wlH4IIiEjOY")
        .then(() => {
            console.log("✅ Email de confirmación enviado con éxito.");
        })
        .catch(error => {
            console.error("❌ Error al enviar el email de confirmación:", error);
        });
};


    const handleConfirm = async () => {
        if (!startDate || !endDate || !vehiculoId) {
            Swal.fire({
                title: "Error",
                text: "Faltan datos para completar la reserva.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: "¿Confirmar reserva?",
            text: `Reservarás un ${marca} ${modelo} del ${new Date(startDate).toLocaleDateString()} al ${new Date(endDate).toLocaleDateString()}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#112D4E",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmResult.isConfirmed) return;

        setLoading(true);

        const fechaInicio = new Date(startDate).toISOString().split(".")[0];
        const fechaFin = new Date(endDate).toISOString().split(".")[0];

        const reservationData = {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            vehiculo_id: Number(vehiculoId),
            usuario_id: store.usuario?.id,
            nombre_usuario: `${nombre} ${apellidos}`,
            telefono_usuario: telefono,
        };

        try {
            Swal.fire({
                title: "Procesando reserva...",
                text: "Por favor, espera un momento.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch(`${process.env.BACKEND_URL}/create-reservation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reservationData)
            });

            if (!response.ok) {
                throw new Error(`Error en la reserva. Código: ${response.status}`);
            }

            sendConfirmationEmail();

            Swal.fire({
                title: "Reserva confirmada",
                text: `Tu reserva del ${marca} ${modelo} ha sido confirmada del ${new Date(startDate).toLocaleDateString()} al ${new Date(endDate).toLocaleDateString()}.`,
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#112D4E"
            }).then(() => navigate("/"));

        } catch (error) {
            console.error("Error al crear la reserva:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo procesar la reserva. Intenta de nuevo.",
                icon: "error",
                confirmButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="checkout-container">    
        <div className="text-center mt-5">
            <h1>DATOS DE TU RESERVA</h1>
            <p><strong>Fecha de Inicio:</strong> {startDate ? new Date(startDate).toLocaleDateString() : "No seleccionado"}</p>
            <p><strong>Fecha de Fin:</strong> {endDate ? new Date(endDate).toLocaleDateString() : "No seleccionado"}</p>
            <p><strong>Total de días:</strong> {totalDays || "No calculado"}</p>
            
            <h1>DATOS DEL VEHÍCULO</h1>
            {marca && modelo ? (
                <div className="card" style={{ width: "18rem", margin: "auto" }}>
                    <img src={`https://res.cloudinary.com/dbqfhbhzu/image/upload/v1740346391/${vehiculoId}.jpg`} className="card-img-top" alt={`${marca} ${modelo}`} />
                    <div className="card-body">
                        <h5 className="card-title">{`${marca} ${modelo}`}</h5>
                        <p className="card-text">
                            <strong>Precio por día:</strong> {precio_por_dia ? precio_por_dia.toFixed(2) : "N/A"} €
                        </p>
                    </div>
                </div>
            ) : (
                <p>No se han encontrado datos del vehículo.</p>
            )}
            
            <h1>DATOS DEL USUARIO</h1>
            {nombre && apellidos ? (
                <div>
                    <p><strong>Nombre:</strong> {nombre} {apellidos}</p>
                    <p><strong>Teléfono:</strong> {telefono}</p>
                </div>
            ) : (
                <p>No se han encontrado datos del usuario.</p>
            )}

            <div className="mt-3">
                <input 
                    type="checkbox" 
                    id="insurance" 
                    checked={insurance} 
                    onChange={() => setInsurance(!insurance)} 
                />
                <label htmlFor="insurance" className="ms-2">¿Desea añadir un seguro adicional? (+3€/día)</label>
            </div>
            
            <h2 className="mt-4" style={{ fontSize: '1.8rem' }}>PRECIO TOTAL DE TU RESERVA</h2>
            <p style={{ fontSize: '1.5rem' }}><strong>Total:</strong> {finalTotal.toFixed(2)} €</p>
            
            <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-danger me-3" onClick={() => navigate("/")}>Cancelar</button>
                <button className="btn btn-success" onClick={handleConfirm} disabled={loading}>
                    {loading ? "Procesando..." : "CONFIRMAR"}
                </button>
            </div>
        </div>
    </div>
    );
};
