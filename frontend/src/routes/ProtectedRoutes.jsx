import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {

    // come back later
    return <Outlet />;
}

export default ProtectedRoute;