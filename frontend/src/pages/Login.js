import React, { useState } from 'react';

import logo from '../assets/logo.svg';
import './Login.css';

import api from '../services/api';

export default function Login({ history }) {
    const [username, setUsername] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const { data: { _id } } = await api.post('/devs', { username });

        history.push(`/dev/${_id}`);
    }

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <img src={logo} alt="Tindev" />
                <input
                    placeholder="Usuario no Github"
                    value={username}
                    onChange={e => setUsername(e.target.value)} />
                <button type="submit">Enviar</button>

            </form>
        </div>
    );
}

