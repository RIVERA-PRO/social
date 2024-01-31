import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './HeaderBack.css';

export default function HeaderBack({ title }) {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 60) {
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

    const goBack = () => {
        // Aquí puedes realizar otras acciones antes de volver atrás, si es necesario
        navigate(-1); // Vuelve atrás en la historia del navegador
    };

    return (
        <div className={scrolled ? 'headerBack scrollNav' : 'headerBack'}>
            <div onClick={goBack} className='back'>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <span>{title}</span>
        </div>
    );
}
