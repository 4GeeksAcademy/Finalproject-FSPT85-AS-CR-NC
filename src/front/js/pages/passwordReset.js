import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";

export const PasswordReset = () => {
  const [sending, setSending] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Formato de correo no válido")
        .required("El correo es obligatorio")
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setSending(true);
        // Llamada al backend para generar el enlace de reseteo
        const response = await fetch(`${process.env.BACKEND_URL}/api/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: values.email })
        });

        if (!response.ok) {
          const data = await response.json();
          Swal.fire({
            title: "Error",
            text: data.msg || "No se pudo generar el enlace, inténtalo de nuevo.",
            icon: "error",
            confirmButtonColor: "#112D4E"
          });
          setSending(false);
          return;
        }
        
        const data = await response.json();
        const resetLink = data.reset_link;
        const toEmail = data.to_email || values.email; // En caso de que no se retorne, usamos el valor ingresado

        // Usar EmailJS desde el navegador
        const templateParams = {
          to_email: toEmail,
          reset_link: resetLink,
          reset_display: "block",
          info_display: "none"
        };

        await emailjs.send(
          "service_d69rzc5",     // Service ID
          "template_aqy6q17",     // Template ID
          templateParams,
          "znbda1wlH4IIiEjOY"     // Public Key
        );

        Swal.fire({
          title: "Email enviado",
          text: "Revisa tu correo para las instrucciones de reinicio de contraseña.",
          icon: "success",
          confirmButtonColor: "#112D4E"
        });
        resetForm();
      } catch (error) {
        console.error("Error en el proceso de reseteo:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema con la solicitud.",
          icon: "error",
          confirmButtonColor: "#112D4E"
        });
      } finally {
        setSending(false);
      }
    }
  });

  return (
    <div className="container mt-5">
      <h2>Reiniciar Contraseña</h2>
      <p>Introduce tu correo electrónico para recibir un enlace de reinicio de contraseña.</p>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="tuemail@ejemplo.com"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger">{formik.errors.email}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary mb-3" disabled={sending}>
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};
