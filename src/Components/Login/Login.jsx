import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import { useNavigate, } from 'react-router';
import { gapi } from "gapi-script";
import { GoogleLogin } from "react-google-login";
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mensaje2, setMensaje2] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setMensaje2('Procesando...')
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('contrasena', password);

            formData.append('iniciar_sesion', true);

            const response = await fetch('https://www.faugetdigital.shop/login.php', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.mensaje) {
                    console.log(data.usuario);
                    console.log(data.mensaje);
                    toast.success(data.mensaje);
                    setMensaje2('')
                    saveUserToLocalStorage(data.usuario);
                    setTimeout(() => {
                        window.location.reload();

                    }, 2000);

                } else if (data.error) {
                    setErrorMessage(data.error);
                    console.log(data.error);
                    toast.error(data.error);
                    setMensaje2('')
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

    const saveUserToLocalStorage = (user) => {
        // Obtener usuarios existentes del localStorage
        const existingUsers = JSON.parse(localStorage.getItem('usuarios')) || [];

        // Buscar si ya existe un usuario con el mismo idUsuario
        const existingUserIndex = existingUsers.findIndex(u => u.idUsuario === user.idUsuario);

        // Si existe, reemplazar; de lo contrario, agregar a la lista
        if (existingUserIndex !== -1) {
            existingUsers[existingUserIndex] = user;
        } else {
            existingUsers.push(user);
        }

        // Guardar la lista actualizada en localStorage
        localStorage.setItem('usuarios', JSON.stringify(existingUsers));
        console.log('usuarios guardados', existingUsers)
    };


    const clientID =
        "901329466549-imbkgdg5udchc3i7a2so08b42avdnqb2.apps.googleusercontent.com";

    useEffect(() => {
        const start = () => {
            gapi.auth2.init({
                clientId: clientID,
            });
        };
        gapi.load("client:auth2", start);
    }, []);

    const onSuccess = async (googleResponse) => {
        let url = "https://www.faugetdigital.shop/loginPostGoogle.php"; // Ajusta la URL según tu código para el inicio de sesión con Google
        setMensaje2('Procesando...')
        try {
            const { name, email, googleId, imageUrl } = googleResponse.profileObj;

            // Datos necesarios para el inicio de sesión con Google en el servidor
            const formData = new FormData();
            formData.append('nombre', name);
            formData.append('email', email);
            formData.append('contrasena', googleId);
            formData.append('imagen', imageUrl);
            formData.append('banner', 'https://www.faugetdigital.shop/imagenes_usuarios/banner.png');
            formData.append('iniciar_sesion_google', true); // Ajusta el nombre del parámetro según tu código

            const serverResponse = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (serverResponse.ok) {
                const data = await serverResponse.json();
                if (data.mensaje) {
                    console.log(data.mensaje);
                    console.log(data.usuario);
                    toast.success(data.mensaje);
                    setMensaje2('')
                    saveUserToLocalStorage(data.usuario);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                    console.log(googleResponse)
                } else if (data.error) {
                    setErrorMessage(data.error);
                    console.log(data.error);
                    toast.error(data.error);
                    setMensaje2('')
                    console.log(formData)
                }
            } else {
                throw new Error('Error en la solicitud al servidor');
                setMensaje2('')
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
            setMensaje2('')
        }
    };



    const onFailure = () => {
        console.log("Something went wrong");
    };
    return (
        <div className='formContain'>
            <ToastContainer />
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin} className='formAuth'>
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
                    <label htmlFor="password">Contraseña:</label>
                    <div className='deFlexInputs'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        Iniciar Sesión
                    </button>
                )}
                <GoogleLogin
                    className="google"
                    image="./google.png"
                    buttonText="Continuar con Google"
                    clientId={clientID}
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={"sigle_host_policy"}
                />
            </form>


        </div>
    );
}
