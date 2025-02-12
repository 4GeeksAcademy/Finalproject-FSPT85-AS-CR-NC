import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				<a className="navbar-brand text-secondary-emphasis fs-6 fw-bold text-reset" href="#">@4Cars</a>
				<button className="navbar-toggler text-secondary-emphasis navbar-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon navbar-light"></span>
				</button>
				<div className="collapse navbar-collapse navbar-toggler navbar-light" id="navbarSupportedContent">
				<ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-6">
					<li className="nav-item dropdown">
						<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
						Vehículos
						</a>
						<ul className="dropdown-menu">
						<li><a className="dropdown-item" href="#">Vehículo 1</a></li>
						<li><a className="dropdown-item" href="#">Vehículo 2</a></li>
						{/* <li><hr className="dropdown-divider"></li> */}
						<li><a className="dropdown-item" href="#">Vehículo 3</a></li>
					</ul>
					</li>
					<li className="nav-item">
					<a className="nav-link active" aria-current="page" href="#">Precios</a>
					</li>
					<li className="nav-item">
					<a className="nav-link" href="#">Contacto</a>
					</li>
				</ul>
				<form className="d-flex" role="search">
					<input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
					{/* <button className="btn btn-outline-success" type="submit">Search</button> */}
				</form>
				<button type="button" className="btn boton-signup">Signup</button>
				<button type="button" className="btn boton-login">Login</button>
				</div>
			</div>
		</nav>
	);
};
