import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/index.css";


export const Footer = () => {
	const { store, actions } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const [vehiculos, setVehiculos] = useState([]);
	
	useEffect(() => {
			const token = localStorage.getItem("token");
			if (token) {
				// Verifica autenticación solo si hay un token
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
				
				// Cierra el modal correctamente
				const modalElement = document.getElementById("loginModal");
				const modal = bootstrap.Modal.getInstance(modalElement);
				if (modal) modal.hide();
			} else {
				setErrorMessage("Error en el login");
			}
		};
	
		useEffect(() => {
			const fetchVehicles = async () => {
				try {
					console.log("🔍 BACKEND_URL:", process.env.BACKEND_URL);  // ✅ Verifica el valor
		
					const response = await fetch(`${process.env.BACKEND_URL}/api/vehicles`);
					const data = await response.json();
					setVehiculos(data);
				} catch (error) {
					console.error("❌ Error al obtener los vehículos", error);
				}
			};
		
			fetchVehicles();
		}, []);
		
	
		return (
			<>
				<footer className="footer" style={{ backgroundColor: "#112d4e" }}>
					<div className="container">
						<div className="row align-items-center">
							<div className="col-md-6">
								<div className="footer-brand" style={{ color: "#fff" }}>@4Cars</div>
								<p className="footer-text text-white">Tu agencia de alquiler de confianza</p>
								<div className="social-links">
									<a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
									<a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
									<a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
									<a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
								</div>
							</div>

							<div className="col-md-6 text-md-end">
								<ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-6">
									<li className="nav-item dropdown">
										<a className="nav-link dropdown-toggle text-white" href="#" data-bs-toggle="dropdown">Vehículos</a>
											<ul className="dropdown-menu">
												{vehiculos.map((vehiculo) => (
													<li key={vehiculo.id}>
														<Link className="dropdown-item" to={`vehicle/${vehiculo.id}`}>
															{vehiculo.marca} {vehiculo.modelo}
														</Link>
													</li>
												))}
											</ul>
												</li>
												<li className="nav-item"><a className="nav-link text-white" href="/condiciones">Condiciones</a></li>
												<li className="nav-item"><a className="nav-link text-white" href="#contacto">Contacto</a></li>								</ul>
							</div>
						</div>

						<div className="copyright text-center">
							© 2025 @4Cars. All rights reserved.
						</div>
					</div>
				</footer>
			</>
		)
};

