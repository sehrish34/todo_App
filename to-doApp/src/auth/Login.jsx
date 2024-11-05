import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase';
import useValidation from '../hooks/useValidation';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { errors, validateField, clearError } = useValidation();
    const [generalError, setGeneralError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        clearError(name);
    };
    const handleNavigation = () => {
        navigate('/register')
    }
    const handleLogin = async () => {

        validateField('email', formData.email, { required: true, email: true });
        validateField('password', formData.password, { required: true, minLength: 6 });

        if (errors.email || errors.password) {
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
   
            navigate('/home')
        } catch (err) {
            validateField('email', '', { required: true });
            
        }
    };

    return (
        <Card sx={{ mt: 4, p: 2 }}>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        margin="normal"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={() => validateField('email', formData.email, { required: true, email: true })}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={() => validateField('password', formData.password, { required: true, minLength: 6 })}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleNavigation}
                    >
                        SignUp
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Login;