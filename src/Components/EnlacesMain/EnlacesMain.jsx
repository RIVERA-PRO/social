import React, { useState, useEffect } from 'react'
import './EnlacesMain.css'

import { Link as Anchor, useNavigate, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTools, faShoppingCart, faBriefcase } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {

    const location = useLocation();



    return (


        <div className='enlacesMain'>
            <Anchor to={`/`} className={location.pathname === '/' ? 'active' : ''}><FontAwesomeIcon icon={faHome} className='icon2' /> Inicio</Anchor>
            <Anchor to={`/trabajos`} className={location.pathname === '/trabajos' ? 'active' : ''}><FontAwesomeIcon icon={faBriefcase} className='icon2' />Trabajos </Anchor>
            <Anchor to={`/marketpleace`} className={location.pathname === '/marketpleace' ? 'active' : ''}><FontAwesomeIcon icon={faShoppingCart} className='icon2' />Marketpleace </Anchor>
            <Anchor to={`/servicios`} className={location.pathname === '/servicios' ? 'active' : ''}><FontAwesomeIcon icon={faTools} className='icon2' /> Servicios</Anchor>



        </div>


    );
}
