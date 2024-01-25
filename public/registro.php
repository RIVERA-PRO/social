<?php
header("Content-Type: application/json");

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
        $nombre = $_POST['nombre'];
        $email = $_POST['email'];
        $contrasena = $_POST['contrasena'];
        $rol = "usuario";

        // Procesar la imagen
        $nombreImagen = $_FILES['imagen']['name'];
        $rutaImagenCompleta = '';
        if (!empty($nombreImagen)) {
            $rutaImagen = $carpetaImagenes . '/' . $nombreImagen;
            move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaImagen);
            $rutaImagenCompleta = 'https://www.faugetdigital.shop/' . $rutaImagen;
        }

        // Procesar el banner
        $nombreImagen2 = $_FILES['banner']['name'];
        $rutaImagen2Completa = '';
        if (!empty($nombreImagen2)) {
            $rutaImagen2 = $carpetaImagenes . '/' . $nombreImagen2;
            move_uploaded_file($_FILES['banner']['tmp_name'], $rutaImagen2);
            $rutaImagen2Completa = 'https://www.faugetdigital.shop/' . $rutaImagen2;
        }

        // Verificar si el usuario ya existe
        $sqlVerificar = "SELECT * FROM `usuarios` WHERE email = :email";
        $stmtVerificar = $conexion->prepare($sqlVerificar);
        $stmtVerificar->bindParam(':email', $email);
        $stmtVerificar->execute();
        $existeUsuario = $stmtVerificar->fetch();

        if ($existeUsuario) {
            echo json_encode(["error" => "Ya existe un usuario con ese correo electrónico"]);
        } else {
            // Insertar nuevo usuario si no existe
            if (!empty($nombre) && !empty($email) && !empty($contrasena)) {
                // Verificar la longitud de la contraseña
                if (strlen($contrasena) < 6) {
                    echo json_encode(["error" => "La contraseña debe tener al menos 6 caracteres"]);
                } else {
                    // Hash de la contraseña
                    $hashContrasena = password_hash($contrasena, PASSWORD_DEFAULT);

                    // Obtener la fecha actual
                    $fechaActual = date("Y-m-d H:i:s");

                    // Insertar en la base de datos
                    $sqlInsert = "INSERT INTO `usuarios` (nombre, email, contrasena, rol, imagen, banner, createdAt) 
                                  VALUES (:nombre, :email, :contrasena, :rol, :imagen, :banner, :createdAt)";
                    $stmt = $conexion->prepare($sqlInsert);
                    $stmt->bindParam(':nombre', $nombre);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':contrasena', $hashContrasena);
                    $stmt->bindParam(':rol', $rol);
                    $stmt->bindParam(':imagen', $rutaImagenCompleta);
                    $stmt->bindParam(':banner', $rutaImagen2Completa);
                    $stmt->bindParam(':createdAt', $fechaActual);

                    $stmt->execute();

                    echo json_encode(["mensaje" => "Usuario creado exitosamente"]);
                }
            } else {
                echo json_encode(["error" => "Por favor, complete todos los campos correctamente"]);
            }
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
