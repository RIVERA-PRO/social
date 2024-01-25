import React, { useState, useEffect } from 'react';
import './InfoUserMobile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link as Anchor } from 'react-router-dom';

export default function InfoUserMobile() {
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/infoUserApi.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsuario(data);
                setLoading(false);
                console.log(data)
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            {loading ? (
                <div>cargando</div>
            ) : usuario.idUsuario ? ( // Verifica si hay un usuario válido
                <Anchor to={`/perfil`} className='btn-user'>
                    <FontAwesomeIcon icon={faUser} className='icon' />
                    {usuario.nombre.slice(0.13)}

                </Anchor>
            ) : (
                <Anchor to={`/auth`} className='btn-user'>
                    <FontAwesomeIcon icon={faUser} className='icon' />
                    Mi Perfil

                </Anchor>
            )}
        </div>
    );
}
