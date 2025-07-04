import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProtectedData = async () => {
            const token = localStorage.getItem("jwt-token");

            // Check if token exists
            if (!token) {
                console.log("No token found, redirecting to login.");
                navigate("/login");
                return; // Stop if no token
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Send token
                    }
                });

                // Handle unauthorized/forbidden responses (token invalid/expired)
                if (response.status === 401 || response.status === 403) {
                    console.error("Token invalid or expired, redirecting to login.");
                    localStorage.removeItem("jwt-token"); // Clear invalid token
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.msg || "Failed to fetch protected data");
                }

                const data = await response.json();
                setUserData(data);

            } catch (err) {
                console.error("Error fetching protected data:", err);
                setError(err.message);
            } finally {
                setLoading(false); // Set loading to false after attempt
            }
        };

        fetchProtectedData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("jwt-token"); // Delete token from localStorage
        navigate("/login");
    };

    if (error) {
        return (
            <div className="text-center mt-5">
                <div className="alert alert-danger">Error: {error}</div>
                <button onClick={() => navigate("/login")} className="btn btn-primary mt-3">Go to Login</button>
            </div>
        );
    }

    // Render protected content
    return (
        <div className="text-center mt-5">
            <h1 className="display-4">Private Page</h1>
            {userData ? (
                <div>
                    <p>Welcome, {userData.logged_in_as}!</p>
                    <p>{userData.message}</p>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
            <button onClick={handleLogout} className="btn btn-danger mt-3">Log Out</button>
        </div>
    );
};