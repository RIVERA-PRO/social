import React, { useEffect, useState } from 'react';
import './AllUsuarios.css'


import { Link as Anchor, useNavigate, useLocation } from "react-router-dom";
export default function AllUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sinConexion, setSinConexion] = useState(false);
    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = () => {
        fetch('https://www.faugetdigital.shop/usuariosApi.php', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setUsuarios(data.usuarios || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error)
                setSinConexion(true)
            });
    };



    return (
        <div className='AllUsuariosContain'>

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
                    ) : usuarios ? (
                        <div>
                            {
                                usuarios.map(usuario => (
                                    <Anchor to={`usuario/${usuario.idUsuario}/${usuario.nombre.replace(/\s+/g, '_')}`} key={usuario.idUsuario} className='user'>
                                        <img src={usuario.imagen} alt="imagen" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                        <div>
                                            <strong>{usuario.nombre.slice(0, 20)}</strong>
                                            <h4>{usuario.rol.slice(0, 20)}</h4>
                                        </div>
                                    </Anchor>
                                ))
                            }
                        </div>
                    ) : (
                        <div className='perfilInfo'>
                            <p>Usuario no encontrado</p>
                        </div>
                    )}
                </>
            )}



        </div>
    );
};
