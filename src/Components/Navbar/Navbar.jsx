import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { Link as Anchor, useNavigate, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTools, faShoppingCart, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo.png'
import InfoUser from '../InfoUser/InfoUser';
import InfoUserNav from '../InfoUserNav/InfoUserNav';
import Logout from '../Logout/Logout';
import InputSerach from '../InputSerach/InputSearchs';
export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();








    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 70) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);


    return (
        <header className={scrolled ? "navbar scrolled " : "navbar"}>
            <nav >


                <Anchor to={`/`} className='logo'>
                    <img src={logo} alt="Efecto vial Web logo" />


                </Anchor>



                <InputSerach />


                <div className='enlaces2'>
                    <Anchor to={`/`} className={location.pathname === '/' ? 'active' : ''}><FontAwesomeIcon icon={faHome} className='icon2' /> </Anchor>
                    <Anchor to={`/trabajos`} className={location.pathname === '/trabajos' ? 'active' : ''}><FontAwesomeIcon icon={faBriefcase} className='icon2' /> </Anchor>
                    <Anchor to={`/marketpleace`} className={location.pathname === '/marketpleace' ? 'active' : ''}><FontAwesomeIcon icon={faShoppingCart} className='icon2' /> </Anchor>
                    <Anchor to={`/servicios`} className={location.pathname === '/servicios' ? 'active' : ''}><FontAwesomeIcon icon={faTools} className='icon2' /> </Anchor>

                </div>

                <div className='deFlexnav'>

                    <div className='deNone'>
                        <InfoUser />
                    </div>
                    <div className={`nav_toggle  ${isOpen && "open"}`} onClick={() => setIsOpen(!isOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                </div>

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





            </nav>


        </header>
    );
}
