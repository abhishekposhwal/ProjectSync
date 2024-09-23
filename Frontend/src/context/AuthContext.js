import React, { createContext, useState, useEffect } from 'react';
import axios from '../Api/axios.js';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
            getUserInfo(storedToken);
        } else {
            setUser(null);
        }
    }, []);

    const getUserInfo = async (accessToken) => {
        try {
            const response = await axios.get("/v1/users/current-user", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setUser(response.data.data);
        } catch (error) {
            console.error("Error fetching user info:", error.message);
            setUser(null);
            history.push("/login");
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post("/v1/users/login", credentials);
            const { accessToken, refreshToken, user } = response.data.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            setUser(user);
            setError(null); // Clear any previous error
            return response.data.data;
        } catch (error) {
            setError(error.response?.status || "Login failed");
            throw error; // Re-throw the error to handle it in the component
        }
    };

    const logout = async () => {
        try {
            const response = await axios.post("/v1/users/logout");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
            setError(response?.status);
            console.log(response)
            history.push("/login");
        } catch (error) {
            if (!error) {
                setError(error.response?.status || "Logout failed");
                throw error;
            } else {
                setError(null); // Clear any previous error
            }
        }
    };

    const clearError = () => {
        setError(null);
    };

    const changePassword = async (data) => {
        try {
            await axios.post("/auth/change-password", data);
        } catch (error) {
            console.error("Change password failed:", error.message);
        }
    };

    const updateAccount = async (data) => {
        try {
            await axios.put("/auth/update-account", data);
        } catch (error) {
            console.error("Update account failed:", error.message);
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post("/auth/refresh-token", {
                refreshToken: localStorage.getItem("refreshToken")
            });
            const { accessToken } = response.data;
            localStorage.setItem("accessToken", accessToken);
            getUserInfo(accessToken);
        } catch (error) {
            console.error("Refresh token failed:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, error, login, logout, clearError, changePassword, updateAccount, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
