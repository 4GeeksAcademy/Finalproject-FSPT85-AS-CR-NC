import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { store } = useContext(Context);  // Accede al contexto para obtener los datos del usuario

    // Extraer datos de location.state
    const { startDate, endDate, id: vehiculoId, marca, modelo, foto, precio_por_dia } = location.state || {};

    const [insurance, setInsurance] = useState(false);
    const [loading, setLoading] = useState(false); 

    const insuranceCostPerDay = 3;
    const totalDays = startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 0;
    const baseTotal = totalDays > 0 && precio_por_dia ? totalDays * precio_por_dia : 0;
    const insuranceTotal = insurance ? totalDays * insuranceCostPerDay : 0;
    const finalTotal = baseTotal + insuranceTotal;

    // Datos del usuario desde el contexto
    const { nombre, apellidos, direccion, poblacion, telefono, fecha_nacimiento } = store.usuario || {};

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

        // Confirmación con SweetAlert2
        const confirmResult = await Swal.fire({
            title: "¿Confirmar reserva?",
            text: `Reservarás un ${marca} ${modelo} del ${new Date(startDate).toLocaleDateString()} al ${new Date(endDate).toLocaleDateString()}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmResult.isConfirmed) return;

        setLoading(true);

        // Convertir las fechas a formato ISO 8601 sin la "Z" al final
        const fechaInicio = new Date(startDate).toISOString().split(".")[0];
        const fechaFin = new Date(endDate).toISOString().split(".")[0];

        const reservationData = {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            vehiculo_id: Number(vehiculoId),
            usuario_id: store.usuario?.id, // Agregar el ID del usuario
            nombre_usuario: `${nombre} ${apellidos}`, // Nombre completo del usuario
            direccion_usuario: direccion,
            poblacion_usuario: poblacion,
            telefono_usuario: telefono,
            fecha_nacimiento_usuario: fecha_nacimiento
        };

        console.log("📢 Datos enviados al backend:", reservationData);

        try {
            // Mostrar loader mientras se procesa la reserva
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

            const data = await response.json();
            console.log("Reserva creada:", data);

            Swal.fire({
                title: "Reserva confirmada ✅",
                text: `Tu reserva del ${marca} ${modelo} ha sido confirmada del ${new Date(startDate).toLocaleDateString()} al ${new Date(endDate).toLocaleDateString()}.`,
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => navigate("/")); // Redirige al usuario tras confirmar
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
        <div className="text-center mt-5">
            <h1>DATOS DE TU RESERVA</h1>
            <p><strong>Fecha de Inicio:</strong> {startDate ? new Date(startDate).toLocaleDateString() : "No seleccionado"}</p>
            <p><strong>Fecha de Fin:</strong> {endDate ? new Date(endDate).toLocaleDateString() : "No seleccionado"}</p>
            <p><strong>Total de días:</strong> {totalDays || "No calculado"}</p>
            
            <h1>DATOS DEL VEHÍCULO</h1>
            {marca && modelo ? (
                <div className="card" style={{ width: "18rem", margin: "auto" }}>
                    <img src={foto} className="card-img-top" alt={`${marca} ${modelo}`} />
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
                    <p><strong>Dirección:</strong> {direccion}</p>
                    <p><strong>Población:</strong> {poblacion}</p>
                    <p><strong>Teléfono:</strong> {telefono}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {new Date(fecha_nacimiento).toLocaleDateString()}</p>
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
    );
};