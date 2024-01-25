<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir solicitudes desde cualquier origen (no seguro para producción)

$servidor = "127.0.0.1:3306";
$usuario = "u605883457_adminDenuncias";
$contrasena = "AdminDenuncias2024";
$dbname = "u605883457_denuncias";

try {
    // Establecer conexión a la base de datos
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar el método de la solicitud
    $metodo = $_SERVER['REQUEST_METHOD'];

    // Consulta SQL para obtener todos los usuarios
    if ($metodo == 'GET') {
        $sqlSelect = "SELECT idUsuario, nombre, email, rol, createdAt FROM usuarios";
        $sentencia = $conexion->prepare($sqlSelect);

        if ($sentencia->execute()) {
            // Obtener resultados
            $resultado = $sentencia->fetchAll(PDO::FETCH_ASSOC);

            // Imprimir datos en formato JSON
            echo json_encode(["usuarios" => $resultado]);
        } else {
            // Imprimir mensaje de error si la ejecución de la consulta falla
            echo json_encode(["error" => "Error al ejecutar la consulta SQL: " . implode(", ", $sentencia->errorInfo())]);
        }
    } elseif ($metodo == 'PUT') {
        // Verificar si se proporcionó un ID y datos para actualizar
        $idUsuario = isset($_GET['idUsuario']) ? $_GET['idUsuario'] : null;
        $datos = json_decode(file_get_contents("php://input"), true);

        if (!$idUsuario || !$datos || !isset($datos['contrasena'])) {
            echo json_encode(["error" => "Se requiere proporcionar un ID y la nueva contraseña para actualizar al usuario."]);
            exit;
        }

        // Validar la longitud de la contraseña
        if (strlen($datos['contrasena']) < 6) {
            echo json_encode(["error" => "La contraseña debe tener al menos 6 caracteres."]);
            exit;
        }

        // Consulta SQL para actualizar la contraseña del usuario por ID
        $sqlUpdate = "UPDATE usuarios SET contrasena = :contrasena WHERE idUsuario = :idUsuario";
        $sentencia = $conexion->prepare($sqlUpdate);
        $contrasenaHash = password_hash($datos['contrasena'], PASSWORD_DEFAULT);
        $sentencia->bindParam(':contrasena', $contrasenaHash);
        $sentencia->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);

        if ($sentencia->execute()) {
            echo json_encode(["mensaje" => "Contraseña de usuario actualizada correctamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar la contraseña del usuario: " . implode(", ", $sentencia->errorInfo())]);
        }
    }
} catch (PDOException $error) {
    // Manejar errores específicos de la conexión
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
} catch (Exception $error) {
    // Manejar otros tipos de errores
    echo json_encode(["error" => "Error desconocido: " . $error->getMessage()]);
}
?>
