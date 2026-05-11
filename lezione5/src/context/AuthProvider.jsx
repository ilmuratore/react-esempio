import { useState, useEffect} from 'react'
import { AuthContext } from './AuthContext';
import { login as apiLogin, register as apiRegister } from '../api/auth';

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState( () => !!sessionStorage.getItem('token'));

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) return

        fetch('http://localhost:3000/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (!res.ok) throw new Error('Token non valido');
            return res.json();
        })
        .then(data => {
            setUser(data.user);
            setLoading(false);
        })
        .catch(() => {
            sessionStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        });
    }, []);

    async function login(email, password) {
        const data = await apiLogin(email, password);
        sessionStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    }

    async function register(email, password) {
        return await apiRegister(email, password);
    }

    function logout() {
        sessionStorage.removeItem('token');
        setUser(null);
    }

    const value = { user, login, logout, register, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export {AuthProvider}