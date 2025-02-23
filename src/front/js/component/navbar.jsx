import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navbar as RBNavbar, Nav, NavDropdown, Container, Modal, Button, Form } from "react-bootstrap";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);

  // Obtiene los vehículos
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/vehicles`);
        const data = await response.json();
        setVehiculos(data);
      } catch (error) {
        console.error("Error al obtener los vehículos", error);
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
      <RBNavbar bg="light" expand="lg">
        <Container>
          <RBNavbar.Brand style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            @4Cars
          </RBNavbar.Brand>
          <RBNavbar.Toggle aria-controls="navbar-nav" />
          <RBNavbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Vehículos" id="vehiculos-dropdown">
                {Object.entries(gruposVehiculos).map(([categoria, lista]) =>
                  lista.length > 0 ? (
                    <React.Fragment key={categoria}>
                      <NavDropdown.Header>{categoria}</NavDropdown.Header>
                      {lista.map((vehiculo) => (
                        <NavDropdown.Item
                          as={Link}
                          to={`vehicle/${vehiculo.id}`}
                          key={vehiculo.id}
                        >
                          {vehiculo.marca} {vehiculo.modelo}
                        </NavDropdown.Item>
                      ))}
                      <NavDropdown.Divider />
                    </React.Fragment>
                  ) : null
                )}
              </NavDropdown>
              <Nav.Link as={Link} to="/condiciones">
                Condiciones
              </Nav.Link>
              <Nav.Link as={Link} to="#contacto">
                Contacto
              </Nav.Link>
            </Nav>
            {!store.isAuthenticated ? (
              <>
                <Button variant="primary" onClick={() => navigate("/register")} className="me-2">
                  Signup
                </Button>
                <Button variant="primary" onClick={() => setShowLoginModal(true)}>
                  Login
                </Button>
              </>
            ) : (
              <Button variant="danger" onClick={() => actions.logoutUser()}>
                Logout
              </Button>
            )}
          </RBNavbar.Collapse>
        </Container>
      </RBNavbar>

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
