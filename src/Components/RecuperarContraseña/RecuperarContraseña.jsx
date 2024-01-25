import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../images/logo.png'
import { useNavigate, } from 'react-router';
import './RecuperarContraseña.css'
import HeaderBack from '../../Components/HeaderBack/HeaderBack';
export default function RecuperarContraseña() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState('');
    const handleVerificacion = async (e) => {
        e.preventDefault();
        setMensaje('Procesando...');
        try {
            const formData = new FormData();
            formData.append('email', email);

            formData.append('iniciar_sesion', true);

            const response = await fetch('https://www.faugetdigital.shop/recuperarContrasena.php', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.mensaje) {
                    console.log(data.usuario);
                    console.log(data.mensaje);

                    setEmail('');

                    // Aquí hacemos la segunda petición al localhost:8080/verificacion
                    const segundaResponse = await fetch('https://efectovial.onrender.com/verificacion', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data.usuario),
                    });

                    if (segundaResponse.ok) {
                        const segundaData = await segundaResponse.json();
                        console.log('Respuesta del servidor local:', segundaData);
                        toast.success(data.mensaje);
                        toast.success(segundaData.message); // Mostrar el mensaje de éxito desde el backend
                        setMensaje('');

                    } else {
                        throw new Error('Error en la solicitud al servidor local');
                        setMensaje('');
                    }

                } else if (data.error) {
                    setErrorMessage(data.error);
                    console.log(data.error);
                    toast.error(data.error);
                    setMensaje('');
                }
            } else {
                throw new Error('Error en la solicitud al servidor');
                setMensaje('');
            }
        } catch (error) {
            console.error('Error:', error.message);
            toast.error(error.message);
            setMensaje('');
        }
    };
    return (
        <>
            <HeaderBack link="/" title="Verificación" />
            <div className='bgHeight'>

            </div>
            <div className='ConatinerVerificacion'>
                <ToastContainer />

                <form onSubmit={handleVerificacion} className='ConatinerVerific'>
                    <img src={logo} alt="efectio vial web" />
                    <h3>Confirme su email</h3>
                    <div className='inputsAuth'>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email"
                        />
                    </div>


                    {mensaje ? (
                        <button type="button" className='btnLoading2' disabled>
                            {mensaje}
                        </button>
                    ) : (
                        <button type="submit" className='btnLogin'>
                            Enviar
                        </button>
                    )}

                </form>

            </div>
        </>
    )
}
