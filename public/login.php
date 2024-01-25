<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
$servidor = "127.0.0.1:3306";
$usuario = "u605883457_socialAdmin";
$contrasena = "socialAdmin2024";
$dbname = "u605883457_social";
$mensajeLogin = "";

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $emailLogin = $_POST['email'];
        $contrasenaLogin = $_POST['contrasena'];

        // Verificar las credenciales del usuario
        $sqlCheckCredenciales = "SELECT idUsuario, nombre, email, contrasena, rol, imagen FROM `usuarios` WHERE email = :email";
        $stmtCheckCredenciales = $conexion->prepare($sqlCheckCredenciales);
        $stmtCheckCredenciales->bindParam(':email', $emailLogin);
        $stmtCheckCredenciales->execute();

        if ($stmtCheckCredenciales->rowCount() > 0) {
            $row = $stmtCheckCredenciales->fetch(PDO::FETCH_ASSOC);
            $contrasenaHash = $row['contrasena'];

            if (password_verify($contrasenaLogin, $contrasenaHash)) {
                // Iniciar sesión y redirigir al usuario según el rol
                session_start();
                $_SESSION['usuario_id'] = $row['idUsuario'];
                $_SESSION['rol'] = $row['rol'];

                // Añadir nombre y email al array del usuario
                $usuario = [
                    "idUsuario" => $row['idUsuario'],
                    "nombre" => $row['nombre'],
                    "email" => $row['email'],
                    "contrasena" => $contrasenaLogin,
                    "imagen" => $row['imagen'],
                ];

                if ($row['rol'] == 'admin') {
                    echo json_encode(["mensaje" => "Inicio de sesión exitoso como administrador", "redirect" => "dashboard.php", "usuario" => $usuario]);
                } else {
                    echo json_encode(["mensaje" => "Inicio de sesión exitoso", "redirect" => "/", "usuario" => $usuario]);
                }
                exit();
            } else {
                echo json_encode(["error" => "Contraseña incorrecta"]);
            }
        } else {
            echo json_encode(["error" => "Usuario no encontrado"]);
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
