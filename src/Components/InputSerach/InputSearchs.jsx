import React, { useState, useEffect } from "react";
import "./InputSearchs.css";

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons'; // Importa el icono de búsqueda

export default function InputSearchs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        // Obtener datos de la base de datos utilizando PHP
        fetch('/catalogoApi.php')  // Update the URL to your PHP endpoint
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProductos(data);
            })
            .catch(error => {
                console.error('Error al obtener los productos:', error);
            });
    }, []);

    const handleButtonClick = (producto) => {
        console.log(producto);
    };

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);

        const results = productos.filter((producto) => {
            return (
                producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredProductos(results);
        setShowResults(searchTerm !== "");
        setNoResults(searchTerm !== "" && results.length === 0);
    };

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="fondo-input">
            <div className="inpuTconMain" onClick={openModal}>
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <div className="input">
                    <span>Buscar...</span>

                </div>
            </div>
            {modalOpen && (
                <div className="modalSearch">
                    <div className="modalSearch-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <div className="inputSearch" onClick={openModal}>
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="input"
                            />
                            {showResults && (
                                <div className="modal">
                                    {filteredProductos.map((producto) => (
                                        <div key={producto.id}>
                                            <button className="btn-music" onClick={() => handleButtonClick(producto)}></button>
                                            <Link to={`/producto/${producto.id}/${producto.nombre.replace(/\s+/g, '-')}`} onClick={closeModal}>
                                                <FontAwesomeIcon icon={faSignOutAlt} />
                                                <p>{producto.nombre} - {producto.categoria}</p>
                                            </Link>
                                        </div>
                                    ))}
                                    {noResults && <p>No se encontraron resultados.</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
