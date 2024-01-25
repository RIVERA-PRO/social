import React, { useState } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';
import './Auth.css';
import logo from '../../images/logo.png'
import { Link as Anchor } from 'react-router-dom';
import UsuariosGuardados from '../UsuariosGuardados/UsuariosGuardados';
export default function Auth() {
    const [showLogin, setShowLogin] = useState(true);

    const toggleComponent = () => {
        setShowLogin((prevShowLogin) => !prevShowLogin);
    };

    return (
        <div className='AuthContainer'>



            {showLogin ? <Login /> : <Register />}
            <button onClick={toggleComponent} className='sinCuenta'>
                {showLogin ? (
                    <>
                        ¿No tienes una cuenta? <span>Registrarse</span>
                    </>
                ) : (
                    <>
                        ¿Ya tienes una cuenta? <span>Iniciar sesión</span>
                    </>
                )}
            </button>
            <Anchor to={`/verificacion`} className='verifiText'>
                Recuperar contraseña
            </Anchor>


            <UsuariosGuardados />
        </div>
    );
}
