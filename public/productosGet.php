<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$servidor = "127.0.0.1:3306";
$usuario = "u605883457_socialAdmin";
$contrasena = "socialAdmin2024";
$dbname = "u605883457_social";

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Obtener todos los productos con datos de usuario
        $sqlSelectProductosUsuarios = "SELECT p.idProducto, p.titulo, p.categoria, p.descripcion,p.precio,p.estado, p.imagen1, p.imagen2, p.imagen3, p.imagen4, p.createdAt, u.idUsuario, u.nombre as nombreUsuario, u.imagen as imagenUsuario, u.perfil as perfilUsuario FROM productos p INNER JOIN usuarios u ON p.idUsuario = u.idUsuario";
        $stmtProductosUsuarios = $conexion->query($sqlSelectProductosUsuarios);

        if ($stmtProductosUsuarios) {
            $productosUsuarios = $stmtProductosUsuarios->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["productos" => $productosUsuarios]);
        } else {
            echo json_encode(["error" => "Error al obtener productos y usuarios: " . implode(", ", $conexion->errorInfo())]);
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
} catch (Exception $error) {
    echo json_encode(["error" => "Error desconocido: " . $error->getMessage()]);
}
?>
