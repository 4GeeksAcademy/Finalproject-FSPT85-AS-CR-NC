import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Modal } from "bootstrap";

export const AppNavbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/vehicles`);
        const data = await response.json();
        setVehiculos(data);
      } catch (error) {
        console.error("Error al obtener vehículos", error);
      }
    };
    fetchVehicles();
  }, []);

  const gruposVehiculos = {
    "Turismos": vehiculos.filter((v) => v.precio_por_dia === 35),
    "Sedán/Berlinas": vehiculos.filter((v) => v.precio_por_dia === 40),
    "Furgonetas": vehiculos.filter((v) => v.precio_por_dia === 45),
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const success = await actions.loginUser(email, password);
    if (success) {
      setEmail("");
      setPassword("");

      // Cierra el modal de login
      const modalElement = document.getElementById("loginModal");
      if (modalElement) {
        const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
        modal.hide();
      }
    } else {
      setErrorMessage("Error en el login");
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="w-100">
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            className="navbar-brand text-secondary-emphasis fs-6 fw-bold text-reset"
            style={{ cursor: "pointer" }}
          >
            @4Cars
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Vehículos" id="vehiculos-dropdown" className="fs-6">
                {Object.entries(gruposVehiculos).map(([tipo, lista]) =>
                  lista.length > 0 && (
                    <React.Fragment key={tipo}>
                      <NavDropdown.Header>{tipo}</NavDropdown.Header>
                      {lista.map((vehiculo) => (
                        <NavDropdown.Item
                          as={Link}
                          to={`/vehicle/${vehiculo.id}`}
                          key={vehiculo.id}
                          className="fs-6"
                        >
                          {vehiculo.marca} {vehiculo.modelo}
                        </NavDropdown.Item>
                      ))}
                      <NavDropdown.Divider />
                    </React.Fragment>
                  )
                )}
              </NavDropdown>
              <Nav.Link as={Link} to="/condiciones" style={{ color: "#112d4e" }} className="fs-6">
                Condiciones
              </Nav.Link>
              <Nav.Link href="#contacto" style={{ color: "#112d4e" }} className="fs-6">
                Contacto
              </Nav.Link>
            </Nav>
            {store.isAuthenticated ? (
              <Button variant="danger" onClick={() => actions.logoutUser()} className="fs-6">
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={() => navigate("/register")}
                  className="me-2 fs-6"
                >
                  Signup
                </Button>
                <Button
                  variant="primary"
                  id="openModalButton"
                  data-bs-toggle="modal"
                  data-bs-target="#loginModal"
                  className="fs-6"
                >
                  Login
                </Button>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal de Login */}
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">
                Iniciar Sesión
              </h5>
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
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
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
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
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
                <button type="submit" className="btn btn-primary w-100">
                  Iniciar Sesión
                </button>
              </form>
              {/* Enlace para reiniciar la contraseña */}
              <div className="text-center mt-3">
                <Link
                  to="/reset-password"
                  onClick={() => {
                    const modalElement = document.getElementById("loginModal");
                    if (modalElement) {
                      const modal =
                        Modal.getInstance(modalElement) || new Modal(modalElement);
                      modal.hide();
                    }
                    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
