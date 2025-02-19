import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Context } from "../store/appContext";
import "../../styles/register.css";

export const Register = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

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
        fecha_nacimiento: Yup.date()
            .required("Campo requerido")
            .transform((value, originalValue) => (originalValue ? new Date(originalValue) : null))
            .max(eighteenYearsAgo, "Debe ser mayor de 18 años"),
        fecha_obtencion_carnet: Yup.date()
            .required("Campo requerido")
            .transform((value, originalValue) => (originalValue ? new Date(originalValue) : null))
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
            contraseña: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            const formattedValues = {
                email: values.email,
                contraseña: values.contraseña,
                nombre: values.nombre,
                apellidos: values.apellidos,
                direccion: values.direccion,
                poblacion: values.poblacion,
                telefono: values.telefono,
                fecha_nacimiento: values.fecha_nacimiento
                    ? new Date(values.fecha_nacimiento).toISOString().split("T")[0]
                    : "",
                fecha_obtencion_carnet: values.fecha_obtencion_carnet
                    ? new Date(values.fecha_obtencion_carnet).toISOString().split("T")[0]
                    : ""
            };

            const success = await actions.registerUser(formattedValues);
            if (success) {
                formik.resetForm();
                Swal.fire({
                    title: "Registro Exitoso",
                    text: "Tu cuenta ha sido creada correctamente",
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
            <form onSubmit={formik.handleSubmit} className="w-50 mx-auto">
                <div className="row">
                    {[
                        { name: "nombre", label: "Nombre" },
                        { name: "apellidos", label: "Apellidos" },
                        { name: "telefono", label: "Teléfono" },
                        { name: "fecha_nacimiento", label: "Fecha de Nacimiento", type: "date" },
                        { name: "fecha_obtencion_carnet", label: "Fecha de Carnet", type: "date" },
                        { name: "direccion", label: "Dirección" },
                        { name: "poblacion", label: "Población" },
                        { name: "email", label: "Email", type: "email" },
                        { name: "contraseña", label: "Contraseña", type: "password" }
                    ].map((field) => (
                        <div key={field.name} className="col-md-6 mb-3">
                            <input
                                type={field.type || "text"}
                                name={field.name}
                                placeholder={field.label}
                                className="form-control"
                                value={formik.values[field.name] || ""}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched[field.name] && formik.errors[field.name] ? (
                                <div className="text-danger">{formik.errors[field.name]}</div>
                            ) : null}
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3" disabled={!(formik.isValid && formik.dirty)}>
                    REGISTRAR
                </button>
            </form>
        </div>
    );
};
