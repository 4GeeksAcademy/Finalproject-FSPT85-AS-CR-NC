import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; 

export const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
	const [vehiculos, setVehiculos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				const response = await fetch("https://psychic-cod-5g7vr7qxp5ghx9p-3001.app.github.dev/api/vehicles");
				const data = await response.json();
				setVehiculos(data);
			} catch (error) {
				console.error("Error al obtener los vehiculos", error);
			}
		};

		fetchVehicles();
	}, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch("https://probable-memory-wr9j95jq65rwh59xg-3001.app.github.dev//login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, contraseña: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Error en el login");
            }

            localStorage.setItem("token", data.access_token);
            setIsAuthenticated(true);
            setEmail("");
            setPassword("");

            // Cierra el modal
            const modalElement = document.getElementById("loginModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/");
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand text-secondary-emphasis fs-6 fw-bold text-reset" href="#">@4Cars</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-6">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Vehículos</a>
								<ul className="dropdown-menu">
							{vehiculos.map((vehiculo) => (
								<li key={vehiculo.id}>
									<Link className="dropdown-item" to={`/vehicle/${vehiculo.id}`}>
									{vehiculo.marca} {vehiculo.modelo}
									</Link>
								</li>
							))}
						</ul>
                            </li>
                            <li className="nav-item"><a className="nav-link" href="#">Precios</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Contacto</a></li>
                        </ul>
                        {!isAuthenticated && (
                            <button type="button" className="btn boton-signup">Signup</button>
                        )}
                        {isAuthenticated ? (
                            <button
                                type="button"
                                className="btn"
                                style={{ backgroundColor: "#B22222", color: "white" }}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                type="button"
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
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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