import React, { useState, useEffect } from 'react';
import './NavbarMobile.css';
import { Link as Anchor, useNavigate, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faSearch, faHome, faPlus, faBriefcase } from '@fortawesome/free-solid-svg-icons';



export default function NavbarMobile() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
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
    const openModal = () => {
        setModalOpen(!modalOpen);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 0) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


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

                console.log(data)
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);

            });
    }, []);

    return (
        <section className={scrolled ? 'scrolledMobile' : 'scrolledMobile'}>
            <Anchor to={`/`} className={location.pathname === '/' ? 'active2' : ''} onClick={closeModal}  >
                <FontAwesomeIcon icon={faHome} />
                <span>Inicio</span>

            </Anchor>
            <Anchor to={`/trabajos`} className={location.pathname === '/trabajos' ? 'active2' : ''} onClick={closeModal}  >
                <FontAwesomeIcon icon={faBriefcase} />
                <span>Trabajos</span>

            </Anchor>


            <button onClick={modalOpen ? closeModal : openModal} className="plus"  >
                {modalOpen ? 'x' : <FontAwesomeIcon icon={faPlus} />}
            </button>


            <Anchor to={`/marketpleace`} className={location.pathname === '/marketpleace' ? 'active2' : ''} onClick={closeModal}  >
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>Market</span>

            </Anchor>

            <Anchor to={`usuario/${usuario?.idUsuario}/${usuario?.nombre?.replace(/\s+/g, '_')}`} className={location.pathname === '/usuario' ? 'active2' : ''} onClick={closeModal} >
                <FontAwesomeIcon icon={faUser} />
                <span>Perfil</span>
            </Anchor>






            {modalOpen && (
                <div className="modalNavMobileContain">
                    <div className="modalNavMobile">
                        <span className="close" onClick={closeModal}>X</span>
                        <Anchor to={`/`}>
                            Inicio
                        </Anchor>
                        <Anchor to={`/nosotros`}>
                            Nosotros
                        </Anchor>
                        <Anchor to={`/contacto`}>
                            Contacto
                        </Anchor>


                        <Anchor to={`https://admin.efectovial.online/`} > Dashboard</Anchor>
                    </div>
                </div>
            )}
        </section>
    );
}
