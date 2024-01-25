import React, { useState, useEffect } from 'react';
import './InfoUserNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link as Anchor } from 'react-router-dom';

export default function InfoUserNav() {
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
            ) : usuario?.idUsuario ? ( // Verifica si hay un usuario válido
                <Anchor to={`/usuario/`} className='btn-user-main'>
                    <img src={usuario?.imagen} alt="imagen" />
                    <div className='column'>
                        <strong>
                            {usuario?.nombre?.slice(0, 20)}

                        </strong>
                        <h5>
                            {usuario?.email?.slice(0, 20)}

                        </h5>

                    </div>
                </Anchor>
            ) : (
                <Anchor to={`/auth`} className='btn-user-main'>
                    <img src='https://www.faugetdigital.shop/imagenes_usuarios/user.jpg' alt="imagen" />
                    <div className='column'>
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
