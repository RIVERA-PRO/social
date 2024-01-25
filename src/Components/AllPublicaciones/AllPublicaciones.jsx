import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AllPublicaciones.css'

import { Link as Anchor, useNavigate, useLocation } from "react-router-dom";

const AllPublicaciones = () => {
    const { idUsuario, nombre } = useParams();
    const [usuario, setUsuario] = useState({});
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);




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
                console.log(data.publicaciones)

            })
            .catch(error => {
                console.error('Error al obtener multas del usuario:', error);
            });
    }, [usuario?.idUsuario]);



    return (
        <div className='PublicacionContainer'>

            {loading ? (
                <p>
                    Cargando...
                </p>

            ) : (
                <div className='publicacion'>

                    {
                        publicaciones.map(item => (


                            <div className='cardPublicacion'>
                                <Anchor to={`usuario/${item.idUsuario}/${item?.nombreUsuario.replace(/\s+/g, '_')}`} key={usuario.idUsuario} className='user'>
                                    <img src={item.imagenUsuario} alt="imagen" />
                                    <div>
                                        <strong>{item.nombreUsuario.slice(0, 20)}</strong>
                                        <h5>{item.createdAt}</h5>
                                    </div>
                                </Anchor>
                                <p>{item.descripcion}</p>
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
                                    )}
                                    {item.imagen4 ? (
                                        <img src={item.imagen4} alt="imagen" />
                                    ) : (
                                        <>

                                        </>
                                    )}


                                </div>
                            </div>
                        ))
                    }

                </div>
            )}

        </div>
    );
}

export default AllPublicaciones;
