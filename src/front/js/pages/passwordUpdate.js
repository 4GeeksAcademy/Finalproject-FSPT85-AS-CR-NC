import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useSearchParams, useNavigate } from "react-router-dom";

export const PasswordUpdate = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("La nueva contraseña es obligatoria")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
          "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Las contraseñas deben coincidir")
        .required("La confirmación es obligatoria")
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/update-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            new_password: values.newPassword
          })
        });
        if (response.ok) {
          Swal.fire({
            title: "Contraseña actualizada",
            text: "Tu contraseña ha sido actualizada exitosamente.",
            icon: "success",
            confirmButtonColor: "#112D4E"
          });
          navigate("/"); // Redirige al home
        } else {
          const data = await response.json();
          Swal.fire({
            title: "Error",
            text: data.msg || "No se pudo actualizar la contraseña.",
            icon: "error",
            confirmButtonColor: "#112D4E"
          });
        }
      } catch (error) {
        console.error("Error en el proceso de actualización:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema con la solicitud.",
          icon: "error",
          confirmButtonColor: "#112D4E"
        });
      }
    }
  });

  return (
    <div className="container mt-5">
      <h2>Actualizar Contraseña</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            name="newPassword"
            placeholder="Ingresa tu nueva contraseña"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <div className="text-danger">{formik.errors.newPassword}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirma tu nueva contraseña"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-danger">{formik.errors.confirmPassword}</div>
          )}
        </div>
        <div className="d-flex justify-content-between mb-3">
          <button type="submit" className="btn">
            Actualizar Contraseña
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate("/")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
