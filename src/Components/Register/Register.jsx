import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css'
export default function Register() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mensaje2, setMensaje2] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formularioEnviado, setFormularioEnviado] = useState(false);


    const crearCatalogo = async (e) => {
        e.preventDefault();
        setMensaje2('Procesando...')
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('email', email);
            formData.append('contrasena', contrasena);


            const response = await fetch('https://www.faugetdigital.shop/registro.php', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.mensaje) {
                    setMensaje(data.mensaje);
                    toast.success(data.mensaje);
                    setMensaje2('')

                } else if (data.error) {
                    setError(data.error);
                    toast.error(data.error);
                    setMensaje2('')
                    setTimeout(() => {
                        setFormularioEnviado(false);
                        window.location.reload();
                    }, 2000);
                }
            } else {
                throw new Error('Error en la solicitud al servidor');
                setMensaje2('')
            }
        } catch (error) {
            console.error('Error:', error.message);
            toast.error(error.message);
            setMensaje2('')
        }
    };

    return (
        <div className='formContain'>
            <ToastContainer />
            <h2>Registrarse</h2>
            <form onSubmit={crearCatalogo} className='formAuth'>


                <div className='inputsAuth'>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        placeholder="Nombre"
                    />
                </div>

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

                <div className='inputsAuth'>
                    <label htmlFor="contrasena">Contraseña:</label>
                    <div className='deFlexInputs'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="contrasena"
                            name="contrasena"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                            placeholder="Contraseña"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>

                {mensaje2 ? (
                    <button type="button" className='btnLoading2' disabled>
                        {mensaje2}
                    </button>
                ) : (
                    <button type="submit" className='btnLogin'>
                        Registrarse
                    </button>
                )}

            </form>


        </div>
    );
}
