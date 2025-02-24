import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap"; 
import "../../styles/index.css";

export const Footer = () => {
  const { store, actions } = useContext(Context);
  const [vehiculos, setVehiculos] = useState([]);

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

  const gruposVehiculos = {
    "Turismos": vehiculos.filter(v => v.precio_por_dia === 35),
    "Sedán/Berlinas": vehiculos.filter(v => v.precio_por_dia === 40),
    "Furgonetas": vehiculos.filter(v => v.precio_por_dia === 45)
  };

  return (
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
              <li className="nav-item">
                <Dropdown>
                  <Dropdown.Toggle variant="link" id="vehiculos-dropdown" className="text-white no-underline">
                    Vehículos
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-end">
                    {Object.entries(gruposVehiculos).map(([categoria, lista]) =>
                      lista.length > 0 && (
                        <React.Fragment key={categoria}>
                          <Dropdown.Header>{categoria}</Dropdown.Header>
                          {lista.map((vehiculo) => (
                            <Dropdown.Item as={Link} to={`/vehicle/${vehiculo.id}`} key={vehiculo.id}>
                              {vehiculo.marca} {vehiculo.modelo}
                            </Dropdown.Item>
                          ))}
                          <Dropdown.Divider />
                        </React.Fragment>
                      )
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              <li className="nav-item"><a className="nav-link text-white" href="/condiciones">Condiciones</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="#contacto">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="copyright text-center">
          © 2025 @4Cars. All rights reserved.
        </div>
      </div>
    </footer>
  );
};