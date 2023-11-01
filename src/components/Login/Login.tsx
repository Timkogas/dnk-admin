import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import instance from '../../axiosInstance';
import State from '../../store/State';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const data = await instance.post('/admin/login', { username, password })
        if (data.data.error === false) {
            State.setUser(data.data.data.user)
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', paddingTop: '20px'}}>
            <TextField
                label="Юзернейм"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Пароль"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleLogin} sx={{ marginTop: '10px' }}>Вход</Button>
        </Box>
    );
};

export default Login;