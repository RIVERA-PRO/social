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
$carpetaImagenes = 'imagenes_usuarios';

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $idUsuario = isset($_GET['idUsuario']) ? $_GET['idUsuario'] : null;
    
        if (!$idUsuario) {
            echo json_encode(["error" => "Se requiere proporcionar un ID de usuario para actualizar la imagen y el banner."]);
            exit;
        }
    
        // Procesar la imagen
        $nombreImagen = $_FILES['imagen']['name'];
        $rutaImagenCompleta = '';
        if (!empty($nombreImagen)) {
            $rutaImagen = $carpetaImagenes . '/' . $nombreImagen;
            
            // Verificar si la imagen se cargó correctamente
            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaImagen)) {
                $rutaImagenCompleta = 'https://www.faugetdigital.shop/' . $rutaImagen;
            } else {
                echo json_encode(["error" => "Error al mover el archivo de imagen"]);
                exit;
            }
        }
    
        // Procesar el banner
        $nombreImagenBanner = $_FILES['banner']['name'];
        $rutaImagenBannerCompleta = '';
        if (!empty($nombreImagenBanner)) {
            $rutaImagenBanner = $carpetaImagenes . '/' . $nombreImagenBanner;
    
            // Verificar si el banner se cargó correctamente
            if (move_uploaded_file($_FILES['banner']['tmp_name'], $rutaImagenBanner)) {
                $rutaImagenBannerCompleta = 'https://www.faugetdigital.shop/' . $rutaImagenBanner;
            } else {
                echo json_encode(["error" => "Error al mover el archivo de banner"]);
                exit;
            }
        }
    
        // Obtener los valores actuales de la base de datos
        $sqlSelect = "SELECT imagen, banner FROM usuarios WHERE idUsuario = :idUsuario";
        $sentenciaSelect = $conexion->prepare($sqlSelect);
        $sentenciaSelect->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
        $sentenciaSelect->execute();
        $valoresActuales = $sentenciaSelect->fetch(PDO::FETCH_ASSOC);
    
        // Utilizar los valores actuales si no se proporciona una nueva imagen o banner
        $rutaImagenCompleta = $rutaImagenCompleta ?: $valoresActuales['imagen'];
        $rutaImagenBannerCompleta = $rutaImagenBannerCompleta ?: $valoresActuales['banner'];
    
        $sqlUpdate = "UPDATE usuarios SET imagen = :imagen, banner = :banner WHERE idUsuario = :idUsuario";
        $sentenciaUpdate = $conexion->prepare($sqlUpdate);
        $sentenciaUpdate->bindParam(':imagen', $rutaImagenCompleta);
        $sentenciaUpdate->bindParam(':banner', $rutaImagenBannerCompleta);
        $sentenciaUpdate->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);
    
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
