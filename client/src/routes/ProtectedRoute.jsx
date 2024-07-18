// import React from "react";
import { Navigate } from "react-router-dom";

function useAuth() {
	const isAuthenticated = localStorage.getItem("token");
	return isAuthenticated;
}

export default function PrivateRoute({ children }) {
	const isAuthenticated = useAuth();
	return isAuthenticated ? children : <Navigate to="/log-in" />;
}
