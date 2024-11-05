import React from 'react'
import Login from '../auth/Login';
import Registration from '../auth/Register'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../screens/home';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


export const RoutesLayout = () => {
    const { currentUser } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/" element={currentUser ? <Home /> : <Login />} />
                <Route path="/home" element={currentUser ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!currentUser ? <Registration /> : <Navigate to="/" />} />

            </Routes>
        </Router>)
}
