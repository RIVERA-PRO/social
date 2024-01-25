import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


import { Link as Anchor } from "react-router-dom";
export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch('https://www.faugetdigital.shop/logout.php', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.mensaje) {
                    console.log(data.mensaje);
                    toast.success(data.mensaje);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else if (data.error) {
                    console.log(data.error);
                    toast.error(data.error);
                }
            } else {
                throw new Error('Error en la solicitud al servidor');
            }
        } catch (error) {
            console.error('Error:', error.message);
            toast.error(error.message);
        }
    };
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/infoUserApi.php');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsuario(data);

                // Simulando un tiempo de carga de 3 segundos

                setLoading(false);

            } catch (error) {
                console.error('Error al obtener datos:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {/* <ToastContainer /> */}

            {

                usuario.idUsuario ? (

                    <Anchor onClick={handleLogout} >
                        <FontAwesomeIcon icon={faSignOutAlt} className='icon2' />
                        Cerrar Sesión
                    </Anchor>

                ) : (
                    <Anchor onClick={handleLogout} >
                        <FontAwesomeIcon icon={faSignOutAlt} className='icon2' />
                        Cerrar Sesión
                    </Anchor>
                )

            }
        </div>
    );
}
