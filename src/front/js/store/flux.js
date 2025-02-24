import Swal from "sweetalert2";
import React, { useContext } from "react";
import { Context } from "../store/appContext";

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            vehicles: [],
            selectedVehicle: null,
            isAuthenticated: false
        },
        actions: {
            fetchVehicles: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/vehicles");
                    const data = await resp.json();
                    setStore({ vehicles: data });
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "Error al obtener los vehículos",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                    console.error("Error fetching vehicles from backend", error);
                }
            },

            fetchVehicleById: async (vehicleId) => {
                try {
                    const store = getStore();

                    // Evita el fetch si ya tenemos el vehículo correcto en el estado
                    if (store.selectedVehicle && store.selectedVehicle.id === vehicleId) return;

                    const resp = await fetch(`${process.env.BACKEND_URL}/api/vehicles/${vehicleId}`);
                    
                    if (!resp.ok) {
                        throw new Error("Vehículo no encontrado");
                    }
                    
                    const data = await resp.json();
                    setStore({ selectedVehicle: data });
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo obtener la información del vehículo.",
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                    console.error("Error fetching vehicle by ID:", error);
                    setStore({ selectedVehicle: null });
                }
            },

            registerUser: async (userData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/signup`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userData)
                    });

                    const data = await response.json();
                    console.log("Respuesta del backend:", data);
                    if (!response.ok) {
                        throw new Error(data.msg || "Error en el registro");
                    }

                    if (data.usuario) {
                        setStore({
                            isAuthenticated: true,
                            usuario: data.usuario // Ahora, almacenas los datos del usuario en el contexto
                        });
                    }

                    Swal.fire({
                        title: "Registro exitoso",
                        text: "Tu cuenta ha sido creada correctamente",
                        icon: "success",
                        confirmButtonText: "OK"
                    });

                    return true;
                } catch (error) {
                    Swal.fire({
                        title: "Error en el registro",
                        text: error.message,
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                    return false;
                }
            },

            loginUser: async (email, contraseña) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, contraseña }),
                        credentials: "omit"
                    });

                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.msg || "Error en el login");
                    }

                    localStorage.setItem("token", data.access_token);
                    setStore({ isAuthenticated: true, usuario: data.usuario });

                    Swal.fire({
                        title: "Inicio de sesión exitoso",
                        text: `Bienvenido de nuev@, ${data.usuario.nombre}!`,
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#112D4E"
                    });
                      
                    return true;
                } catch (error) {
                    Swal.fire({
                        title: "Error en el login",
                        text: error.message,
                        icon: "error",
                        confirmButtonText: "OK"
                    });
                    return false;
                }
            },

            logoutUser: () => {
                localStorage.removeItem("token");
                setStore({ isAuthenticated: false });

                Swal.fire({
                    title: "Sesión cerrada",
                    text: "Has cerrado sesión exitosamente",
                    icon: "info",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#112D4E"
                });
            },

            verifyAuth: () => {
                const token = localStorage.getItem("token");
                if (token) {
                    setStore({ isAuthenticated: true });
                }
            }
        }
    };
};

export default getState;
