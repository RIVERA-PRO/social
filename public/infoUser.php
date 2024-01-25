<?php
// Iniciar la sesión
session_start();

// Verificar si el usuario está logueado
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit();
}

// Obtener el ID del usuario desde la sesión
$usuarioId = $_SESSION['usuario_id'];

// Lógica para obtener los datos del usuario desde la base de datos
function obtenerDatosUsuario($id) {
    // Conexión a la base de datos
    $servidor = "127.0.0.1:3306";
    $usuario = "u605883457_socialAdmin";
    $contrasena = "socialAdmin2024";
    $dbname = "u605883457_social";

    try {
        $dsn = "mysql:host=$servidor;dbname=$dbname";
        $conexion = new PDO($dsn, $usuario, $contrasena);
        $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Consulta para obtener los datos del usuario
        $sql = "SELECT * FROM usuarios WHERE idUsuario = :id";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        // Obtener los datos del usuario
        $datosUsuario = $stmt->fetch(PDO::FETCH_ASSOC);

        return $datosUsuario;
    } catch (PDOException $error) {
        // Manejar errores de conexión o consulta
        die("Error de conexión: " . $error->getMessage());
    }
}

// Obtener los datos del usuario
$datosUsuario = obtenerDatosUsuario($usuarioId);

// Mostrar los datos del usuario
echo "Bienvenido, " . $datosUsuario['nombre'] . "!<br>";
echo "Email: " . $datosUsuario['email'] . "<br>";

// ... (Mostrar otros datos según sea necesario)

// Puedes utilizar $datosUsuario en el resto de tu código según tus necesidades.
?>
