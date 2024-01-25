<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servidor = "127.0.0.1:3306";
$usuario = "u605883457_socialAdmin";
$contrasena = "socialAdmin2024";
$dbname = "u605883457_social";

try {
    // Establecer conexión a la base de datos
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta SQL para obtener todas las publicaciones
    $sqlSelect = "SELECT idPublicacion, imagen1, imagen2, imagen3, imagen4, descripcion, idUsuario, createdAt FROM publicaciones";
    $sentencia = $conexion->prepare($sqlSelect);

    if ($sentencia->execute()) {
        // Obtener resultados de las publicaciones
        $publicaciones = $sentencia->fetchAll(PDO::FETCH_ASSOC);

        // Inicializar array para almacenar datos combinados
        $resultadosCombinados = [];

        // Iterar sobre las publicaciones y obtener el nombre de cada usuario
        foreach ($publicaciones as $publicacion) {
            $idUsuario = $publicacion['idUsuario'];

            // Consulta SQL para obtener el nombre del usuario
            $sqlUsuario = "SELECT nombre, imagen FROM usuarios WHERE idUsuario = :idUsuario";
            $sentenciaUsuario = $conexion->prepare($sqlUsuario);
            $sentenciaUsuario->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);

            if ($sentenciaUsuario->execute()) {
                // Obtener el nombre e imagen del usuario como un array asociativo
                $datosUsuario = $sentenciaUsuario->fetch(PDO::FETCH_ASSOC);

                // Agregar los datos del usuario a los resultados combinados
                $publicacion['nombreUsuario'] = $datosUsuario['nombre'];
                $publicacion['imagenUsuario'] = $datosUsuario['imagen'];
                $resultadosCombinados[] = $publicacion;
            }
        }

        // Imprimir datos en formato JSON
        echo json_encode(["publicaciones" => $resultadosCombinados]);
    } else {
        // Imprimir mensaje de error si la ejecución de la consulta falla
        echo json_encode(["error" => "Error al ejecutar la consulta SQL: " . implode(", ", $sentencia->errorInfo())]);
    }
} catch (PDOException $error) {
    // Manejar errores específicos de la conexión
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
} catch (Exception $error) {
    // Manejar otros tipos de errores
    echo json_encode(["error" => "Error desconocido: " . $error->getMessage()]);
}
?>
