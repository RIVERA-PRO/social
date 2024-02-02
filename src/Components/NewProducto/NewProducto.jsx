import React, { useState, useEffect } from 'react';
import './NewProducto.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

export default function NewProducto() {
    const [mensaje, setMensaje] = useState('');
    const [imagenPreview1, setImagenPreview1] = useState(null);
    const [imagenPreview2, setImagenPreview2] = useState(null);
    const [imagenPreview3, setImagenPreview3] = useState(null);
    const [imagenPreview4, setImagenPreview4] = useState(null);
    const [idUsuario, setIdUsuario] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [titulo, setTitulo] = useState('');

    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(true);

    const [isImage1Selected, setIsImage1Selected] = useState(false);
    const [isImage2Selected, setIsImage2Selected] = useState(false);
    const [isImage3Selected, setIsImage3Selected] = useState(false);
    const [isImage4Selected, setIsImage4Selected] = useState(false);

    const handleImagenChange = (event, setImagenPreview, setIsImageSelected) => {
        const file = event.target.files[0];

        if (file) {
            // Crear una URL de objeto para la imagen seleccionada
            const previewURL = URL.createObjectURL(file);
            setImagenPreview(previewURL);
            setIsImageSelected(true);
        }
    };

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
                setLoading(false);
                setIdUsuario(data.idUsuario);

                setDescripcion(data.descripcion);
                console.log(data);
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
                setLoading(false);
            });


    }, []);
    const crear = async () => {
        const form = document.getElementById("crearForm");
        const formData = new FormData(form);
        const resetForm = () => {
            form.reset();
            setImagenPreview1(null);
            setImagenPreview2(null);
            setImagenPreview3(null);
            setImagenPreview4(null);

            setIsImage1Selected(false);
            setIsImage2Selected(false);
            setIsImage3Selected(false);
            setIsImage4Selected(false);


        };
        setMensaje('');





        if (
            !formData.get('titulo') ||
            !formData.get('descripcion') ||
            !formData.get('categoria') ||
            !formData.get('estado') ||
            !formData.get('precio') ||
            !formData.get('imagen1') ||
            !formData.get('imagen2') ||
            !formData.get('imagen3') ||
            !formData.get('imagen4') ||
            formData.set('idUsuario', idUsuario)

        ) {
            toast.error('Por favor, complete todos los campos correctamente.');

            return;
        }

        setMensaje('Procesando...');

        try {
            const response = await fetch('https://www.faugetdigital.shop/productosPostApi.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.mensaje) {
                setMensaje('');
                resetForm()
                toast.success(data.mensaje);
                console.log(formData)

            } else if (data.error) {
                setMensaje('');
                toast.error(data.error);
                console.log(data.error)
            }
            setMensaje('');
        } catch (error) {
            console.error('Error:', error);
            setMensaje('');
            toast.error('Error de conexión. Por favor, inténtelo de nuevo.');

        }
    };



    return (
        <div className='NewContain'>
            <ToastContainer />
            <form id="crearForm">

                <div className='userPhoto'>
                    <img src={usuario.imagen} alt="imagen" className='imgProfi' />
                    <hr />
                </div>

                <div>
                    <div className='inputCreate'>
                        <label htmlFor="titulo"></label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            required
                            placeholder="Titulo"


                        />
                    </div>
                    <div className='inputCreate'>
                        <label htmlFor="precio"></label>
                        <input
                            type="number"
                            id="precio"
                            name="precio"
                            required
                            placeholder="Precio"


                        />
                    </div>
                    <div className='inputCreate'>
                        <label htmlFor="descripcion"></label>
                        <textarea
                            type="text"
                            id="descripcion"
                            name="descripcion"
                            required
                            placeholder="Descripcion"


                        />
                    </div>

                    <div className='inputCreate'>
                        <label htmlFor="categoria"></label>
                        <select
                            id="categoria"
                            name="categoria"
                            required
                        >
                            <option value="" disabled selected>Selecciona una categoría</option>
                            <option value="electronicos">Electrónicos</option>
                            <option value="ropa">Ropa</option>
                            <option value="hogar">Hogar</option>
                            <option value="juguetes">Juguetes</option>
                            <option value="libros">Libros</option>
                            <option value="alimentacion">Alimentación</option>
                            <option value="salud">Salud y Belleza</option>
                            <option value="deporte">Deporte y Aire libre</option>
                            <option value="tecnologia">Tecnología</option>
                            <option value="muebles">Muebles y Mobiliario</option>
                            <option value="jardineria">Jardinería</option>
                            <option value="vehiculos">Vehículos</option>
                            <option value="musica">Instrumentos Musicales</option>

                        </select>
                    </div>
                    <div className='inputCreate'>
                        <label htmlFor="estado"></label>
                        <select
                            id="estado"
                            name="estado"
                            required
                        >
                            <option value="" disabled selected>Selecciona una estado</option>
                            <option value="usado">Usado</option>
                            <option value="nuevo">Nuevo</option>
                            <option value="usado_como_nuevo">Usado como nuevo</option>
                            <option value="buen_estado">Buen estado</option>
                            <option value="mal_estado">Mal estado</option>


                        </select>
                    </div>
                    {(isImage1Selected || isImage2Selected || isImage3Selected || isImage4Selected) &&
                        <div className='imgsPubliCreate'>
                            {isImage1Selected && <img src={imagenPreview1} alt="Vista previa 1" />}
                            {isImage2Selected && <img src={imagenPreview2} alt="Vista previa 2" />}
                            {isImage3Selected && <img src={imagenPreview3} alt="Vista previa 3" />}
                            {isImage4Selected && <img src={imagenPreview4} alt="Vista previa 4" />}
                        </div>
                    }


                    <div className='deFlexImg'>
                        <div className='deFlexs'>
                            <div className='imgBg' >
                                <label htmlFor="imagen1" > <FontAwesomeIcon icon={faImage} /></label>

                                <input
                                    type="file"
                                    id="imagen1"
                                    name="imagen1"
                                    accept="image/*"
                                    onChange={(e) => handleImagenChange(e, setImagenPreview1, setIsImage1Selected)}
                                    required

                                />

                            </div>

                            <div className='imgBg' >
                                <label htmlFor="imagen2" > <FontAwesomeIcon icon={faImage} /></label>

                                <input
                                    type="file"
                                    id="imagen2"
                                    name="imagen2"
                                    accept="image/*"
                                    onChange={(e) => handleImagenChange(e, setImagenPreview2, setIsImage2Selected)}
                                    required

                                />

                            </div>

                            <div className='imgBg' >
                                <label htmlFor="imagen3" > <FontAwesomeIcon icon={faImage} /></label>

                                <input
                                    type="file"
                                    id="imagen3"
                                    name="imagen3"
                                    accept="image/*"
                                    onChange={(e) => handleImagenChange(e, setImagenPreview3, setIsImage3Selected)}
                                    required

                                />

                            </div>

                            <div className='imgBg' >
                                <label htmlFor="imagen4"> <FontAwesomeIcon icon={faImage} /></label>

                                <input
                                    type="file"
                                    id="imagen4"
                                    name="imagen4"
                                    accept="image/*"
                                    onChange={(e) => handleImagenChange(e, setImagenPreview4, setIsImage4Selected)}
                                    required

                                />

                            </div>
                        </div>
                        {mensaje ? (
                            <button type="button" className='btnLoading' disabled>
                                {mensaje}
                            </button>
                        ) : (
                            <button type="button" onClick={crear} className='btn'>
                                Postear
                            </button>
                        )}
                    </div>









                </div>

            </form>


        </div>
    );
}
