import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import './AllProductos.css';
import { Link as Anchor } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function AllProductos() {
    const [usuario, setUsuario] = useState({});
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tituloFilter, setTituloFilter] = useState('');
    const [categoriaFilters, setCategoriaFilters] = useState([]);
    const [estadoFilters, setEstadoFilters] = useState([]);
    const swiperRef = useRef(null);

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

        // Obtener productos
        fetch('https://www.faugetdigital.shop/productosGet.php')
            .then(response => response.json())
            .then(data => {
                setProductos(data.productos);

                console.log(data);

            })
            .catch(error => {
                console.error('Error al obtener productos :', error);
            });
    }, []);
    const filterProductos = () => {
        let filteredProductos = productos;

        // Filtrar por título
        if (tituloFilter.trim() !== '') {
            filteredProductos = filteredProductos.filter(item =>
                item.titulo.toLowerCase().includes(tituloFilter.toLowerCase())
            );
        }

        // Filtrar por categoría
        if (categoriaFilters.length > 0) {
            filteredProductos = filteredProductos.filter(item =>
                categoriaFilters.includes(item.categoria)
            );
        }



        return filteredProductos;
    };

    const handleCategoriaChange = (value) => {
        const updatedFilters = categoriaFilters.includes(value)
            ? categoriaFilters.filter(item => item !== value)
            : [...categoriaFilters, value];

        setCategoriaFilters(updatedFilters);
    };


    return (
        <div className='ProdcutosContain'>
            {loading ? (
                <p>
                    Cargando...
                </p>

            ) : (
                <>

                    <div className='filtros'>
                        <fieldset>
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input
                                type='text'
                                placeholder='Buscar...'
                                value={tituloFilter}
                                onChange={(e) => setTituloFilter(e.target.value)}
                            />
                        </fieldset>
                        <div className='category'>

                            {['electronicos', 'ropa', 'hogar', 'juguetes', 'libros', 'alimentacion', 'salud', 'deporte', 'tecnologia', 'muebles', 'jardineria', 'vehiculos', 'musica'].map((categoria) => (
                                <label key={categoria} className={categoriaFilters.includes(categoria) ? 'selectedInput' : ''}>
                                    <input
                                        type='checkbox'
                                        value={categoria}
                                        checked={categoriaFilters.includes(categoria)}
                                        onChange={() => handleCategoriaChange(categoria)}
                                    />
                                    {categoria}
                                </label>
                            ))}
                        </div>

                    </div>

                    <div className='productosGrid'>
                        {filterProductos().length > 0 ? (
                            filterProductos().map(item => (
                                <Anchor to={`/marketpleace/producto/${item.idProducto}`} className='cardProducto'>
                                    <Swiper

                                        effect='coverflow'
                                        grabCursor={true}
                                        loop={true}
                                        slidesPerView='auto'
                                        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}

                                        pagination={{ clickable: true }}
                                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                                        id='swiper_container_scroll_productos'

                                    >


                                        {item.imagen1 ? (
                                            <SwiperSlide id='SwiperSlide-scroll_producto'  >
                                                <img src={item.imagen1} alt="imagen" />
                                            </SwiperSlide>
                                        ) : (
                                            <>
                                            </>
                                        )}
                                        {item.imagen2 ? (
                                            <SwiperSlide id='SwiperSlide-scroll_producto'  >
                                                <img src={item.imagen2} alt="imagen" />
                                            </SwiperSlide>
                                        ) : (
                                            <>
                                            </>
                                        )}
                                        {item.imagen3 ? (
                                            <SwiperSlide id='SwiperSlide-scroll_producto'  >
                                                <img src={item.imagen3} alt="imagen" />
                                            </SwiperSlide>
                                        ) : (
                                            <>
                                            </>
                                        )}
                                        {item.imagen4 ? (
                                            <SwiperSlide id='SwiperSlide-scroll_producto'  >
                                                <img src={item.imagen4} alt="imagen" />
                                            </SwiperSlide>
                                        ) : (
                                            <>
                                            </>
                                        )}

                                    </Swiper>
                                    <div className='productoText'>
                                        <h4>{item.titulo}</h4>
                                        <h5>{item.descripcion}</h5>
                                        <div className='deFLexUser'>
                                            <img src={item.imagenUsuario} alt="imagen" />
                                            <h6>{item.nombreUsuario}</h6>
                                        </div>
                                    </div>
                                </Anchor>
                            ))
                        ) : (
                            <p>No hay resultados</p>
                        )}

                    </div>

                </>
            )}

        </div>
    )
}
