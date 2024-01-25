import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@react-hook/media-query';
import Header from '../Pages/Header/Header';
import NavbarMobile from '../Components/NavbarMobile/NavbarMobile';
import Spiner from '../Components/Spiner/Spiner';
import NavbarProfile from '../Components/NavbarProfile/NavbarProfile';
import Auth from '../Components/Auth/Auth';

import MainGrid from '../Components/MainGrid/MainGrid';

export default function IndexLayout() {
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
            {loading ? (
                <Spiner />
            ) : usuario.idUsuario ? (
                <>
                    <section className={isScreenLarge ? '' : "section"} >
                        {isScreenLarge ? <Header /> : <NavbarProfile />}
                        {isScreenLarge ? '' : <NavbarMobile />}

                        <MainGrid />

                    </section>
                </>
            ) : (
                <section className={isScreenLarge ? '' : "section"} >

                    <section className={isScreenLarge ? '' : "section"} >
                        {isScreenLarge ? <Header /> : <NavbarProfile />}
                        {isScreenLarge ? '' : <NavbarMobile />}

                        <MainGrid />

                    </section>


                </section>
            )}
        </div>
    );
}
