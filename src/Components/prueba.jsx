import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import './AllPublicaciones.css';
import { Link as Anchor } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

SwiperCore.use([Navigation, Pagination, Autoplay]);

const AllPublicaciones = () => {
    const { idUsuario, nombre } = useParams();
    const [usuario, setUsuario] = useState({});
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFullText, setShowFullText] = useState(false);
    const [expandedMap, setExpandedMap] = useState({});
    const [loadingComment, setLoadingComment] = useState(false);
    const [forceRender, setForceRender] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comentarios, setComentarios] = useState({});  // Nuevo estado para almacenar todos los comentarios
    const [nuevosComentarios, setNuevosComentarios] = useState({});  // Nuevo estado para almacenar nuevos comentarios

    const swiperRef = useRef(null);

    const handleOpenModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
        setShowModal(false);
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
    }, [usuario?.idUsuario]);

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
                idUsuario: 17,
                idPublicacion: idPublicacion,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Actualizar el estado local de comentarios
                setComentarios(prevComentarios => ({
                    ...prevComentarios,
                    [idPublicacion]: [...(prevComentarios?.[idPublicacion] || []), data.comentario],
                }));

                // Limpiar el área de comentario después de crearlo
                setNuevosComentarios(prevState => ({
                    ...prevState,
                    [idPublicacion]: '',
                }));
            })
            .catch(error => {
                console.error('Error al crear el comentario:', error);
            });
    };


    // ... (resto de tu código)





    // Agrega un estado para forzar una nueva renderización


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
                                <Anchor to={`usuario/${item?.idUsuario}/${item?.nombreUsuario.replace(/\s+/g, '_')}`} key={usuario?.idUsuario} className='userPhoto'>
                                    <img src={item?.imagenUsuario} alt="imagen" />
                                    <hr />
                                </Anchor>
                                <div>
                                    <Anchor to={`usuario/${item.idUsuario}/${item?.nombreUsuario.replace(/\s+/g, '_')}`} key={usuario?.idUsuario} className='userName'>
                                        <div className='deFlexText'>
                                            <strong>{item?.nombreUsuario}</strong>
                                            <h4>{item?.perfilUsuario}</h4>
                                        </div>
                                        <h5>{formatTimeDifference(item.createdAt)}</h5>

                                    </Anchor>

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


                                    <div className='formComent'>
                                        <img src='https://www.faugetdigital.shop/imagenes_usuarios/IMG_20221024_205444_133.jpg' alt='imagen' />
                                        <textarea
                                            placeholder='Comentar...'
                                            value={nuevosComentarios[item?.idPublicacion] || ''}
                                            onChange={(e) =>
                                                setNuevosComentarios((prevState) => ({
                                                    ...prevState,
                                                    [item?.idPublicacion]: e.target.value,
                                                }))
                                            }
                                        />
                                        <button onClick={() => handleCrearComentario(item?.idPublicacion)}>
                                            <FontAwesomeIcon icon={faPaperPlane} className='icon2' />
                                        </button>

                                        <button onClick={() => handleOpenModal(item)}>Comentar</button>
                                    </div>



                                    {selectedPost && showModal && (
                                        <div className='modalBg'>
                                            <div className='modalContenido'>
                                                <div className='deFlexback'>
                                                    <button onClick={handleCloseModal}>X</button>
                                                    <h5>{selectedPost.comentarios.length} comentarios</h5>
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
                                                                    <div className='deFlexText'>
                                                                        <strong>{coment?.nombreUsuarioComentario}</strong>
                                                                        <h4>{coment?.perfilUsuarioComentario}</h4>
                                                                    </div>
                                                                    <h5>{formatTimeDifference(coment?.createdAt)}</h5>
                                                                </Anchor>
                                                                <p>{coment?.comentario}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className='formComent'>
                                                    <img src='https://www.faugetdigital.shop/imagenes_usuarios/IMG_20221024_205444_133.jpg' alt='imagen' />
                                                    <textarea
                                                        placeholder='Comentar...'
                                                        value={nuevosComentarios[item?.idPublicacion] || ''}
                                                        onChange={(e) =>
                                                            setNuevosComentarios((prevState) => ({
                                                                ...prevState,
                                                                [item?.idPublicacion]: e.target.value,
                                                            }))
                                                        }
                                                    />
                                                    <button onClick={() => handleCrearComentario(item?.idPublicacion)}>
                                                        <FontAwesomeIcon icon={faPaperPlane} className='icon2' />
                                                    </button>
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


{/* <div className='formComent'>
                                                    <img src='https://www.faugetdigital.shop/imagenes_usuarios/IMG_20221024_205444_133.jpg' alt="imagen" />
                                                    <textarea
                                                        placeholder='Comentar...'
                                                        value={nuevosComentarios[selectedPost?.idPublicacion] || ''}
                                                        onChange={(e) => setNuevosComentarios(prevState => ({
                                                            ...prevState,
                                                            [selectedPost?.idPublicacion]: e.target.value
                                                        }))}
                                                    />
                                                    <button onClick={() => handleCrearComentario(selectedPost?.idPublicacion)}>
                                                        <FontAwesomeIcon icon={faPaperPlane} className='icon2' />
                                                    </button>
                                                </div> */}
