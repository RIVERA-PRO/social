<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$servidor = "127.0.0.1:3306";
$usuario = "u605883457_socialAdmin";
$contrasena = "socialAdmin2024";
$dbname = "u605883457_social";
$mensaje = "";

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $descripcion = $_POST['descripcion'];
        $idUsuario = $_POST['idUsuario']; // Nuevo campo

        if (!empty($descripcion) && !empty($idUsuario)) {

            // Verificar si se enviaron imágenes
            $imagenesPresentes = isset($_FILES['imagen1']) || isset($_FILES['imagen2']) || isset($_FILES['imagen3']) || isset($_FILES['imagen4']);

            if ($imagenesPresentes) {

                // Crear carpeta para imágenes si no existe
                $carpetaImagenes = 'imagenes_publicaciones';
                if (!file_exists($carpetaImagenes)) {
                    mkdir($carpetaImagenes, 0777, true);
                }

                // Inicializar rutas de imágenes
                $rutaImagenCompleta = '';
                $rutaImagen2Completa = '';
                $rutaImagen3Completa = '';
                $rutaImagen4Completa = '';

                // Subir imágenes si están presentes
                if (isset($_FILES['imagen1']) && $_FILES['imagen1']['error'] === UPLOAD_ERR_OK) {
                    $nombreImagen = $_FILES['imagen1']['name'];
                    $rutaImagen = $carpetaImagenes . '/' . $nombreImagen;
                    move_uploaded_file($_FILES['imagen1']['tmp_name'], $rutaImagen);
                    $rutaImagenCompleta = 'https://www.faugetdigital.shop/' . $rutaImagen;
                }

                if (isset($_FILES['imagen2']) && $_FILES['imagen2']['error'] === UPLOAD_ERR_OK) {
                    $nombreImagen2 = $_FILES['imagen2']['name'];
                    $rutaImagen2 = $carpetaImagenes . '/' . $nombreImagen2;
                    move_uploaded_file($_FILES['imagen2']['tmp_name'], $rutaImagen2);
                    $rutaImagen2Completa = 'https://www.faugetdigital.shop/' . $rutaImagen2;
                }

                if (isset($_FILES['imagen3']) && $_FILES['imagen3']['error'] === UPLOAD_ERR_OK) {
                    $nombreImagen3 = $_FILES['imagen3']['name'];
                    $rutaImagen3 = $carpetaImagenes . '/' . $nombreImagen3;
                    move_uploaded_file($_FILES['imagen3']['tmp_name'], $rutaImagen3);
                    $rutaImagen3Completa = 'https://www.faugetdigital.shop/' . $rutaImagen3;
                }

                if (isset($_FILES['imagen4']) && $_FILES['imagen4']['error'] === UPLOAD_ERR_OK) {
                    $nombreImagen4 = $_FILES['imagen4']['name'];
                    $rutaImagen4 = $carpetaImagenes . '/' . $nombreImagen4;
                    move_uploaded_file($_FILES['imagen4']['tmp_name'], $rutaImagen4);
                    $rutaImagen4Completa = 'https://www.faugetdigital.shop/' . $rutaImagen4;
                }

                // Almacenar enlaces completos en la base de datos
                $sqlInsert = "INSERT INTO `publicaciones` (descripcion, idUsuario, imagen1, imagen2 , imagen3, imagen4) 
                              VALUES (:descripcion, :idUsuario, :imagen1, :imagen2, :imagen3 , :imagen4)";
                $stmt = $conexion->prepare($sqlInsert);
                $stmt->bindParam(':descripcion', $descripcion);
                $stmt->bindParam(':idUsuario', $idUsuario);
                $stmt->bindParam(':imagen1', $rutaImagenCompleta);
                $stmt->bindParam(':imagen2', $rutaImagen2Completa);
                $stmt->bindParam(':imagen3', $rutaImagen3Completa);
                $stmt->bindParam(':imagen4', $rutaImagen4Completa);

                $stmt->execute();

                // Obtener el ID de la última inserción
                $lastId = $conexion->lastInsertId();

                // Obtener la fecha de creación actualizada
                $sqlSelect = "SELECT createdAt FROM `publicaciones` WHERE idPublicacion = :lastId";
                $stmtSelect = $conexion->prepare($sqlSelect);
                $stmtSelect->bindParam(':lastId', $lastId);
                $stmtSelect->execute();
                $createdAt = $stmtSelect->fetchColumn();

                // Respuesta JSON con enlaces de las imágenes y fecha de creación
                echo json_encode([
                    "mensaje" => "publicacion enviada exitosamente",
                    "imagen1" => $rutaImagenCompleta,
                    "imagen2" => $rutaImagen2Completa,
                    "imagen3" => $rutaImagen3Completa,
                    "imagen4" => $rutaImagen4Completa,
                    "createdAt" => $createdAt
                ]);
            } else {
                // No se enviaron imágenes, continuar sin imágenes
                $sqlInsert = "INSERT INTO `publicaciones` (descripcion, idUsuario) VALUES (:descripcion, :idUsuario)";
                $stmt = $conexion->prepare($sqlInsert);
                $stmt->bindParam(':descripcion', $descripcion);
                $stmt->bindParam(':idUsuario', $idUsuario);
                $stmt->execute();

                // Obtener el ID de la última inserción
                $lastId = $conexion->lastInsertId();

                // Obtener la fecha de creación actualizada
                $sqlSelect = "SELECT createdAt FROM `publicaciones` WHERE idPublicacion = :lastId";
                $stmtSelect = $conexion->prepare($sqlSelect);
                $stmtSelect->bindParam(':lastId', $lastId);
                $stmtSelect->execute();
                $createdAt = $stmtSelect->fetchColumn();

                // Respuesta JSON sin enlaces de imágenes y con fecha de creación
                echo json_encode([
                    "mensaje" => "publicacion enviada exitosamente",
                    "createdAt" => $createdAt
                ]);
            }
        } else {
            echo json_encode(["error" => "Por favor, complete todos los campos correctamente"]);
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>