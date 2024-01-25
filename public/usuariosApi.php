<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$servidor = "127.0.0.1:3306";
$usuario = "u605883457_socialAdmin";
$contrasena = "socialAdmin2024";
$dbname = "u605883457_social";

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $metodo = $_SERVER['REQUEST_METHOD'];

    if ($metodo == 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        exit;
    }

    if ($metodo == 'GET') {
        $sqlSelect = "SELECT idUsuario, nombre, email, rol, createdAt, imagen, banner, fechaNacimiento, presentacion ,experiencia ,perfil,linkedin,instagram,facebook,web,telefono FROM usuarios";
        $sentencia = $conexion->prepare($sqlSelect);

        if ($sentencia->execute()) {
            $resultado = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["usuarios" => $resultado]);
        } else {
            echo json_encode(["error" => "Error al ejecutar la consulta SQL: " . implode(", ", $sentencia->errorInfo())]);
        }
    } elseif ($metodo == 'PUT') {
        $idUsuario = isset($_GET['idUsuario']) ? $_GET['idUsuario'] : null;

        if (!$idUsuario) {
            echo json_encode(["error" => "Se requiere proporcionar un ID para actualizar al usuario."]);
            exit;
        }

        $datos = json_decode(file_get_contents('php://input'), true);

        $sqlUpdate = "UPDATE usuarios SET rol = :rol, nombre = :nombre ,fechaNacimiento = :fechaNacimiento, presentacion = :presentacion ,experiencia = :experiencia, perfil = :perfil, linkedin = :linkedin,instagram = :instagram,facebook = :facebook,web = :web, telefono= :telefono WHERE idUsuario = :idUsuario";
        $sentenciaUpdate = $conexion->prepare($sqlUpdate);
        $sentenciaUpdate->bindParam(':rol', $datos['rol']);
        $sentenciaUpdate->bindParam(':nombre', $datos['nombre']);
        $sentenciaUpdate->bindParam(':fechaNacimiento', $datos['fechaNacimiento']);
        $sentenciaUpdate->bindParam(':presentacion', $datos['presentacion']);
        $sentenciaUpdate->bindParam(':experiencia', $datos['experiencia']);
        $sentenciaUpdate->bindParam(':perfil', $datos['perfil']);
        $sentenciaUpdate->bindParam(':linkedin', $datos['linkedin']);
        $sentenciaUpdate->bindParam(':instagram', $datos['instagram']);
        $sentenciaUpdate->bindParam(':facebook', $datos['facebook']);
        $sentenciaUpdate->bindParam(':web', $datos['web']);
        $sentenciaUpdate->bindParam(':telefono', $datos['telefono']);
        $sentenciaUpdate->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);

        if ($sentenciaUpdate->execute()) {
            echo json_encode(["mensaje" => "Usuario actualizado correctamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar al usuario: " . implode(", ", $sentenciaUpdate->errorInfo())]);
        }
        exit;
    }

} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
} catch (Exception $error) {
    echo json_encode(["error" => "Error desconocido: " . $error->getMessage()]);
}
?>
