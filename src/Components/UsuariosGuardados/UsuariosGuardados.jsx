import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './UsuariosGuardados.css';
import { useNavigate, } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UsuariosGuardados({ onLogin }) {
    const [usuariosGuardados, setUsuariosGuardados] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [modalHeight, setModalHeight] = useState('auto'); // Nuevo estado para la altura del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        // Obtener la lista de usuarios guardados desde el localStorage
        const storedUsers = localStorage.getItem('usuarios');

        if (storedUsers) {
            // Parsear la cadena JSON a un array de objetos
            const parsedUsers = JSON.parse(storedUsers);
            setUsuariosGuardados(parsedUsers);
        }
    }, []);

    const handleLoginClick = (usuario) => {
        setSelectedUser(usuario);
    };
    const handleLoginClose = (usuario) => {
        setSelectedUser(null);
    };

    const handleStartSession = async () => {
        if (selectedUser) {
            try {
                const formData = new FormData();
                formData.append('email', selectedUser.email);
                formData.append('contrasena', selectedUser.contrasena);
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
                        setSelectedUser(null)
                        setTimeout(() => {
                            window.location.reload();

                        }, 2000);

                    } else if (data.error) {

                        console.log(data.error);
                        toast.error(data.error);
                    }
                } else {
                    throw new Error('Error en la solicitud al servidor');
                }
            } catch (error) {
                console.error('Error:', error.message);
                toast.error(error.message);
            }
        }
    };



    const handleToggleModalHeight = () => {
        setModalHeight(modalHeight === 'auto' ? '3rem' : 'auto');
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className='modalUsuarios'>
            {usuariosGuardados.length > 0 && (
                <div className='modalUsuariosContain' style={{ height: modalHeight }}>
                    <ToastContainer />
                    <div className='deFLexBtn'>
                        <h3>Usuarios Guardados:</h3>
                        <button onClick={handleToggleModalHeight}>
                            {isModalOpen ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                        </button>
                    </div>

                    {usuariosGuardados.map((usuario) => (
                        <div key={usuario.idUsuario} className='usuarioCard' onClick={() => handleLoginClick(usuario)}>

                            <span className='profileName'>
                                {usuario.nombre.slice(0, 1)}
                            </span>

                            <div className='deColumnInputs'>

                                <strong>{usuario.nombre} </strong>
                                <strong>{usuario.email} </strong>

                            </div>

                        </div>
                    ))}


                    {selectedUser && (
                        <div className='modalLogin'>

                            <div className='modalLoginContain'>
                                <button className='closeModalLogin' onClick={() => handleLoginClick()}>
                                    X
                                </button>
                                <span className='profileName2'>
                                    {selectedUser.nombre.slice(0, 1)}
                                </span>
                                <p>  {selectedUser.nombre}</p>
                                <div className='deFlexInputs'>
                                    <input type="text" value={selectedUser.email} readOnly />
                                </div>

                                <div className='deFlexInputs'>
                                    <input type={showPassword ? 'text' : 'password'} value={selectedUser.contrasena} readOnly />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>

                                </div>
                                <button className='btnLogin' onClick={handleStartSession}>Iniciar Sesión </button>

                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
