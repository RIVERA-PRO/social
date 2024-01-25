import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Perfil.css';
import HeaderBack from '../../Components/HeaderBack/HeaderBack';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEnvelope, faLink, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link as Anchor } from 'react-router-dom';
import { useNavigate, } from 'react-router';
const Perfil = () => {
    const { idUsuario, nombre } = useParams();
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(true);
    const [sinConexion, setSinConexion] = useState(false);
    const [nuevoRol, setNuevoRol] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoFNacimiento, setNuevoFNacimiento] = useState('');
    const [nuevoPresentacion, setNuevoPresentacion] = useState('');
    const [nuevoExperiencia, setNuevoExperiencia] = useState('');
    const [nuevoPerfil, setNuevoRolPerfil] = useState('');
    const [nuevoLinkedin, setNuevoLinkedin] = useState('');
    const [nuevoInstagram, setNuevoInstagram] = useState('');
    const [nuevoFacebook, setNuevoFacebook] = useState('');
    const [nuevoWeb, setNuevoWeb] = useState('');
    const [nuevoTelefono, setNuevoTelefono] = useState('');
    const nombreSinGuiones = nombre.replace(/_/g, ' ');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSection, setSelectedSection] = useState('info');
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [nuevoBanner, setNuevoBanner] = useState(null);
    const navigate = useNavigate();
    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };

    const openModal = () => {
        setModalVisible(true);
    };


    const closeModal = () => {
        setModalVisible(false);
    };
    useEffect(() => {
        const cargarUsuario = () => {
            fetch(`https://www.faugetdigital.shop/usuariosApi.php`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    console.log(idUsuario);
                    console.log(data);

                    // Utilizar map para obtener un array de usuarios y luego filter
                    const usuariosEncontrados = data.usuarios.filter(item => {
                        return item.idUsuario === parseInt(idUsuario, 10) && item.nombre === nombreSinGuiones;
                    });

                    // Verificar si se encontró al menos un usuario
                    if (usuariosEncontrados.length > 0) {
                        setUsuario(usuariosEncontrados[0]);
                        setLoading(false);
                        console.log(usuariosEncontrados[0]);
                    } else {
                        console.error('Usuario no encontrado');
                        setLoading(false);
                    }
                })
                .catch(error => {
                    console.error('Error al cargar el usuario:', error)
                    setSinConexion(true)
                });
        };

        cargarUsuario();
    }, [idUsuario, nombreSinGuiones]);
    const handleUpdateUsuario = () => {
        const payload = {
            rol: nuevoRol !== '' ? nuevoRol : usuario.rol,
            nombre: nuevoNombre !== '' ? nuevoNombre : usuario.nombre,
            fechaNacimiento: nuevoFNacimiento !== '' ? nuevoFNacimiento : usuario.fechaNacimiento,
            presentacion: nuevoPresentacion !== '' ? nuevoPresentacion : usuario.presentacion,
            experiencia: nuevoExperiencia !== '' ? nuevoExperiencia : usuario.experiencia,
            perfil: nuevoPerfil !== '' ? nuevoPerfil : usuario.perfil,
            linkedin: nuevoLinkedin !== '' ? nuevoLinkedin : usuario.linkedin,
            instagram: nuevoInstagram !== '' ? nuevoInstagram : usuario.instagram,
            facebook: nuevoFacebook !== '' ? nuevoFacebook : usuario.facebook,
            web: nuevoWeb !== '' ? nuevoWeb : usuario.web,
            telefono: nuevoTelefono !== '' ? nuevoTelefono : usuario.telefono,
        };

        const nombreModificado = nuevoNombre !== '' && nuevoNombre !== usuario.nombre;

        fetch(`https://www.faugetdigital.shop/usuariosApi.php?idUsuario=${idUsuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setMensaje(`Error al actualizar el usuario: ${data.error}`);
                    toast.error(data.error);
                } else {
                    setMensaje(data.mensaje);
                    setModalVisible(false);
                    toast.success(data.mensaje);

                    if (nombreModificado) {
                        navigate(`/usuario/${idUsuario}/${nuevoNombre.replace(/\s+/g, '_')}`);
                    } else {
                        window.location.reload();
                    }
                }
            })
            .catch(error => {
                setMensaje(`Error al actualizar el usuario: ${error.message}`);
                toast.error(error);
            });
    };


    const [imagenPreview, setImagenPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    const handleFileChange = (event, setFile, setPreview) => {
        const file = event.target.files[0];

        if (file) {
            // Crear una URL de objeto para la imagen seleccionada
            const previewURL = URL.createObjectURL(file);
            setFile(file);
            setPreview(previewURL);
        }
    };

    const handleEditarImagenBanner = () => {
        const formData = new FormData();
        formData.append('idUsuario', idUsuario);
        formData.append('updateAction', 'update'); // Campo adicional para indicar que es una actualización

        if (nuevaImagen) {
            formData.append('imagen', nuevaImagen);
        }

        if (nuevoBanner) {
            formData.append('banner', nuevoBanner);
        }

        // Realizar la solicitud POST en lugar de PUT
        fetch(`https://www.faugetdigital.shop/editarImagenBanner.php?idUsuario=${idUsuario}`, {
            method: 'POST',  // Cambiado a POST
            body: formData
        })
            .then(response => {
                // Manejar el caso cuando la respuesta no es un JSON válido o está vacía
                if (!response.ok) {
                    throw new Error('La solicitud no fue exitosa');
                }

                return response.json();
            })
            .then(data => {
                if (data.error) {
                    setMensaje(`Error al editar la imagen y el banner: ${data.error}`);
                    toast.error(data.error);
                } else {
                    setMensaje('Imagen y banner editados correctamente');
                    toast.success(data.mensaje);
                    window.location.reload();
                }
            })
            .catch(error => {
                setMensaje(`Error al editar la imagen y el banner: ${error.message}`);
                toast.error(error.message);
            });
    };

    const [showBtn, setShowBtn] = useState(true);

    const toggleComponent = () => {
        setShowBtn((prevShowLogin) => !prevShowLogin);
    };

    const [activeButton, setActiveButton] = useState('datosPersonales'); // Nuevo estado para el botón activo

    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType);
        openModal(); // Abre el modal al hacer clic en cualquier botón
    };

    const [usuarioLogin, setUsuarioLogin] = useState({});


    useEffect(() => {
        fetch('/infoUserApi.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsuario(data);

                console.log(data)
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);

            });
    }, []);
    return (
        <div className='perfilContainer'>
            <ToastContainer />
            <HeaderBack link="/" title={nombreSinGuiones} />

            <div className='bgPerfil'></div>

            {sinConexion ? (
                <div className='perfilInfo'>
                    no hay wifi
                </div>
            ) : (
                <>

                    {loading ? (
                        <div className='perfilInfo'>
                            Cargando...
                        </div>
                    ) : usuario.idUsuario ? (
                        <div className='perfilInfo'>

                            <div className='PerfilPrincipal'>
                                <img src={usuario.banner} alt="banner" className='imgbanner' />
                                <div className='perfilInfoText'>

                                    <div className='imgPeriflHeight'>
                                        <img src={usuario.imagen} alt="banner" className='imgProfile' />
                                    </div>
                                    <div className='deFlexPerfil'>
                                        <h3 className='nombre'>{usuario.nombre}</h3>

                                        {usuarioLogin.idUsuario === usuario.idUsuario && (
                                            <button onClick={openModal} className='editBtn'>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        )

                                        }
                                    </div>

                                    <p>{usuario.perfil}</p>

                                    <div className='sectionButtons'>
                                        <button
                                            className={selectedSection === 'info' ? 'selected' : ''}
                                            onClick={() => handleSectionChange('info')}
                                        >
                                            Información
                                        </button>
                                        <button
                                            className={selectedSection === 'public' ? 'selected' : ''}
                                            onClick={() => handleSectionChange('public')}
                                        >
                                            Publicaciones
                                        </button>
                                    </div>
                                </div>


                            </div>


                            <div className='sectionInfo' style={{ display: selectedSection === 'info' ? 'flex' : 'none' }}>
                                <div className='datosContain'>
                                    <p><FontAwesomeIcon icon={faCalendarAlt} className='iconPerfil' />
                                        <strong>Se unió el - </strong> {new Date(usuario.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                                    <p> <FontAwesomeIcon icon={faUser} className='iconPerfil' /> <strong>Tipo de Cuenta - </strong> {usuario.rol}</p>
                                    <p> <FontAwesomeIcon icon={faCalendarAlt} className='iconPerfil' /> <strong>Nacimiento - </strong>  {new Date(usuario.fechaNacimiento).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>


                                    <Anchor to={`mailto:${usuario.email}`} target='blank'>
                                        <FontAwesomeIcon icon={faEnvelope} className='iconPerfil' /> {usuario.email}
                                    </Anchor>


                                    {usuario.linkedin ? (
                                        <Anchor to={`${usuario.linkedin}`} target='blank'>
                                            <i class='fa fa-linkedin' ></i> {usuario.linkedin}
                                        </Anchor>
                                    ) : (
                                        <>
                                        </>
                                    )}

                                    {usuario.instagram ? (
                                        <Anchor to={`${usuario.instagram}`} target='blank'>
                                            <i class='fa fa-instagram' ></i> {usuario.instagram}
                                        </Anchor>
                                    ) : (
                                        <>
                                        </>
                                    )}
                                    {usuario.facebook ? (
                                        <Anchor to={`${usuario.facebook}`} target='blank'>
                                            <i class='fa fa-facebook'></i>  {usuario.facebook}
                                        </Anchor>
                                    ) : (
                                        <>
                                        </>
                                    )}

                                    {usuario.web ? (
                                        <Anchor to={`${usuario.web}`} target='blank'>
                                            <FontAwesomeIcon icon={faLink} className='iconPerfil' /> {usuario.web}
                                        </Anchor>
                                    ) : (
                                        <>
                                        </>
                                    )}

                                    {usuario.telefono ? (
                                        <Anchor to={`tel:${usuario.telefono}`}>
                                            <i class='fa fa-whatsapp'></i>  {usuario.telefono}
                                        </Anchor>
                                    ) : (
                                        <>
                                        </>
                                    )}



                                </div>
                                <div className='presentacionContain'>
                                    <h3>Acerca de Mi</h3>


                                    {usuario.presentacion ? (
                                        <p>{usuario.presentacion}</p>
                                    ) : (
                                        <>
                                            <p>No tiene presentacion</p>
                                        </>
                                    )}
                                    <h3>Experiencia laboral</h3>

                                    {usuario.experiencia ? (
                                        <p>{usuario.experiencia}</p>
                                    ) : (
                                        <>
                                            <p>No tiene experiencia</p>
                                        </>
                                    )}
                                </div>



                            </div>
                            <div className='sectionPublic' style={{ display: selectedSection === 'public' ? 'block' : 'none' }}>

                            </div>

                            {modalVisible && (

                                <div className='modalEdit'>
                                    <div className='modalContain'>
                                        <button onClick={toggleComponent} className='showBtns'>

                                            <div className='deFlex'>
                                                <button onClick={() => handleButtonClick('datosPersonales')} className={activeButton === 'datosPersonales' ? 'activebtn' : ''}>
                                                    Datos Personales
                                                </button>
                                                <button onClick={() => handleButtonClick('editarImagen')} className={activeButton === 'editarImagen' ? 'activebtn' : ''}>
                                                    Editar Imagen
                                                </button>
                                            </div>
                                            <span onClick={closeModal} >X</span>
                                        </button>

                                        {showBtn ?
                                            <>
                                                <fieldset>
                                                    <legend> Nombre</legend>
                                                    <input
                                                        type="text"
                                                        value={nuevoNombre !== '' ? nuevoNombre : usuario.nombre}

                                                        onChange={(e) => setNuevoNombre(e.target.value)}
                                                    />
                                                </fieldset>
                                                <fieldset>
                                                    <legend>Rol</legend>
                                                    <select
                                                        value={nuevoRol !== '' ? nuevoRol : usuario.rol}
                                                        onChange={(e) => setNuevoRol(e.target.value)}
                                                    >
                                                        <option value="empresa">Empresa</option>
                                                        <option value="usuario">Usuario</option>
                                                    </select>
                                                </fieldset>

                                                <fieldset>
                                                    <legend>Perfil</legend>
                                                    <input
                                                        type="text"
                                                        value={nuevoPerfil !== '' ? nuevoPerfil : usuario.perfil}
                                                        onChange={(e) => setNuevoRolPerfil(e.target.value)}
                                                    />
                                                </fieldset>
                                                <fieldset>
                                                    <legend>Presentacion</legend>

                                                    <textarea name="" id="" cols="30" rows="10" onChange={(e) => setNuevoPresentacion(e.target.value)}>
                                                        {nuevoPresentacion !== '' ? nuevoPresentacion : usuario.presentacion}

                                                    </textarea>
                                                </fieldset>

                                                <fieldset>
                                                    <legend>Experiencia</legend>

                                                    <textarea name="" id="" cols="30" rows="10" onChange={(e) => setNuevoExperiencia(e.target.value)}>
                                                        {nuevoExperiencia !== '' ? nuevoExperiencia : usuario.experiencia}

                                                    </textarea>
                                                </fieldset>


                                                <fieldset>
                                                    <legend> Fecha de Nacimiento</legend>
                                                    <DatePicker
                                                        selected={nuevoFNacimiento}
                                                        onChange={(date) => setNuevoFNacimiento(date)}
                                                        dateFormat="dd/MM/yyyy"
                                                    />
                                                </fieldset>




                                                <fieldset>
                                                    <legend> linkedin</legend>
                                                    <input
                                                        type="text"
                                                        value={nuevoLinkedin !== '' ? nuevoLinkedin : usuario.linkedin}
                                                        onChange={(e) => setNuevoLinkedin(e.target.value)}
                                                        placeholder='linkedin link'
                                                    />
                                                </fieldset>


                                                <fieldset>
                                                    <legend> Instagram</legend>
                                                    <input
                                                        type="text"
                                                        value={nuevoInstagram !== '' ? nuevoInstagram : usuario.instagram}
                                                        onChange={(e) => setNuevoInstagram(e.target.value)}
                                                        placeholder='instagram link'
                                                    />
                                                </fieldset>
                                                <fieldset>
                                                    <legend> Facebook</legend>
                                                    <input
                                                        type="text"
                                                        value={nuevoFacebook !== '' ? nuevoFacebook : usuario.facebook}
                                                        onChange={(e) => setNuevoFacebook(e.target.value)}
                                                        placeholder='facebook link'
                                                    />
                                                </fieldset>

                                                <fieldset>
                                                    <legend> Web</legend>
                                                    <input
                                                        type="text"
                                                        value={nuevoWeb !== '' ? nuevoWeb : usuario.web}
                                                        onChange={(e) => setNuevoWeb(e.target.value)}
                                                        placeholder='web link'
                                                    />
                                                </fieldset>
                                                <fieldset>
                                                    <legend> Telefono</legend>
                                                    <input
                                                        type="number"
                                                        value={nuevoTelefono !== '' ? nuevoTelefono : usuario.telefono}
                                                        onChange={(e) => setNuevoTelefono(e.target.value)}
                                                    />
                                                </fieldset>
                                                <button onClick={handleUpdateUsuario} className='btnLogin'>Guardar cambios</button>
                                            </>
                                            :

                                            <>

                                                <div className='previev'>
                                                    {bannerPreview ? (
                                                        <img src={bannerPreview} alt="Vista previa del banner" className='previewBanner' />
                                                    ) : (
                                                        <img src={usuario.banner} alt="banner" className='previewBanner' />
                                                    )}

                                                    {imagenPreview ? (
                                                        <img src={imagenPreview} alt="Vista previa de la imagen" className='previewImg' />
                                                    ) : (
                                                        <img src={usuario.imagen} alt="imagen" className='previewImg' />
                                                    )}
                                                </div>

                                                <fieldset>
                                                    <legend>Editar Imagen </legend>
                                                    <div>

                                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNuevaImagen, setImagenPreview)} />

                                                    </div>
                                                </fieldset>

                                                <fieldset>
                                                    <legend>Editar Banner</legend>
                                                    <div>

                                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNuevoBanner, setBannerPreview)} />

                                                    </div>
                                                </fieldset>
                                                <button onClick={handleEditarImagenBanner} className='btnLogin'>
                                                    Guardar cambios
                                                </button>
                                            </>}







                                    </div>

                                </div>
                            )}



                        </div>
                    ) : (
                        <div className='perfilInfo'>
                            <p>Usuario no encontrado</p>
                        </div>
                    )}
                </>
            )
            }

        </div >
    );
};

export default Perfil;
