import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { setDoc, doc } from 'firebase/firestore';
import useValidation from '../hooks/useValidation';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const { errors, validateField, clearError } = useValidation();
    const [generalError, setGeneralError] = useState(null);
    const { signup } = useAuth();

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        clearError(name);
        setGeneralError(null);

    };

    const handleRegister = async () => {

        validateField('email', formData.email, { required: true, email: true });
        validateField('password', formData.password, { required: true, minLength: 6 });
        validateField('confirmPassword', formData.confirmPassword, {
            required: true,
            match: formData.password,
        });


        if (errors.email || errors.password || errors.confirmPassword) {
            return;
        }


        try {
            await signup(formData.email, formData.password);
            navigate('/home');
        } catch (err) {
            setGeneralError(err.message);
            console.log(err)
        }
    };

    return (
        <Card sx={{ mt: 4, p: 2 }}>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    Register
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
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        margin="normal"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => validateField('confirmPassword', formData.confirmPassword, { required: true, match: formData.password })}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                    {generalError && (
                        <Typography color="error" align="center" sx={{ mt: 2 }}>
                            {generalError}
                        </Typography>
                    )}
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleRegister}
                    >
                        Register
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default Register;