import React, { useState, useEffect } from 'react';
import './UserInfoMain.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link as Anchor } from 'react-router-dom';

export default function UserInfoMain() {
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
        <div className='userInfoMain'>
            {loading ? (
                <div>cargando</div>
            ) : usuario.idUsuario ? ( // Verifica si hay un usuario válido
                <Anchor to={`/perfil`} className='btn-sesion'>
                    <img src={usuario.imagen} alt="imagen" />
                    {usuario.nombre}
                    {usuario.nombre}
                </Anchor>
            ) : (
                <Anchor to={`/auth`} className='btn-sesion'>

                    <img src='https://www.faugetdigital.shop/imagenes_usuarios/user.jpg' alt="imagen" />
                    <div>
                        <strong>

                            Juan Emanuel Rivera
                        </strong>
                        <h5>

                            indiojuan2012.jr@gmail.com
                        </h5>
                    </div>

                </Anchor>
            )}
        </div>
    );
}
