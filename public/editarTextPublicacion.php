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

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $idPublicacion = isset($_GET['idPublicacion']) ? $_GET['idPublicacion'] : null;
        $data = json_decode(file_get_contents("php://input"), true);
    
        $nuevaDescripcion = isset($data['nuevaDescripcion']) ? $data['nuevaDescripcion'] : null;
    
        if (!$idPublicacion || !$nuevaDescripcion) {
            echo json_encode(["error" => "Se requiere proporcionar un ID de publicación y una nueva descripción para actualizar."]);
            exit;
        }

        $sqlUpdate = "UPDATE publicaciones SET descripcion = :descripcion WHERE idPublicacion = :idPublicacion";
        $sentenciaUpdate = $conexion->prepare($sqlUpdate);
        $sentenciaUpdate->bindParam(':descripcion', $nuevaDescripcion);
        $sentenciaUpdate->bindParam(':idPublicacion', $idPublicacion, PDO::PARAM_INT);

        if ($sentenciaUpdate->execute()) {
            echo json_encode(["mensaje" => "Descripción actualizada correctamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar la descripción: " . implode(", ", $sentenciaUpdate->errorInfo())]);
        }
        exit;
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
