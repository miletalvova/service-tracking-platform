import api from "./axios";

export async function register(firstname: string, lastname: string, email: string, username: string, password: string, role: number) {
    try {
        const response = await api.post("/api/auth/register", { firstname, lastname, email, username, password, role });
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
}

export async function login(email: string, password: string) {
    try {
        const response = await api.post("/api/auth/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}
