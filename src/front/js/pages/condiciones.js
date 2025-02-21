import React, { useContext, useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'

export const Condiciones = () => {
    return (
        <div className="container-fluid">
            <div className="card m-5">
                <h5 className="card-header">Condiciones</h5>
                <div className="card-body">
                    <h5 className="card-title">Impuestos:</h5>
                    <p className="card-text">21% en Península y Baleares y 15% para las islas Canarias.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Cargo de aeropuerto:</h5>
                    <p className="card-text">Para más información consulte en la oficina de reservas </p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Edad:</h5>
                    <p className="card-text">21 o 25 años, según la categoría del coche. A los conductores menores de 25 años se les aplicará un cargo específico</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Conductor adicional:</h5>
                    <p className="card-text">Con el consentimiento del arrendatario. Para más información consulte en el momento de realizar su reserva acerca de las condiciones y posibles gastos.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Permiso de conducir:</h5>
                    <p className="card-text">Al menos uno año de antigüedad.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Depósito en Efectivo:</h5>
                    <p className="card-text">Sólo disponible para ciertas categorías. Para más información consulte en el momento de realizar su reserva.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Tarjetas de Crédito Aceptadas:</h5>
                    <p className="card-text">American Express, Diners Club, Eurocard, Mastercard, Visa y Visa electron (En caso de de duda ponerse en contacto con el call center).</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Protecciones y Seguros:</h5>
                    <p className="card-text">C.D.W. (exención parcial de responsabilidad por daños ocasionados al vehículo en caso de accidente),THW (exención parcial en caso de robo total o parcial del vehículo, y daños causados al mismo por catos de vandalismo) y PAI (Seguro Personal de Accidentes) Para más información consulte en el momento de realizar su reserva.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Recogida y Entrega:</h5>
                    <p className="card-text">Dentro y fuera de la ciudad.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Devolución en un centro distinto a aquel en que se ha alquilado:</h5>
                    <p className="card-text">1. Nacional: si, entre todos los centros @4Cars. 2. Internacional: para más información consulte en el momento de realizar su reserva</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Otros servicios:</h5>
                    <p className="card-text">Asiento de seguridad para bebés, cadenas para la nieve.</p>
                </div>
                <div className="card-body">
                    <h5 className="card-title">Restricciones de uso:</h5>
                    <p className="card-text">Para más información consulte en el momento de realizar su reserva.</p>
                </div>
            </div>
        <div className="container"></div>
            <div className="row mt-5 p-5" id="contacto" style={{ border: "2px solid #112d4e" }}>
                <div className="col mx-5">
                    <h5 className="card-title my-2" style={{ color: "#112d4e" }}>Más información</h5>
                    <p className="py-3">Si tienes cualquier duda por favor deja tus datos y te escribiremos</p>
                    <form>
                        <div className="form-group">
                            <label for="formGroupExampleInput">Nombre</label>
                            <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Nombre completo" />
                        </div>
                        <div className="form-group">
                            <label for="formGroupExampleInput2">Email</label>
                            <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Dirección de correo" />
                        </div>
                        <button type="submit" className="btn btn-secondary btn-lg btn-block my-3" style={{ backgroundColor: "#112D4E", color: "white" }}>Enviar</button>
                    </form>
                </div>
                <div className="col mx-5">
                    <h5 className="card-title my-5" style={{ color: "#112d4e" }}>Llámanos</h5>
                    <FontAwesomeIcon icon={faPhone} size="2x" color="#112d4e"/>
                    <h2 className="my-3" style={{ color: "#112d4e" }}>911000222</h2>
                    <p>Te ofreceremos toda la información que necesites y te asesoraremos sobre las mejores opciones de alquiler para tus necesidades</p>
                </div>
            </div>
        </div>
    );
};