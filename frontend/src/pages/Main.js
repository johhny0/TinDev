import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import './Main.css';
import api from '../services/api';
import { Link } from 'react-router-dom';
import itsamatch from '../assets/itsamatch.png'


export default function Main({ match: { params: { id } } }) {
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function loadUers() {
            const { data } = await api.get('/devs', { headers: { user: id } })

            setUsers(data);
        }

        loadUers();
    }, [id]);

    useEffect(()=>{
        const socket = io('http://localhost:3333', {
            query: {
                user: id
            }
        });

        socket.on('match', dev=>{
            setMatchDev(dev);
        })
    }, [id]);

    async function handleLike(user) {
        await api.post(`devs/${user._id}/likes`, null, { headers: { user: id } });
        setUsers(users.filter(u => u._id !== user._id));
    }
    async function handleDislike(user) {
        await api.post(`devs/${user._id}/deslikes`, null, { headers: { user: id } });
        setUsers(users.filter(u => u._id !== user._id));
    }
    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt="Avatar" />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>

                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user)}>
                                    <img src={dislike} alt="Dislike" />
                                </button>
                                <button type="button" onClick={() => handleLike(user)}>
                                    <img src={like} alt="Like" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                    <div className="empty">Acabou :(</div>
                )}


                {matchDev && (
                    <div className="match-container">
                       <img src={itsamatch} alt="MatchImg" />
                       <img src={matchDev.avatar} className="avatar" alt="MatchUser" />
                        <strong>{matchDev.name}</strong>
                        <p>{matchDev.bio}</p>
                        <button type="button" onClick={()=> setMatchDev(null)}>FECHAR</button>
                    </div>
                )}
        </div>
    );
}