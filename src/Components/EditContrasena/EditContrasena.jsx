import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/logo.png'
import HeaderBack from '../../Components/HeaderBack/HeaderBack';
export default function EditContrasena() {
    const navigate = useNavigate();
    const { idUsuario } = useParams();
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const handleEditarContrasena = () => {
        // Validar que el idUsuario, la nueva contraseña y la confirmación de la contraseña no estén vacíos
        // if (!idUsuario || nuevaContrasena.trim() === '' || confirmarContrasena.trim() === '') {
        //     toast.error('Por favor, proporciona el idUsuario, la nueva contraseña y la confirmación de la contraseña');
        //     return;
        // }
        setMensaje('Procesando...');
        // Validar que la nueva contraseña y la confirmación de la contraseña sean iguales
        if (nuevaContrasena !== confirmarContrasena) {
            toast.error('No coinciden las contraseñas');
            return;
        }

        // Realizar la solicitud PUT para editar la contraseña
        fetch(`https://www.faugetdigital.shop/editContrasena.php?idUsuario=${idUsuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contrasena: nuevaContrasena }),
        })
            .then(response => response.json())
            .then(data => {
                // Mostrar el resultado utilizando react-toastify
                if (data.error) {
                    toast.error(data.error);
                    setMensaje('');
                } else {
                    toast.success(data.mensaje);
                    setMensaje('');
                    setTimeout(() => {
                        navigate("/auth");
                    }, 2000);
                    setConfirmarContrasena('')
                    setNuevaContrasena('')

                }
            })
            .catch(error => {
                console.error('Error al editar contraseña:', error);
                setMensaje('');
                toast.error('Error al editar contraseña. Inténtalo de nuevo más tarde.');

            });
    };

    return (
        <>
            <HeaderBack link="/" title="Recuperación" />
            <div className='bgHeight'>

            </div>
            <div className='ConatinerVerificacion'>
                <div className='ConatinerVerific'>
                    <img src={logo} alt="efectio vial web" />
                    <h3>Editar Contraseña</h3>

                    <div className='deFlexInputs'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={nuevaContrasena}
                            onChange={(e) => setNuevaContrasena(e.target.value)}
                            placeholder='Nueva contraseña'
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>

                    <div className='deFlexInputs'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmarContrasena}
                            onChange={(e) => setConfirmarContrasena(e.target.value)}
                            placeholder='Confirmar nueva contraseña'
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}

                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>


                    {mensaje ? (
                        <button type="button" className='btnLoading2' disabled>
                            {mensaje}
                        </button>
                    ) : (
                        <button className='btnLogin' onClick={handleEditarContrasena}>Guardar Cambios</button>
                    )}
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}
