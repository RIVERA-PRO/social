import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Publicacion.css';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import { Link as Anchor } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faPaperPlane, faThumbsUp, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, } from 'react-router';
import HeaderBack from '../../Components/HeaderBack/HeaderBack';
SwiperCore.use([Navigation, Pagination, Autoplay]);
export default function Publicacion() {
    let { idPublicacion } = useParams();
    const [usuario, setUsuario] = useState({});
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFullText, setShowFullText] = useState(false);
    const [expandedMap, setExpandedMap] = useState({});
    const [loadingComment, setLoadingComment] = useState(false);
    const [forceRender, setForceRender] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comentarios, setComentarios] = useState({});  // Nuevo estado para almacenar todos los comentarios
    const [nuevosComentarios, setNuevosComentarios] = useState({});  // Nuevo estado para almacenar nuevos comentarios
    const [nuevosLikes, setNuevosLikes] = useState({}); // Nuevo estado para almacenar nuevos "Me gusta"
    const [sinConexion, setSinConexion] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [nuevaDescripcion, setNuevaDescripcion] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSection, setSelectedSection] = useState('descripcion'); // Estado para controlar la sección seleccionada
    const navigate = useNavigate();
    const handleSectionChange = (section) => {
        setSelectedSection(section);
    };
    const swiperRef = useRef(null);

    const handleOpenModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
        setShowModal(false);
    };
    const handleOpenModal2 = (post) => {
        setSelectedPost(post);
        setShowModal2(true);
    };

    const handleCloseModal2 = () => {
        setSelectedPost(null);
        setShowModal2(false);
    };

    const handleOpenModal3 = (post) => {
        setSelectedPost(post);
        setShowModal3(!showModal3);
    };
    const openModal = () => {
        setModalVisible(true);
    };


    const closeModal = () => {
        setModalVisible(false);
    };



    useEffect(() => {
        // Obtener información del usuario
        fetch('/infoUserApi.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsuario(data);
                setLoading(false);
                console.log(data);
            })
            .catch(error => {
                console.error('Error al obtener datos del usuario:', error);
                setLoading(false);
            });

        // Obtener multas del usuario
        fetch('https://www.faugetdigital.shop/publicacionesGet.php')
            .then(response => response.json())
            .then(data => {
                const publicacionesEncontrados = data.publicaciones.filter(item => {
                    return item.idPublicacion === parseInt(idPublicacion, 10);
                });
                setPublicaciones(publicacionesEncontrados);
                setComentarios(data.comentarios);
                console.log(data.publicaciones);
                console.log(publicacionesEncontrados)
                console.log(data.comentarios);
            })
            .catch(error => {
                console.error('Error al obtener multas del usuario:', error);
            });
    }, [usuario?.idUsuario, forceRender]);

    const formatTimeDifference = (createdAt) => {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const timeDiff = now - createdDate;
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

        if (hoursDiff < 1) {
            return "Hace menos de una hora";
        } else if (hoursDiff < 24) {
            return `Hace ${hoursDiff} horas`;
        } else if (hoursDiff < 48) {
            return "Ayer";
        } else {
            const daysDiff = Math.floor(hoursDiff / 24);
            return `Hace ${daysDiff} días`;
        }
    };
    const handleToggleExpand = (publicacionId) => {
        setExpandedMap((prevMap) => ({
            ...prevMap,
            [publicacionId]: !prevMap[publicacionId],
        }));
    };

    const handleCrearComentario = (idPublicacion) => {
        // Enviar la solicitud para crear un comentario
        fetch('https://www.faugetdigital.shop/publicacionesGet.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comentario: nuevosComentarios[idPublicacion],
                idUsuario: usuario.idUsuario,
                idPublicacion: idPublicacion,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Actualizar la lista de comentarios después de crear el comentario
                setPublicaciones(prevPublicaciones => {
                    const updatedPublicaciones = prevPublicaciones.map(pub => {
                        if (pub.idPublicacion === idPublicacion) {
                            return {
                                ...pub,
                                comentarios: [...pub.comentarios, data.comentario],
                            };
                        }
                        return pub;
                    });
                    return updatedPublicaciones;
                });

                // Actualizar el estado local de comentarios en el modal
                setSelectedPost(prevSelectedPost => {
                    if (prevSelectedPost && prevSelectedPost.idPublicacion === idPublicacion) {
                        return {
                            ...prevSelectedPost,
                            comentarios: [...prevSelectedPost.comentarios, data.comentario],
                        };
                    }
                    return prevSelectedPost;
                });

                // Limpiar el área de comentario después de crearlo
                setNuevosComentarios(prevState => ({
                    ...prevState,
                    [idPublicacion]: '',
                }));

                // Forzar una nueva renderización del componente
                setForceRender(prevState => !prevState);
            })
            .catch(error => {
                console.error('Error al crear el comentario:', error);
            });
    };

    const handleCrearLike = (idPublicacion) => {
        // Enviar la solicitud para crear un "Me gusta"
        fetch('https://www.faugetdigital.shop/publicacionesGet.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                meGusta: 1, // Puedes ajustar el valor según tus necesidades
                idUsuario: usuario.idUsuario,
                idPublicacion: idPublicacion,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Actualizar la lista de "Me gusta" después de crear uno nuevo
                setPublicaciones((prevPublicaciones) => {
                    const updatedPublicaciones = prevPublicaciones.map((pub) => {
                        if (pub.idPublicacion === idPublicacion) {
                            return {
                                ...pub,
                                likes: [...pub.likes, data.like],
                            };
                        }
                        return pub;
                    });
                    return updatedPublicaciones;
                });

                // Actualizar el estado local de "Me gusta" en el modal
                setSelectedPost((prevSelectedPost) => {
                    if (prevSelectedPost && prevSelectedPost.idPublicacion === idPublicacion) {
                        return {
                            ...prevSelectedPost,
                            likes: [...prevSelectedPost.likes, data.like],
                        };
                    }
                    return prevSelectedPost;
                });

                // Forzar una nueva renderización del componente
                setForceRender((prevState) => !prevState);
            })
            .catch((error) => {
                console.error('Error al crear el "Me gusta":', error);
                setSinConexion(true)
            });
    };

    const [imagenPreview, setImagenPreview] = useState(null);
    const [imagenPreview2, setImagenPreview2] = useState(null);
    const [imagenPreview3, setImagenPreview3] = useState(null);
    const [imagenPreview4, setImagenPreview4] = useState(null);


    const handleFileChange = (event, setFile, setPreview) => {
        const file = event.target.files[0];

        if (file) {
            // Crear una URL de objeto para la imagen seleccionada
            const previewURL = URL.createObjectURL(file);
            setFile(file);
            setPreview(previewURL);
        }
    };
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [nuevaImagen2, setNuevaImagen2] = useState(null);
    const [nuevaImagen3, setNuevaImagen3] = useState(null);
    const [nuevaImagen4, setNuevaImagen4] = useState(null);

    const handleEditarImagenBanner = () => {
        const formData = new FormData();
        formData.append('idPublicacion', idPublicacion);
        formData.append('updateAction', 'update'); // Campo adicional para indicar que es una actualización

        if (nuevaImagen) {
            formData.append('imagen1', nuevaImagen);
        }
        if (nuevaImagen2) {
            formData.append('imagen2', nuevaImagen2);
        }
        if (nuevaImagen3) {
            formData.append('imagen3', nuevaImagen3);
        }
        if (nuevaImagen4) {
            formData.append('imagen4', nuevaImagen4);
        }



        fetch(`https://www.faugetdigital.shop/editarImagenesPublicacion.php`, {
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
                    setMensaje(`Error al editar la imagen: ${data.error}`);
                    toast.error(data.error);
                } else {
                    setMensaje('Imagen editada correctamente');
                    toast.success(data.mensaje);
                    window.location.reload();
                }
            })
            .catch(error => {
                setMensaje(`Error al editar la imagen: ${error.message}`);
                toast.error(error.message);
            });
    };


    const handleUpdateText = () => {
        const payload = {
            nuevaDescripcion: nuevaDescripcion !== '' ? nuevaDescripcion : publicaciones[0]?.descripcion,
        };

        fetch(`https://www.faugetdigital.shop/editarTextPublicacion.php?idPublicacion=${idPublicacion}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setMensaje(`Error: ${data.error}`);
                    toast.error(data.error);
                } else {
                    setMensaje(data.mensaje);
                    toast.success(data.mensaje);
                    window.location.reload();
                }
            })
            .catch(error => {
                setMensaje(`Error al actualizar la descripción: ${error.message}`);
                toast.error(error.message);
            });
    };

    const handleEliminarPublicacion = () => {
        fetch(`https://www.faugetdigital.shop/eliminarPublicacion.php?idPublicacion=${idPublicacion}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setMensaje(`Error: ${data.error}`);
                    toast.error(data.error);
                } else {
                    setMensaje(data.mensaje);
                    toast.success(data.mensaje);

                    setTimeout(() => {
                        navigate(`/`);
                    }, 1000);
                }
            })
            .catch(error => {
                setMensaje(`Error al eliminar la publicación: ${error.message}`);
                toast.error(error.message);
            });
    };


    return (
        <>
            <div className='bgHeaderBack'>
                <HeaderBack title="Publicacion" />
            </div>
            <div className='PublicacionDetail'>

                <ToastContainer />
                <div className='PublicacionContainerDetail'>
                    {sinConexion ? (
                        <div className='perfilInfo'>
                            no hay wifi
                        </div>
                    ) : (

                        <>
                            {loading ? (
                                <p>
                                    Cargando...
                                </p>

                            ) : publicaciones.map(item => (item.idPublicacion === idPublicacion)) ? (
                                <>
                                    {
                                        publicaciones.map(item => (


                                            <div className='cardPublicacion'>
                                                <div className='userPhoto'>

                                                    <Anchor to={`/usuario/${item?.idUsuario}/${item?.nombreUsuario.replace(/\s+/g, '_')}`} key={usuario?.idUsuario} >
                                                        <img src={item?.imagenUsuario} alt="imagen" />
                                                    </Anchor>
                                                    <hr />
                                                </div>
                                                <div>
                                                    <div className='deFlexNameBtn'>
                                                        <Anchor to={`/usuario/${item.idUsuario}/${item?.nombreUsuario.replace(/\s+/g, '_')}`} key={usuario?.idUsuario} className='userName'>
                                                            <strong>{item?.nombreUsuario}</strong>
                                                            <h4>{item?.perfilUsuario}</h4>
                                                            <h5>{formatTimeDifference(item.createdAt)}</h5>

                                                        </Anchor>

                                                        {usuario?.idUsuario === item?.idUsuario ? (
                                                            <button onClick={() => handleOpenModal3(item)} className='moreBtn'>
                                                                ...
                                                                {selectedPost && showModal3 && (
                                                                    <div className='modalMore'>
                                                                        <button onClick={handleEliminarPublicacion} >
                                                                            Eliminar
                                                                        </button>
                                                                        <button onClick={openModal} >
                                                                            Editar
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <>

                                                            </>
                                                        )}
                                                    </div>

                                                    <h5 className='descripcion'>
                                                        {expandedMap[item?.idPublicacion]
                                                            ? item?.descripcion
                                                            : item?.descripcion.length > 100
                                                                ? `${item?.descripcion?.slice(0, 100)}...`
                                                                : item?.descripcion}

                                                        {item?.descripcion && item.descripcion.length > 100 && (
                                                            <button
                                                                onClick={() => handleToggleExpand(item.idPublicacion)}
                                                                className='verMasButton'
                                                            >
                                                                {expandedMap[item.idPublicacion] ? 'Ver menos' : 'Ver más'}
                                                            </button>
                                                        )}
                                                    </h5>
                                                    <Swiper

                                                        effect='coverflow'
                                                        grabCursor={true}
                                                        loop={true}
                                                        slidesPerView='auto'
                                                        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}

                                                        pagination={{ clickable: true }}
                                                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                                                        id='swiper_container_scroll'
                                                    >


                                                        {item.imagen1 ? (
                                                            <SwiperSlide id='SwiperSlide-scroll'  >
                                                                <img src={item.imagen1} alt="imagen" />
                                                            </SwiperSlide>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                        {item.imagen2 ? (
                                                            <SwiperSlide id='SwiperSlide-scroll'  >
                                                                <img src={item.imagen2} alt="imagen" />
                                                            </SwiperSlide>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                        {item.imagen3 ? (
                                                            <SwiperSlide id='SwiperSlide-scroll'  >
                                                                <img src={item.imagen3} alt="imagen" />
                                                            </SwiperSlide>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                        {item.imagen4 ? (
                                                            <SwiperSlide id='SwiperSlide-scroll'  >
                                                                <img src={item.imagen4} alt="imagen" />
                                                            </SwiperSlide>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}

                                                    </Swiper>
                                                    <div className='imgsPublic'>
                                                        {item.imagen1 ? (

                                                            <img src={item.imagen1} alt="imagen" />

                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                        {item.imagen2 ? (

                                                            <img src={item.imagen2} alt="imagen" />

                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                        {item.imagen3 ? (

                                                            <img src={item.imagen3} alt="imagen" />

                                                        ) : (
                                                            <>
                                                            </>
                                                        )} {item.imagen4 ? (

                                                            <img src={item.imagen4} alt="imagen" />

                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                    </div>




                                                    <div className='interaciones'>
                                                        <button >
                                                            <FontAwesomeIcon onClick={() => handleCrearLike(item.idPublicacion)} icon={faThumbsUp} className={`iconIntercacion ${item?.likes?.some(like => like?.idUsuario === usuario.idUsuario,) ? 'liked' : ''}`} />
                                                        </button>
                                                        <button onClick={() => handleOpenModal(item)}>
                                                            <span>  {item.comentarios.length}</span>
                                                            <FontAwesomeIcon icon={faComment} className='iconIntercacion' />
                                                        </button>
                                                        <button onClick={() => handleOpenModal2(item)}>
                                                            <span >   {item?.likes?.length} </span>
                                                            <span> Me gusta</span>
                                                        </button>
                                                    </div>

                                                    <div className='formComent'>
                                                        <img src={usuario.imagen} alt='imagen' />
                                                        <textarea
                                                            placeholder='Comentar...'
                                                            value={nuevosComentarios[item?.idPublicacion] || ''}
                                                            onChange={(e) =>
                                                                setNuevosComentarios((prevState) => ({
                                                                    ...prevState,
                                                                    [item?.idPublicacion]: e.target.value,
                                                                }))
                                                            }
                                                            required
                                                        />
                                                        <button onClick={() => handleCrearComentario(item?.idPublicacion)}>
                                                            <FontAwesomeIcon icon={faPaperPlane} />
                                                        </button>

                                                    </div>



                                                    {selectedPost && showModal && (
                                                        <div className='modalBg'>
                                                            <div className='modalContenido'>
                                                                <div className='deFlexback'>
                                                                    <button onClick={handleCloseModal}>X</button>
                                                                    <h5>{selectedPost.comentarios.length}    <FontAwesomeIcon icon={faComment} /></h5>
                                                                </div>
                                                                <div className='comentariosModal'>
                                                                    {selectedPost?.comentarios.map((coment) => (
                                                                        <div key={coment?.idComentario} className='cardComentario'>
                                                                            <Anchor to={`usuario/${coment?.idUsuario}/${item?.nombreUsuario?.replace(/\s+/g, '_')}`} key={usuario.idUsuario} className='userPhoto'>
                                                                                <img src={coment?.imagenUsuarioComentario} alt="imagen" />
                                                                                <hr />
                                                                            </Anchor>
                                                                            <div className='comentario'>
                                                                                <Anchor to={`usuario/${coment?.idUsuario}/${item?.nombreUsuario.replace(/\s+/g, '_')}`} key={usuario.idUsuario} className='userName'>

                                                                                    <strong>{coment?.nombreUsuarioComentario}</strong>
                                                                                    <h4>{coment?.perfilUsuarioComentario}</h4>

                                                                                    <h5>{formatTimeDifference(coment?.createdAt)}</h5>
                                                                                </Anchor>
                                                                                <p>{coment?.comentario}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>



                                                            </div>
                                                        </div>
                                                    )}


                                                    {modalVisible && (

                                                        <div className='modalEdit'>
                                                            <div className='modalContain'>
                                                                <div className='showBtns'>
                                                                    <FontAwesomeIcon icon={faArrowLeft} onClick={closeModal} />
                                                                    <div className='deFlex'>
                                                                        <button
                                                                            className={selectedSection === 'descripcion' ? 'selected' : ''}
                                                                            onClick={() => handleSectionChange('descripcion')}
                                                                        >
                                                                            Descripcion
                                                                        </button>
                                                                        <button
                                                                            className={selectedSection === 'imaganes' ? 'selected' : ''}
                                                                            onClick={() => handleSectionChange('imaganes')}
                                                                        >
                                                                            Imaganes
                                                                        </button>
                                                                    </div>


                                                                </div>


                                                                <div className='sectiontext' style={{ display: selectedSection === 'descripcion' ? 'flex' : 'none' }}>
                                                                    <fieldset>
                                                                        <legend>Descripcion</legend>
                                                                        <textarea
                                                                            type="text"
                                                                            value={nuevaDescripcion !== '' ? nuevaDescripcion : item.descripcion}
                                                                            onChange={(e) => setNuevaDescripcion(e.target.value)}
                                                                        />
                                                                    </fieldset>
                                                                    <button onClick={handleUpdateText} className='btnLogin'>Guardar cambios</button>

                                                                </div>


                                                                <div className='sectionImg' style={{ display: selectedSection === 'imaganes' ? 'flex' : 'none' }}>
                                                                    <div className='previevPublicacion'>


                                                                        {imagenPreview ? (
                                                                            <img src={imagenPreview} alt="Vista previa de la imagen" />
                                                                        ) : (
                                                                            <img src={item.imagen1} alt="imagen" />
                                                                        )}

                                                                        {imagenPreview2 ? (
                                                                            <img src={imagenPreview2} alt="Vista previa de la imagen" />
                                                                        ) : (
                                                                            <img src={item.imagen2} alt="imagen" />
                                                                        )}
                                                                        {imagenPreview3 ? (
                                                                            <img src={imagenPreview3} alt="Vista previa de la imagen" />
                                                                        ) : (
                                                                            <img src={item.imagen3} alt="imagen" />
                                                                        )}
                                                                        {imagenPreview4 ? (
                                                                            <img src={imagenPreview4} alt="Vista previa de la imagen" />
                                                                        ) : (
                                                                            <img src={item.imagen4} alt="imagen" />
                                                                        )}
                                                                    </div>
                                                                    <fieldset>
                                                                        <legend>Editar Imagen1 </legend>
                                                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNuevaImagen, setImagenPreview)} />
                                                                    </fieldset>
                                                                    <fieldset>
                                                                        <legend>Editar Imagen2 </legend>
                                                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNuevaImagen2, setImagenPreview2)} />
                                                                    </fieldset>
                                                                    <fieldset>
                                                                        <legend>Editar Imagen3 </legend>
                                                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNuevaImagen3, setImagenPreview3)} />
                                                                    </fieldset>
                                                                    <fieldset>
                                                                        <legend>Editar Imagen4 </legend>
                                                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNuevaImagen4, setImagenPreview4)} />
                                                                    </fieldset>

                                                                    <button onClick={handleEditarImagenBanner} className='btnLogin'>
                                                                        Guardar cambios
                                                                    </button>
                                                                </div>







                                                            </div>

                                                        </div>
                                                    )}

                                                    {selectedPost && showModal2 && (
                                                        <div className='modalBg'>
                                                            <div className='modalContenido'>
                                                                <div className='deFlexback'>
                                                                    <button onClick={handleCloseModal2}>X</button>
                                                                    <h5>{selectedPost.likes.length}    <FontAwesomeIcon icon={faThumbsUp} /></h5>
                                                                </div>
                                                                <div className='comentariosModal'>
                                                                    {selectedPost?.likes.map((coment) => (
                                                                        <div key={coment?.idComentario} className='cardMegusta'>
                                                                            <Anchor to={`usuario/${coment?.idUsuario}/${item?.nombreUsuario?.replace(/\s+/g, '_')}`} key={usuario.idUsuario} className='userPhoto'>
                                                                                <img src={coment?.imagenUsuarioLike} alt="imagen" />
                                                                                <hr />
                                                                            </Anchor>
                                                                            <div>
                                                                                <Anchor to={`usuario/${coment?.idUsuario}/${item?.nombreUsuario.replace(/\s+/g, '_')}`} key={usuario.idUsuario} className='userName'>
                                                                                    <strong>{coment?.nombreUsuarioLike}</strong>
                                                                                    <h5>{formatTimeDifference(coment?.createdAt)}</h5>
                                                                                </Anchor>

                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>



                                                            </div>
                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                        ))
                                    }


                                </>
                            ) : (
                                <div className='PublicacionContainer'>
                                    <p>Publicacion no encontrada</p>
                                </div>
                            )}
                        </>
                    )}


                </div>
            </div>
        </>
    )
}
