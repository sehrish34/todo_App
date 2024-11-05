import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {  useNavigate } from 'react-router-dom';
import { db } from '../auth/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import 'react-datepicker/dist/react-datepicker.css';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const { currentUser, logout, loading } = useAuth()

    const [currentTodo, setCurrentTodo] = useState({ id: null, title: '', date: new Date(), priority: 'Medium' });
    const [isEditing, setIsEditing] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();
    const userId = currentUser.uid;

    useEffect(() => {
        const todosRef = collection(db, 'todos');
        const unsubscribe = onSnapshot(todosRef, (snapshot) => {
            const fetchedTodos = snapshot.docs
                .filter(doc => doc.data().userId === userId)
                .map(doc => ({ id: doc.id, ...doc.data() }));
            setTodos(fetchedTodos);
        });
        return () => unsubscribe();
    }, [userId]);

    const handleUpdateTodo = async () => {
        const todosRef = collection(db, 'todos');
        if (isEditing) {
            const todoRef = doc(db, 'todos', currentTodo.id);
            await updateDoc(todoRef, { title: currentTodo.title, date: currentTodo.date, priority: currentTodo.priority });
        } else {
            await addDoc(todosRef, {
                title: currentTodo.title,
                date: currentTodo.date,
                priority: currentTodo.priority,
                userId
            });
        }
        clearForm();
    };

    const handleEditTodo = (todo) => {
        setCurrentTodo({
            id: todo.id,
            title: todo.title,
            date: todo.date ? todo.date.toDate() : new Date(),
            priority: todo.priority
        });
        setIsEditing(true);
        setOpenDialog(true);
    };

    const handleDeleteTodo = async (id) => {
        const todoRef = doc(db, 'todos', id);
        await deleteDoc(todoRef);
    };

    const clearForm = () => {
        setCurrentTodo({ id: null, title: '', date: new Date(), priority: 'Medium' });
        setIsEditing(false);
        setOpenDialog(false);
    };

    const sortedTodos = [...todos].sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };

        const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];

        if (priorityComparison === 0) {
            const dateA = new Date(a.dueDate).getTime();
            const dateB = new Date(b.dueDate).getTime();

            return dateA - dateB;
        }

        return priorityComparison;
    });

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    }
    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Box sx={{ mt: 4, p: 2 }}>
                <Card sx={{ width: '600px' }}>
                    <CardContent>
                        <Typography variant="h5" align="center" gutterBottom>
                            To-Do List
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                            Add To-Do
                        </Button>
                        <List>
                            {sortedTodos.map(todo => (
                                <ListItem key={todo.id} secondaryAction={
                                    <>
                                        <IconButton onClick={() => handleEditTodo(todo)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => handleDeleteTodo(todo.id)}>
                                            <Delete />
                                        </IconButton>
                                    </>
                                }>
                                    <ListItemText
                                        primary={todo.title}
                                        secondary={`${new Date(todo.date.seconds * 1000).toLocaleDateString()} - Priority: ${todo.priority}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>

            <Dialog open={openDialog} onClose={clearForm} sx={{ justifyContent: 'center', display: 'flex' }}>
                <DialogTitle>{isEditing ? 'Edit To-Do' : 'Add To-Do'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="To-Do Title"
                        fullWidth
                        value={currentTodo.title}
                        onChange={(e) => setCurrentTodo({ ...currentTodo, title: e.target.value })}
                        sx={{ mt: 5 }}
                    />
                    <DatePicker
                        selected={currentTodo.date instanceof Date ? currentTodo.date : new Date()}
                        onChange={(date) => setCurrentTodo({ ...currentTodo, date })}
                        popperPlacement="bottom"
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select a date"
                        className="react-datepicker"
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={currentTodo.priority}
                            onChange={(e) => setCurrentTodo({ ...currentTodo, priority: e.target.value })}
                        >
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="Low">Low</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={clearForm}>Cancel</Button>
                    <Button onClick={handleUpdateTodo}>
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Button onClick={handleLogout}>Logout</Button>
        </>
    );
};

export default Home;