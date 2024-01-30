<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$servidor = "127.0.0.1:3306";
$usuario = "u605883457_socialAdmin";
$contrasena = "socialAdmin2024";
$dbname = "u605883457_social";

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['comentario']) && isset($data['idUsuario']) && isset($data['idPublicacion'])) {
            $sqlInsertComentario = "INSERT INTO comentarios (comentario, idUsuario, idPublicacion, createdAt) VALUES (:comentario, :idUsuario, :idPublicacion, NOW())";
            $sentenciaInsertComentario = $conexion->prepare($sqlInsertComentario);
            $sentenciaInsertComentario->bindParam(':comentario', $data['comentario']);
            $sentenciaInsertComentario->bindParam(':idUsuario', $data['idUsuario'], PDO::PARAM_INT);
            $sentenciaInsertComentario->bindParam(':idPublicacion', $data['idPublicacion'], PDO::PARAM_INT);

            if ($sentenciaInsertComentario->execute()) {
                echo json_encode(["mensaje" => "Comentario creado con éxito"]);
            } else {
                echo json_encode(["error" => "Error al insertar el comentario: " . implode(", ", $sentenciaInsertComentario->errorInfo())]);
            }
        } elseif (isset($data['meGusta']) && isset($data['idUsuario']) && isset($data['idPublicacion'])) {
            // Verificar si ya existe un "Me gusta" con el mismo idUsuario e idPublicacion
            $sqlVerificarLikeExistente = "SELECT idLike FROM megusta WHERE idUsuario = :idUsuario AND idPublicacion = :idPublicacion";
            $sentenciaVerificarLikeExistente = $conexion->prepare($sqlVerificarLikeExistente);
            $sentenciaVerificarLikeExistente->bindParam(':idUsuario', $data['idUsuario'], PDO::PARAM_INT);
            $sentenciaVerificarLikeExistente->bindParam(':idPublicacion', $data['idPublicacion'], PDO::PARAM_INT);
            $sentenciaVerificarLikeExistente->execute();

            $likeExistente = $sentenciaVerificarLikeExistente->fetch(PDO::FETCH_ASSOC);

            if ($likeExistente) {
                // Si ya existe un "Me gusta", eliminarlo antes de insertar uno nuevo
                $sqlEliminarLikeExistente = "DELETE FROM megusta WHERE idLike = :idLike";
                $sentenciaEliminarLikeExistente = $conexion->prepare($sqlEliminarLikeExistente);
                $sentenciaEliminarLikeExistente->bindParam(':idLike', $likeExistente['idLike'], PDO::PARAM_INT);
                $sentenciaEliminarLikeExistente->execute();
                echo json_encode(["mensaje" => "Me gusta eliminado con éxito"]);
                exit; // Agregado para detener la ejecución después de imprimir el JSON
            }

            // Insertar el nuevo "Me gusta"
            $sqlInsertLike = "INSERT INTO megusta (meGusta, idUsuario, idPublicacion, createdAt) VALUES (:meGusta, :idUsuario, :idPublicacion, NOW())";
            $sentenciaInsertLike = $conexion->prepare($sqlInsertLike);
            $sentenciaInsertLike->bindParam(':meGusta', $data['meGusta'], PDO::PARAM_INT);
            $sentenciaInsertLike->bindParam(':idUsuario', $data['idUsuario'], PDO::PARAM_INT);
            $sentenciaInsertLike->bindParam(':idPublicacion', $data['idPublicacion'], PDO::PARAM_INT);

            if ($sentenciaInsertLike->execute()) {
                echo json_encode(["mensaje" => "Me gusta creado con éxito"]);
            } else {
                echo json_encode(["error" => "Error al insertar el Me gusta: " . implode(", ", $sentenciaInsertLike->errorInfo())]);
            }
        } else {
            echo json_encode(["error" => "Datos insuficientes para crear un comentario o un like"]);
        }
    } else {
        $sqlSelect = "SELECT idPublicacion, imagen1, imagen2, imagen3, imagen4, descripcion, idUsuario, createdAt FROM publicaciones";
        $sentencia = $conexion->prepare($sqlSelect);

        if ($sentencia->execute()) {
            $publicaciones = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            $resultadosCombinados = [];

            foreach ($publicaciones as $publicacion) {
                $idUsuario = $publicacion['idUsuario'];

                $sqlUsuario = "SELECT nombre, imagen, perfil FROM usuarios WHERE idUsuario = :idUsuario";
                $sentenciaUsuario = $conexion->prepare($sqlUsuario);
                $sentenciaUsuario->bindParam(':idUsuario', $idUsuario, PDO::PARAM_INT);

                if ($sentenciaUsuario->execute()) {
                    $datosUsuario = $sentenciaUsuario->fetch(PDO::FETCH_ASSOC);

                    $publicacion['nombreUsuario'] =$datosUsuario['nombre'];
                    $datosUsuario['nombre'];
                    $publicacion['imagenUsuario'] = $datosUsuario['imagen'];
                    $publicacion['perfilUsuario'] = $datosUsuario['perfil'];

                    $sqlComentarios = "SELECT c.idComentario, c.comentario, c.idUsuario, c.createdAt, u.nombre as nombreUsuarioComentario, u.perfil as perfilUsuarioComentario, u.imagen as imagenUsuarioComentario FROM comentarios c INNER JOIN usuarios u ON c.idUsuario = u.idUsuario WHERE c.idPublicacion = :idPublicacion";
                    $sentenciaComentarios = $conexion->prepare($sqlComentarios);
                    $sentenciaComentarios->bindParam(':idPublicacion', $publicacion['idPublicacion'], PDO::PARAM_INT);

                    if ($sentenciaComentarios->execute()) {
                        $comentarios = $sentenciaComentarios->fetchAll(PDO::FETCH_ASSOC);
                        $publicacion['comentarios'] = $comentarios;
                    }

                    $sqlLikes = "SELECT m.idLike, m.meGusta, m.idUsuario, m.createdAt, u.nombre as nombreUsuarioLike, u.perfil as perfilUsuarioLike, u.imagen as imagenUsuarioLike FROM megusta m INNER JOIN usuarios u ON m.idUsuario = u.idUsuario WHERE m.idPublicacion = :idPublicacion";
                    $sentenciaLikes = $conexion->prepare($sqlLikes);
                    $sentenciaLikes->bindParam(':idPublicacion', $publicacion['idPublicacion'], PDO::PARAM_INT);

                    if ($sentenciaLikes->execute()) {
                        $likes = $sentenciaLikes->fetchAll(PDO::FETCH_ASSOC);
                        $publicacion['likes'] = $likes;
                    }

                    $resultadosCombinados[] = $publicacion;
                }
            }

            echo json_encode(["publicaciones" => $resultadosCombinados]);
        } else {
            echo json_encode(["error" => "Error al ejecutar la consulta SQL: " . implode(", ", $sentencia->errorInfo())]);
        }
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
} catch (Exception $error) {
    echo json_encode(["error" => "Error desconocido: " . $error->getMessage()]);
}
?>
