import React from 'react'
import Login from '../auth/Login';
import Registration from '../auth/Register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../screens/home';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


export const RoutesLayout = () => {
    const { user } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Home /> : <Login />} />
                <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <Registration /> : <Navigate to="/" />} />

            </Routes>
        </Router>)
}
