import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Modal } from "bootstrap";  // Importa Bootstrap correctamente

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [vehiculos, setVehiculos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            actions.verifyAuth();
        }
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const success = await actions.loginUser(email, password);
        if (success) {
            setEmail("");
            setPassword("");

            // ✅ Solución: Obtener la instancia del modal correctamente
            const modalElement = document.getElementById("loginModal");
            if (modalElement) {
                const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
                modal.hide();  // Cierra el modal
            }

            // ✅ Mover el foco al botón de login después de cerrar el modal
            document.getElementById("openModalButton")?.focus();
        } else {
            setErrorMessage("Error en el login");
        }
    };

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}api/vehicles`);
                const data = await response.json();
                setVehiculos(data);
            } catch (error) {
                console.error("Error al obtener los vehículos", error);
            }
        };

        fetchVehicles();
    }, []);

    const gruposVehiculos = {
        "Turismos": vehiculos.filter(v => v.precio_por_dia === 35),
        "Sedán/Berlinas": vehiculos.filter(v => v.precio_por_dia === 40),
        "Furgonetas": vehiculos.filter(v => v.precio_por_dia === 45)
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a 
                        className="navbar-brand text-secondary-emphasis fs-6 fw-bold text-reset" 
                        href="#" 
                        onClick={() => navigate("/")}
                    >
                        @4Cars
                    </a>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarSupportedContent"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-6">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" style={{ color: "#112d4e" }} href="#" data-bs-toggle="dropdown">Vehículos</a>
								<ul className="dropdown-menu" data-bs-display="static">
                                {Object.entries(gruposVehiculos).map(([categoria, lista]) => (
                                    lista.length > 0 && (
                                    <React.Fragment key={categoria}>
                                        <li><h6 className="dropdown-header">{categoria}</h6></li>
                                        {lista.map((vehiculo) => (
                                            <li key={vehiculo.id}>
                                                <Link className="dropdown-item" to={`vehicle/${vehiculo.id}`}>
                                                {vehiculo.marca} {vehiculo.modelo}
                                                </Link>
                                            </li>
                                        ))}
                                        <li><hr className="dropdown-divider" /></li>
                                    </React.Fragment>
                                )
                            ))}
                            </ul>
                            </li>
                            <li className="nav-item"><a className="nav-link" style={{ color: "#112d4e" }} href="/condiciones">Condiciones</a></li>
                            <li className="nav-item"><a className="nav-link" style={{ color: "#112d4e" }} href="#contacto">Contacto</a></li>
                        </ul>
                        {!store.isAuthenticated && (
                            <button
                                type="button"
                                className="btn boton-signup"
                                onClick={() => navigate("/register")}
                            >
                                Signup
                            </button>
                        )}
                        {store.isAuthenticated ? (
                            <button
                                type="button"
                                className="btn"
                                style={{ backgroundColor: "#B22222", color: "white" }}
                                onClick={() => { actions.logoutUser(); }}
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                type="button"
                                id="openModalButton"  // ✅ Se agrega un ID para el foco
                                className="btn"
                                style={{ backgroundColor: "#112D4E", color: "white" }}
                                data-bs-toggle="modal"
                                data-bs-target="#loginModal"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* 🔹 Modal de Login */}
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="loginModalLabel">Iniciar Sesión</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                data-bs-dismiss="modal" 
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAuth}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
