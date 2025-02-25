import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export const Condiciones = () => {
    const formik = useFormik({
        initialValues: {
            nombre: "",
            email: "",
            message: "Quisiera recibir más información sobre las condiciones de alquiler."
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required("El nombre es obligatorio"),
            email: Yup.string().email("Formato de correo no válido").required("El correo es obligatorio")
        }),
        onSubmit: (values, { resetForm }) => {
            const templateParams = {
                user_name: values.nombre,
                user_email: values.email,
                to_email: values.email,
                message: values.message,
                reset_display: "none",   // 🔹 Oculta la sección de reseteo de contraseña
                info_display: "block"    // 🔹 Muestra solo la parte de "Información de 4Cars"
            };

            emailjs.send("service_d69rzc5", "template_aqy6q17", templateParams, "znbda1wlH4IIiEjOY")

                .then(() => {
                    Swal.fire({
                        title: "¡Formulario enviado!",
                        text: "Revisa tu correo electrónico para más información.",
                        icon: "success",
                        confirmButtonColor: "#112D4E"
                    });
                    resetForm();
                })
                .catch(() => {
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema enviando el formulario. Inténtalo de nuevo.",
                        icon: "error",
                        confirmButtonColor: "#112D4E"
                    });
                });
        }
    });

    return (
        <div className="container-fluid">
            <div className="card m-5">
                <h5 className="card-header">Condiciones</h5>
                <div className="card-body">
                    <h5 className="card-title">Impuestos:</h5>
                    <p className="card-text">21% en Península y Baleares y 15% para las islas Canarias.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Cargo de aeropuerto:</h5>
                    <p className="card-text">Para más información consulte en la oficina de reservas</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Edad:</h5>
                    <p className="card-text">21 o 25 años, según la categoría del coche. A los conductores menores de 25 años se les aplicará un cargo específico.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Conductor adicional:</h5>
                    <p className="card-text">Con el consentimiento del arrendatario. Consulte condiciones y posibles gastos.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Permiso de conducir:</h5>
                    <p className="card-text">Al menos un año de antigüedad.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Depósito en Efectivo:</h5>
                    <p className="card-text">Sólo disponible para ciertas categorías. Consulte al reservar.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Protecciones y Seguros:</h5>
                    <p className="card-text">C.D.W., THW y PAI. Consulte detalles al reservar.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Otros servicios:</h5>
                    <p className="card-text">Asiento de seguridad para bebés, cadenas para la nieve.</p>
                </div>
            </div>
            
            {/* 🔹 SECCIÓN DE FORMULARIO PARA SOLICITAR INFORMACIÓN */}
            <div className="row mt-5 p-5" id="contacto" style={{ border: "2px solid #112d4e" }}>
                <div className="col mx-5">
                    <h5 className="card-title my-2" style={{ color: "#112d4e" }}>Más información</h5>
                    <p className="py-3">Si tienes cualquier duda por favor deja tus datos y te escribiremos</p>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nombre"
                                name="nombre"
                                placeholder="Nombre completo"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nombre}
                            />
                            {formik.touched.nombre && formik.errors.nombre ? (
                                <div className="text-danger">{formik.errors.nombre}</div>
                            ) : null}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email_input"
                                name="email"
                                placeholder="Dirección de correo"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-danger">{formik.errors.email}</div>
                            ) : null}
                        </div>
                        <button type="submit" className="btn btn-secondary btn-lg btn-block my-3" style={{ backgroundColor: "#112D4E", color: "white" }}>Enviar</button>
                    </form>
                </div>
                
                {/* 🔹 SECCIÓN DE CONTACTO TELEFÓNICO */}
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
