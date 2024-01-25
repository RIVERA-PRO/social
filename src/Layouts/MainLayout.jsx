import React, { useState, useEffect } from 'react';
import Header from '../Pages/Header/Header';
import NavbarMobile from '../Components/NavbarMobile/NavbarMobile';
import Spiner from '../Components/Spiner/Spiner';
import { Outlet } from 'react-router-dom';
import Auth from '../Components/Auth/Auth';
import { useMediaQuery } from '@react-hook/media-query';

export default function MainLayout() {
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
    const isScreenLarge = useMediaQuery('(min-width: 900px)');
    return (
        <div>
            <div>


                {loading ? (
                    <Spiner />
                ) : usuario.idUsuario ? (
                    <>


                        <section  >


                            <NavbarMobile />
                            {isScreenLarge ? <Header /> : ""}

                            <Outlet />
                        </section>

                    </>
                ) : (
                    <section  >





                        <Auth />
                    </section>
                )}
            </div>

        </div>
    );
}
