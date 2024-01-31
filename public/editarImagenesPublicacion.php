<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
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
$carpetaImagenes = 'imagenes_publicaciones';

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $idPublicacion = isset($_REQUEST['idPublicacion']) ? $_REQUEST['idPublicacion'] : null;

    
        if (!$idPublicacion) {
            echo json_encode(["error" => "Se requiere proporcionar un ID de publicación para actualizar las imágenes."]);
            exit;
        }

        $nombreImagen1 = $_FILES['imagen1']['name'];
        $rutaImagen1Completa = '';
        if (!empty($nombreImagen1)) {
            $rutaImagen1 = $carpetaImagenes . '/' . $nombreImagen1;
            
            if (move_uploaded_file($_FILES['imagen1']['tmp_name'], $rutaImagen1)) {
                $rutaImagen1Completa = 'https://www.faugetdigital.shop/' . $rutaImagen1;
            } else {
                echo json_encode(["error" => "Error al mover el archivo de imagen1"]);
                exit;
            }
        }

        $nombreImagen2 = $_FILES['imagen2']['name'];
        $rutaImagen2Completa = '';
        if (!empty($nombreImagen2)) {
            $rutaImagen2 = $carpetaImagenes . '/' . $nombreImagen2;
            
            if (move_uploaded_file($_FILES['imagen2']['tmp_name'], $rutaImagen2)) {
                $rutaImagen2Completa = 'https://www.faugetdigital.shop/' . $rutaImagen2;
            } else {
                echo json_encode(["error" => "Error al mover el archivo de imagen2"]);
                exit;
            }
        }

        $nombreImagen3 = $_FILES['imagen3']['name'];
        $rutaImagen3Completa = '';
        if (!empty($nombreImagen3)) {
            $rutaImagen3 = $carpetaImagenes . '/' . $nombreImagen3;
            
            if (move_uploaded_file($_FILES['imagen3']['tmp_name'], $rutaImagen3)) {
                $rutaImagen3Completa = 'https://www.faugetdigital.shop/' . $rutaImagen3;
            } else {
                echo json_encode(["error" => "Error al mover el archivo de imagen3"]);
                exit;
            }
        }

        $nombreImagen4 = $_FILES['imagen4']['name'];
        $rutaImagen4Completa = '';
        if (!empty($nombreImagen4)) {
            $rutaImagen4 = $carpetaImagenes . '/' . $nombreImagen4;
            
            if (move_uploaded_file($_FILES['imagen4']['tmp_name'], $rutaImagen4)) {
                $rutaImagen4Completa = 'https://www.faugetdigital.shop/' . $rutaImagen4;
            } else {
                echo json_encode(["error" => "Error al mover el archivo de imagen4"]);
                exit;
            }
        }

        $sqlSelect = "SELECT imagen1, imagen2, imagen3, imagen4 FROM publicaciones WHERE idPublicacion = :idPublicacion";
        $sentenciaSelect = $conexion->prepare($sqlSelect);
        $sentenciaSelect->bindParam(':idPublicacion', $idPublicacion, PDO::PARAM_INT);
        $sentenciaSelect->execute();
        $valoresActuales = $sentenciaSelect->fetch(PDO::FETCH_ASSOC);
    
        $rutaImagen1Completa = $rutaImagen1Completa ?: $valoresActuales['imagen1'];
        $rutaImagen2Completa = $rutaImagen2Completa ?: $valoresActuales['imagen2'];
        $rutaImagen3Completa = $rutaImagen3Completa ?: $valoresActuales['imagen3'];
        $rutaImagen4Completa = $rutaImagen4Completa ?: $valoresActuales['imagen4'];

        $sqlUpdate = "UPDATE publicaciones SET imagen1 = :imagen1, imagen2 = :imagen2, imagen3 = :imagen3, imagen4 = :imagen4 WHERE idPublicacion = :idPublicacion";
        $sentenciaUpdate = $conexion->prepare($sqlUpdate);
        $sentenciaUpdate->bindParam(':imagen1', $rutaImagen1Completa);
        $sentenciaUpdate->bindParam(':imagen2', $rutaImagen2Completa);
        $sentenciaUpdate->bindParam(':imagen3', $rutaImagen3Completa);
        $sentenciaUpdate->bindParam(':imagen4', $rutaImagen4Completa);
        $sentenciaUpdate->bindParam(':idPublicacion', $idPublicacion, PDO::PARAM_INT);
    
        if ($sentenciaUpdate->execute()) {
            echo json_encode(["mensaje" => "Actualizado correctamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar : " . implode(", ", $sentenciaUpdate->errorInfo())]);
        }
        exit;
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
