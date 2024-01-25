<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$servidor = "127.0.0.1:3306";
$usuario = "u605883457_socialAdmin";
$contrasena = "socialAdmin2024";
$dbname = "u605883457_social";

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $emailLogin = $_POST['email'];

        // Verificar si el correo existe
        $sqlCheckCorreo = "SELECT idUsuario, nombre, email FROM `usuarios` WHERE email = :email";
        $stmtCheckCorreo = $conexion->prepare($sqlCheckCorreo);
        $stmtCheckCorreo->bindParam(':email', $emailLogin);
        $stmtCheckCorreo->execute();

        if ($stmtCheckCorreo->rowCount() > 0) {
            $row = $stmtCheckCorreo->fetch(PDO::FETCH_ASSOC);

            // Mostrar mensaje de éxito y datos del usuario
            $usuario = [
                "idUsuario" => $row['idUsuario'],
                "nombre" => $row['nombre'],
                "email" => $row['email'],
            ];

            echo json_encode(["mensaje" => "Correo encontrado", "usuario" => $usuario]);
        } else {
            echo json_encode(["error" => "Correo no encontrado"]);
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
