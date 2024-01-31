import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import './AllPublicaciones.css';
import { Link as Anchor } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faPaperPlane, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

SwiperCore.use([Navigation, Pagination, Autoplay]);

const AllPublicaciones = () => {

    const [usuario, setUsuario] = useState({});
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFullText, setShowFullText] = useState(false);
    const [expandedMap, setExpandedMap] = useState({});
    const [loadingComment, setLoadingComment] = useState(false);
    const [forceRender, setForceRender] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comentarios, setComentarios] = useState({});
    const [nuevosComentarios, setNuevosComentarios] = useState({});
    const [nuevosLikes, setNuevosLikes] = useState({});
    const [modalStates, setModalStates] = useState({});
    const [selectedPostId, setSelectedPostId] = useState(null);

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
                setPublicaciones(data.publicaciones);
                setComentarios(data.comentarios);
                console.log(data.publicaciones);
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
            });
    };






    return (
        <div className='PublicacionContainer'>

            {loading ? (
                <p>
                    Cargando...
                </p>

            ) : (
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


                                        <Anchor to={`/publicacion/${item?.idPublicacion}`} key={usuario.idUsuario} className='moreBtn'>
                                            ...
                                        </Anchor>

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
            )}

        </div>
    );
}

export default AllPublicaciones;
