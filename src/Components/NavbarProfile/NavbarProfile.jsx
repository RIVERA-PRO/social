import React, { useState, useEffect } from 'react'
import './NavbarProfile.css'

import { Link as Anchor, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTools, faShoppingCart, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import InfoUserNav from '../InfoUserNav/InfoUserNav';
import Logo from '../../images/logo.png'
import Logout from '../Logout/Logout';
export default function NavbarProfile() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [initialScrollPos, setInitialScrollPos] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        fetch('/infoUserApi.php')
            .then(response => response.json())
            .then(data => {
                setUsuario(data);
                setLoading(false);
                console.log(data);
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
                setLoading(false);
            });
    }, []);

    const handleScroll = () => {
        const currentScrollPos = window.scrollY;

        if (currentScrollPos > initialScrollPos && currentScrollPos > 50) {
            // Scrolling down
            setIsScrolled(true);
        } else {
            // Scrolling up
            setIsScrolled(false);
        }

        setInitialScrollPos(currentScrollPos);
    };

    useEffect(() => {
        setInitialScrollPos(window.scrollY);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <div className={isScrolled ? 'NavbarProfileContain scrolled' : 'NavbarProfileContain'}>


            {loading ? (
                <div className='InfoPerfilLoading'>
                    <span className='InfoPerfilLoading'>

                    </span>
                    <div className='InfoPerfilLoadingText'>
                        <h5 ></h5>
                        <h6 ></h6>
                    </div>
                </div>
            ) : usuario.idUsuario ? (
                <Anchor to={`usuario/${usuario.idUsuario}/${usuario.nombre.replace(/\s+/g, '_')}`} className='userPerfil'>
                    <img src={usuario.imagen} alt="imagen" />
                    <div>
                        <strong>{usuario.nombre}</strong>
                        <h5>{usuario.email}</h5>
                    </div>
                </Anchor>
            ) : (
                <div className='InfoPerfilLoading'>
                    <span className='InfoPerfilLoading'>

                    </span>
                    <div className='InfoPerfilLoadingText'>
                        <h5 ></h5>
                        <h6 ></h6>
                    </div>
                </div>
            )}

            <div className={`nav_items ${isOpen && "open"}`} >


                <InfoUserNav />

                <div className='enlaces'>
                    <Anchor to={`/`} className={location.pathname === '/' ? 'active' : ''}><FontAwesomeIcon icon={faHome} className='icon2' /> Inicio</Anchor>
                    <Anchor to={`/trabajos`} className={location.pathname === '/trabajos' ? 'active' : ''}><FontAwesomeIcon icon={faBriefcase} className='icon2' />Trabajos </Anchor>
                    <Anchor to={`/marketpleace`} className={location.pathname === '/marketpleace' ? 'active' : ''}><FontAwesomeIcon icon={faShoppingCart} className='icon2' />Marketpleace </Anchor>
                    <Anchor to={`/servicios`} className={location.pathname === '/servicios' ? 'active' : ''}><FontAwesomeIcon icon={faTools} className='icon2' /> Servicios</Anchor>
                    <Logout />
                </div>


            </div>


            <div className={`nav_toggle2  ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>
    );
}
