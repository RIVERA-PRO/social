<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejo de solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$servidor = "127.0.0.1:3306";
$usuario = "u605883457_socialAdmin";
$contrasena = "socialAdmin2024";
$dbname = "u605883457_social";
$mensaje = "";
try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $idPublicacion = isset($_GET['idPublicacion']) ? $_GET['idPublicacion'] : null;

        if (!$idPublicacion) {
            echo json_encode(["error" => "Se requiere proporcionar un ID de publicación para eliminarla."]);
            exit;
        }

       // Obtener nombres de archivo de la base de datos
$sqlSelectImagenes = "SELECT imagen1, imagen2, imagen3, imagen4 FROM publicaciones WHERE idPublicacion = :idPublicacion";
$sentenciaSelectImagenes = $conexion->prepare($sqlSelectImagenes);
$sentenciaSelectImagenes->bindParam(':idPublicacion', $idPublicacion, PDO::PARAM_INT);
$sentenciaSelectImagenes->execute();
$imagenes = $sentenciaSelectImagenes->fetch(PDO::FETCH_ASSOC);

// Eliminar la publicación de la base de datos
$sqlDelete = "DELETE FROM publicaciones WHERE idPublicacion = :idPublicacion";
$sentenciaDelete = $conexion->prepare($sqlDelete);
$sentenciaDelete->bindParam(':idPublicacion', $idPublicacion, PDO::PARAM_INT);

if ($sentenciaDelete->execute()) {
    // Eliminar archivos de la carpeta imagenes_publicaciones
    $carpetaImagenes = 'imagenes_publicaciones/';
    foreach ($imagenes as $imagen) {
        if ($imagen) {
            $rutaImagen = $carpetaImagenes . basename($imagen);
            if (file_exists($rutaImagen)) {
                unlink($rutaImagen);
            }
        }
    }

    echo json_encode(["mensaje" => "Publicación y archivos asociados eliminados correctamente"]);
} else {
    echo json_encode(["error" => "Error al eliminar la publicación"]);
}


        exit;
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
