<?php
// Establecer encabezados para el tipo de contenido y control de acceso
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Configuración de la base de datos
$servidor = "127.0.0.1:3306";
$usuario = "u605883457_socialAdmin";
$contrasena = "socialAdmin2024";
$dbname = "u605883457_social";

try {
    // Crear la conexión a la base de datos
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verificar si la solicitud es un POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener datos del formulario
        $email = $_POST['email'];
        $contrasena = $_POST['contrasena'];

        // Verificar si el usuario ya existe en la base de datos
        $sqlVerificar = "SELECT * FROM `usuarios` WHERE email = :email";
        $stmtVerificar = $conexion->prepare($sqlVerificar);
        $stmtVerificar->bindParam(':email', $email);
        $stmtVerificar->execute();
        $existeUsuario = $stmtVerificar->fetch();

        if ($existeUsuario) {
            // Usuario ya existe, realizar inicio de sesión
            $sqlCheckCredenciales = "SELECT idUsuario, nombre, email, contrasena, rol FROM `usuarios` WHERE email = :email";
            $stmtCheckCredenciales = $conexion->prepare($sqlCheckCredenciales);
            $stmtCheckCredenciales->bindParam(':email', $email);
            $stmtCheckCredenciales->execute();

            // Verificar las credenciales del usuario
            if ($stmtCheckCredenciales->rowCount() > 0) {
                $row = $stmtCheckCredenciales->fetch(PDO::FETCH_ASSOC);
                $contrasenaHash = $row['contrasena'];

                // Verificar la contraseña mediante el hash
                if (password_verify($contrasena, $contrasenaHash)) {
                    // Iniciar sesión y redirigir según el rol del usuario
                    session_start();
                    $_SESSION['usuario_id'] = $row['idUsuario'];
                    $_SESSION['rol'] = $row['rol'];

                    // Construir array con datos del usuario
                    $usuario = [
                        "idUsuario" => $row['idUsuario'],
                        "nombre" => $row['nombre'],
                        "email" => $row['email'],
                        "contrasena" => $contrasena,
                    ];

                    // Redirigir y enviar mensaje de éxito
                    if ($row['rol'] == 'admin') {
                        echo json_encode(["mensaje" => "Inicio de sesión exitoso como administrador", "redirect" => "dashboard.php", "usuario" => $usuario]);
                    } else {
                        echo json_encode(["mensaje" => "Inicio de sesión exitoso", "redirect" => "/", "usuario" => $usuario]);
                    }
                    exit();
                } else {
                    // Contraseña incorrecta
                    echo json_encode(["error" => "Contraseña incorrecta"]);
                }
            }
        } else {
            // Usuario no existe, realizar registro
            if (!empty($email) && !empty($contrasena)) {
                // Verificar la longitud de la contraseña
                if (strlen($contrasena) < 6) {
                    echo json_encode(["error" => "La contraseña debe tener al menos 6 caracteres"]);
                } else {
                    // Hash de la contraseña
                    $hashContrasena = password_hash($contrasena, PASSWORD_DEFAULT);

                    // Obtener la fecha actual
                    $fechaActual = date("Y-m-d H:i:s");

                    // Resto de la información del formulario (puedes agregar más campos si es necesario)
                    $nombre = $_POST['nombre'];
                    $rol = "usuario";

                    // Insertar nuevo usuario en la base de datos
                    $sqlInsert = "INSERT INTO `usuarios` (nombre, email, contrasena, rol, createdAt) 
                                  VALUES (:nombre, :email, :contrasena, :rol, :createdAt)";
                    $stmt = $conexion->prepare($sqlInsert);
                    $stmt->bindParam(':nombre', $nombre);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':contrasena', $hashContrasena);
                    $stmt->bindParam(':rol', $rol);
                    $stmt->bindParam(':createdAt', $fechaActual);

                    // Ejecutar la consulta
                    $stmt->execute();

                    // Iniciar sesión para el usuario recién registrado
                    session_start();
                    $_SESSION['usuario_id'] = $conexion->lastInsertId(); // Obtener el ID del usuario recién registrado
                    $_SESSION['rol'] = $rol;

                    // Construir array con datos del usuario
                    $usuario = [
                        "idUsuario" => $_SESSION['usuario_id'],
                        "nombre" => $nombre,
                        "email" => $email,
                        // Agregar cualquier otro campo que desees incluir
                    ];

                    // Redirigir y enviar mensaje de éxito
                    echo json_encode(["mensaje" => "Registro exitoso. Inicio de sesión automático.", "redirect" => "/", "usuario" => $usuario]);
                }
            } else {
                // Informar que los campos no están completos
                echo json_encode(["error" => "Por favor, completa todos los campos correctamente"]);
            }
        }
    } else {
        // Método no permitido
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    // Error de conexión a la base de datos
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>



                    