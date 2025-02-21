import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import emailjs from "emailjs-com";
import "../../styles/register.css";

export const Register = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const sendConfirmationEmail = (email, name) => {
        const templateParams = {
            to_email: email,
            to_name: name,
        };

        emailjs.send(
            "service_d69rzc5",
            "template_aqy6q17",
            templateParams,
            "znbda1wlH4IIiEjOY"
        ).then(
            (response) => {
                console.log("Email enviado con éxito", response.status, response.text);
            },
            (error) => {
                console.error("Error al enviar el email", error);
            }
        );
    };

    const today = new Date();
    const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));
    const oneYearAgo = new Date(today.setFullYear(today.getFullYear() - 1));

    const validationSchema = Yup.object({
        nombre: Yup.string()
            .matches(/^[A-Za-z]+$/, "Solo se permiten letras")
            .min(3, "Debe tener al menos 3 caracteres")
            .max(15, "Debe tener máximo 15 caracteres")
            .required("Campo requerido"),
        apellidos: Yup.string()
            .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Solo se permiten letras")
            .min(6, "Debe tener al menos 6 caracteres")
            .max(50, "Debe tener máximo 50 caracteres")
            .required("Campo requerido"),
        telefono: Yup.string()
            .matches(/^[0-9]{9}$/, "Debe tener exactamente 9 números")
            .required("Campo requerido"),
        direccion: Yup.string()
            .max(50, "Debe tener máximo 50 caracteres")
            .required("Campo requerido"),
        poblacion: Yup.string()
            .matches(/^[A-Za-z ]+$/, "Solo se permiten letras")
            .max(25, "Debe tener máximo 25 caracteres")
            .required("Campo requerido"),
        email: Yup.string()
            .email("Formato de email no válido")
            .required("Campo requerido"),
        contraseña: Yup.string()
            .min(8, "Debe tener al menos 8 caracteres")
            .matches(/[A-Z]/, "Debe contener al menos una mayúscula")
            .matches(/[a-z]/, "Debe contener al menos una minúscula")
            .matches(/[0-9]/, "Debe contener al menos un número")
            .matches(/[@$!%*?&]/, "Debe contener al menos un carácter especial (@$!%*?&)")
            .required("Campo requerido"),
        confirmarContraseña: Yup.string()
            .oneOf([Yup.ref("contraseña"), null], "Las contraseñas no coinciden")
            .required("Campo requerido"),
        fecha_nacimiento: Yup.date()
            .required("Campo requerido")
            .max(eighteenYearsAgo, "Debe ser mayor de 18 años"),
        fecha_obtencion_carnet: Yup.date()
            .required("Campo requerido")
            .max(oneYearAgo, "Debe tener al menos 1 año de antigüedad"),
    });

    const formik = useFormik({
        initialValues: {
            nombre: "",
            apellidos: "",
            telefono: "",
            fecha_nacimiento: "",
            fecha_obtencion_carnet: "",
            direccion: "",
            poblacion: "",
            email: "",
            contraseña: "",
            confirmarContraseña: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            const success = await actions.registerUser(values);
            if (success) {
                sendConfirmationEmail(values.email, values.nombre);
                formik.resetForm();
                Swal.fire({
                    title: "Registro Exitoso",
                    text: "Tu cuenta ha sido creada correctamente. Revisa tu email para confirmar tu cuenta.",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    navigate("/");
                });
            }
        }
    });

    return (
        <div className="container mt-5">
            <h2 className="text-center">Registro</h2>
            <p className="text-center">Signup now. It's free and takes less than 3 minutes</p>
            <form onSubmit={formik.handleSubmit} className="w-50 mx-auto mb-5">
                <div className="row">
                    {["nombre", "apellidos", "telefono", "fecha_nacimiento", "fecha_obtencion_carnet", "direccion", "poblacion", "email", "contraseña", "confirmarContraseña"].map((field) => (
                        <div key={field} className="col-md-6 mb-3">
                            <input
                                type={field === "contraseña" || field === "confirmarContraseña" ? "password" : field.includes("fecha") ? "text" : "text"}
                                name={field}
                                placeholder={
                                    field === "fecha_nacimiento" ? "Fecha de nacimiento" :
                                    field === "fecha_obtencion_carnet" ? "Fecha del carnet" :
                                    field === "contraseña" ? "Contraseña" :
                                    field === "confirmarContraseña" ? "Confirmar contraseña" :
                                    field.replace("_", " ").charAt(0).toUpperCase() + field.replace("_", " ").slice(1)
                                }
                                className="form-control"
                                value={formik.values[field] || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                onFocus={(e) => {
                                    if (field.includes("fecha")) {
                                        e.target.type = "date";
                                    }
                                }}
                            />
                            {formik.touched[field] && formik.errors[field] ? (
                                <div className="text-danger">{formik.errors[field]}</div>
                            ) : null}
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3 mb-5" disabled={!(formik.isValid && formik.dirty)}>
                    REGISTRAR
                </button>
            </form>
        </div>
    );
};
