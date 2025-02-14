import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/register.css";

export const Register = () => {
    const { actions } = useContext(Context);
    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        telefono: "",
        fechaNacimiento: "",
        fechaCarnet: "",
        direccion: "",
        poblacion: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.registerUser({
            email: formData.email,
            contraseña: formData.password,
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            direccion: formData.direccion,
            poblacion: formData.poblacion,
            telefono: formData.telefono,
            fecha_nacimiento: formData.fechaNacimiento,
            fecha_obtencion_carnet: formData.fechaCarnet
        });

        if (success) {
            setFormData({
                nombre: "",
                apellidos: "",
                telefono: "",
                fechaNacimiento: "",
                fechaCarnet: "",
                direccion: "",
                poblacion: "",
                email: "",
                password: ""
            });
            navigate("/");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Registro</h2>
            <p className="text-center">Signup now. It's free and takes less than 3 minutes</p>
            <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                <div className="row w-75">
                    <div className="col-md-6 mb-3">
                        <input type="text" name="nombre" placeholder="Nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input type="text" name="apellidos" placeholder="Apellidos" className="form-control" value={formData.apellidos} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <input type="tel" name="telefono" placeholder="Teléfono" className="form-control" value={formData.telefono} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <input type="text" name="fechaNacimiento" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} placeholder="Fecha nacimiento" className="form-control" value={formData.fechaNacimiento} onChange={handleChange} required />
                    </div>
                    <div className="col-md-4 mb-3">
                        <input type="text" name="fechaCarnet" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} placeholder="Fecha carnet" className="form-control" value={formData.fechaCarnet} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input type="text" name="direccion" placeholder="Dirección" className="form-control" value={formData.direccion} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input type="text" name="poblacion" placeholder="Población" className="form-control" value={formData.poblacion} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input type="email" name="email" placeholder="Email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <input type="password" name="password" placeholder="Password" className="form-control" value={formData.password} onChange={handleChange} required />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-25">REGISTRAR</button>
            </form>
        </div>
    );
};
