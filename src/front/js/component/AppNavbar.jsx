import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Button, Modal, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/index.css";

export const AppNavbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [vehiculos, setVehiculos] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      setShowLoginModal(false);
    } else {
      setErrorMessage("Error en el login");
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="w-100">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" style={{ cursor: "pointer" }}>
            @4Cars
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Vehículos" id="vehiculos-dropdown" className="fs-6 nav-link-custom">
                {Object.entries(gruposVehiculos).map(([tipo, lista]) =>
                  lista.length > 0 ? (
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
                  ) : null
                )}
              </NavDropdown>
              <Nav.Link as={Link} to="/condiciones" className="fs-6 nav-link-custom">
                Condiciones
              </Nav.Link>
              <Nav.Link as={Link} to="#contacto" className="fs-6 nav-link-custom">
                Contacto
              </Nav.Link>
            </Nav>
            {store.isAuthenticated ? (
              <Button variant="danger" onClick={() => actions.logoutUser()} className="fs-6">
                Logout
              </Button>
            ) : (
              <>
                <Button variant="primary" onClick={() => navigate("/register")} className="me-2 fs-6">
                  Signup
                </Button>
                <Button variant="primary" onClick={() => setShowLoginModal(true)} className="fs-6">
                  Login
                </Button>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal de Login usando React‑Bootstrap */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Iniciar Sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAuth}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <Button variant="primary" type="submit" className="w-100">
              Iniciar Sesión
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/reset-password" onClick={() => setShowLoginModal(false)}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};