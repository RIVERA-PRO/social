import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function UsuariosData() {
    const [usuarios, setUsuarios] = useState([]);
    const [filtroIdUsuario, setFiltroIdUsuario] = useState('');
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroRol, setFiltroRol] = useState('');
    const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
    const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
    const [filtroEmail, setFiltroEmail] = useState('');
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
            })
            .catch(error => console.error('Error al cargar usuarios:', error));
    };

    const eliminarUsuario = (idUsuario) => {
        // Reemplaza el window.confirm con SweetAlert2
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://www.faugetdigital.shop/usuariosApi.php?idUsuario=${idUsuario}`, {
                    method: 'DELETE',
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.fire(
                            '¡Eliminado!',
                            data.mensaje,
                            'success'
                        );
                        cargarUsuarios();
                    })
                    .catch(error => {
                        console.error('Error al eliminar usuario:', error)
                        toast.success(error);
                    });
            }
        });
    };

    const editarUsuario = async (idUsuario, rolActual, tipoEdicion) => {
        const { value: file } = await Swal.fire({
            title: `Selecciona una ${tipoEdicion === 'imagen' ? 'imagen' : 'banner'}`,
            input: 'file',
            inputAttributes: {
                accept: 'image/*',
                'aria-label': `Sube una ${tipoEdicion === 'imagen' ? 'imagen' : 'banner'}`,
            }
        });

        if (file) {
            const formData = new FormData();
            formData.append(tipoEdicion, file);

            fetch(`https://www.faugetdigital.shop/usuariosApi.php?idUsuario=${idUsuario}`, {
                method: 'PUT',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    toast.success(data.mensaje);
                    cargarUsuarios();
                })
                .catch(error => {
                    console.error(`Error al editar la ${tipoEdicion === 'imagen' ? 'imagen' : 'banner'} del usuario:`, error)
                    toast.success(error);
                });
        }
    };


    const usuariosFiltrados = usuarios.filter(usuario => {
        const idUsuarioMatch = usuario.idUsuario.toString().includes(filtroIdUsuario);
        const nombreMatch = usuario.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const rolMatch = !filtroRol || usuario.rol.includes(filtroRol);
        const fechaDesdeMatch = !filtroFechaDesde || new Date(usuario.createdAt) >= new Date(filtroFechaDesde);
        const fechaHastaMatch = !filtroFechaHasta || new Date(usuario.createdAt) <= new Date(filtroFechaHasta);
        const emailMatch = usuario.email.toLowerCase().includes(filtroEmail.toLowerCase());

        return idUsuarioMatch && nombreMatch && rolMatch && fechaDesdeMatch && fechaHastaMatch && emailMatch;
    });

    return (
        <div>
            <div className='deFlexBtns'>



            </div>

            <div className='filtrosContain'>
                <div className='inputsColumn'>
                    <label>ID Usuario:</label>
                    <input type="text" value={filtroIdUsuario} onChange={(e) => setFiltroIdUsuario(e.target.value)} placeholder='ID Usuario' />
                </div>

                <div className='inputsColumn'>
                    <label>Nombre:</label>
                    <input type="text" value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} placeholder='Nombre' />
                </div>
                <div className='inputsColumn'>
                    <label>Email:</label>
                    <input type="text" value={filtroEmail} onChange={(e) => setFiltroEmail(e.target.value)} placeholder='Email' />
                </div>
                <div className='inputsColumn'>
                    <label>Rol:</label>
                    <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="usuario">Usuario</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className='inputsColumn'>
                    <label>Fecha Desde:</label>
                    <input type="date" value={filtroFechaDesde} onChange={(e) => setFiltroFechaDesde(e.target.value)} />
                </div>

                <div className='inputsColumn'>
                    <label>Fecha Hasta:</label>
                    <input type="date" value={filtroFechaHasta} onChange={(e) => setFiltroFechaHasta(e.target.value)} />
                </div>


            </div>
            <div className='table-container'>
                <ToastContainer />

                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID Usuario</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Fecha Creación</th>
                            <th>imagen</th>
                            <th>banner</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map(usuario => (
                            <tr key={usuario.idUsuario}>
                                <td>{usuario.idUsuario}</td>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td style={{
                                    color: usuario?.rol === 'usuario' ? '#DAA520' : usuario?.rol === 'admin' ? 'green' : 'red',
                                }}>{`${usuario?.rol}`}</td>
                                <td>{usuario.createdAt}</td>
                                <td>
                                    <img src={usuario.imagen} alt="imagen" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                    <button className='editar' onClick={() => editarUsuario(usuario.idUsuario, usuario.rol, 'imagen')}>
                                        Editar Imagen
                                    </button>



                                </td>
                                <td>
                                    <img src={usuario.banner} alt="banner" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                    <button className='editar' onClick={() => editarUsuario(usuario.idUsuario, usuario.rol, 'banner')}>
                                        Editar Banner
                                    </button>
                                </td>

                                <td>
                                    <button className='eliminar' onClick={() => eliminarUsuario(usuario.idUsuario)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};
