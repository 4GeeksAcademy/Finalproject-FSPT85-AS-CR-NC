const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ],
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
                    console.log("Error fetching vehicles from backend", error);
                }
            },
            fetchVehicleById: async (vehicleId) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/vehicles/${vehicleId}`);
                    if (!resp.ok) {
                        throw new Error("Vehicle not found");
                    }
                    const data = await resp.json();
                    setStore({ selectedVehicle: data });
                } catch (error) {
                    console.log("Error fetching vehicle by ID", error);
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
                    if (!response.ok) {
                        throw new Error(data.msg || "Error en el registro");
                    }
                    alert("Usuario registrado exitosamente");
                    return true;
                } catch (error) {
                    alert(error.message);
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
                    setStore({ isAuthenticated: true });
                    return true;
                } catch (error) {
                    alert(error.message);
                    return false;
                }
            },
            logoutUser: () => {
                localStorage.removeItem("token");
                setStore({ isAuthenticated: false });
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
