package co.edu.progAvanzada.ytOsito_ParcialFinal.likes.controllers;

import co.edu.progAvanzada.ytOsito_ParcialFinal.likes.entities.Like;
import co.edu.progAvanzada.ytOsito_ParcialFinal.likes.services.LikeService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para gestionar las operaciones de likes y dislikes en videos.
 * 
 * Este controlador expone endpoints para permitir a los usuarios dar like/dislike
 * a videos, consultar likes existentes, y obtener estadísticas de likes/dislikes.
 * Proporciona una API RESTful completa para la gestión de reacciones de usuarios.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Rojas Roldan
 * @version 1.0
 * @since 1.0
 */
@RestController
@RequestMapping("/like")
public class LikeController {

    /**
     * Servicio para la lógica de negocio de likes.
     * 
     * Se inyecta automáticamente mediante Spring Boot para gestionar
     * todas las operaciones relacionadas con likes y dislikes.
     */
    @Autowired
    private LikeService likeService;

    /**
     * Endpoint para dar like o dislike a un video.
     * 
     * Permite a un usuario expresar su reacción (positiva o negativa) hacia un video.
     * Si el usuario ya tiene una reacción previa, se actualiza; si no, se crea nueva.
     * 
     * @param videoId ID del video al que se le dará like/dislike. Debe ser un ID válido existente.
     * @param usuarioId ID del usuario que da la reacción. Debe ser un ID válido existente.
     * @param isLike true para like, false para dislike.
     * @return Like La entidad Like creada o actualizada con la reacción del usuario.
     */
    @PostMapping("/dar/{videoId}/{usuarioId}/{isLike}")
    public Like darLike(@PathVariable Long videoId, @PathVariable Long usuarioId, @PathVariable boolean isLike) {
        return likeService.darLike(videoId, usuarioId, isLike);
    }

    /**
     * Endpoint para eliminar la reacción de un usuario hacia un video.
     * 
     * Permite a un usuario retirar su like o dislike de un video específico.
     * Si no existe reacción previa, la operación se ejecuta sin errores.
     * 
     * @param videoId ID del video del cual se eliminará la reacción.
     * @param usuarioId ID del usuario cuya reacción se eliminará.
     */
    @DeleteMapping("/eliminar/{videoId}/{usuarioId}")
    public void eliminarLike(@PathVariable Long videoId, @PathVariable Long usuarioId) {
        likeService.eliminarLike(videoId, usuarioId);
    }

    /**
     * Endpoint para obtener todos los likes y dislikes de un video específico.
     * 
     * @param videoId ID del video del cual se obtendrán las reacciones.
     * @return List<Like> Lista de todas las reacciones (likes y dislikes) del video.
     */
    @GetMapping("/video/{videoId}")
    public List<Like> obtenerLikesPorVideo(@PathVariable Long videoId) {
        return likeService.obtenerLikesPorVideo(videoId);
    }

    /**
     * Endpoint para obtener todos los likes y dislikes dados por un usuario.
     * 
     * @param usuarioId ID del usuario del cual se obtendrán las reacciones.
     * @return List<Like> Lista de todas las reacciones del usuario.
     */
    @GetMapping("/usuario/{usuarioId}")
    public List<Like> obtenerLikesPorUsuario(@PathVariable Long usuarioId) {
        return likeService.obtenerLikesPorUsuario(usuarioId);
    }

    /**
     * Endpoint para contar la cantidad de likes de un video.
     * 
     * @param videoId ID del video del cual se contarán los likes.
     * @return long Número total de likes (reacciones positivas) del video.
     */
    @GetMapping("/contar/likes/{videoId}")
    public long contarLikesPorVideo(@PathVariable Long videoId) {
        return likeService.contarLikesPorVideo(videoId);
    }

    /**
     * Endpoint para contar la cantidad de dislikes de un video.
     * 
     * @param videoId ID del video del cual se contarán los dislikes.
     * @return long Número total de dislikes (reacciones negativas) del video.
     */
    @GetMapping("/contar/dislikes/{videoId}")
    public long contarDislikesPorVideo(@PathVariable Long videoId) {
        return likeService.contarDislikesPorVideo(videoId);
    }

    /**
     * Endpoint para verificar si un usuario específico tiene una reacción en un video.
     * 
     * Útil para determinar el estado actual de la reacción de un usuario
     * hacia un video específico (like, dislike, o sin reacción).
     * 
     * @param videoId ID del video a verificar.
     * @param usuarioId ID del usuario cuya reacción se verificará.
     * @return Optional<Like> Optional que contiene el Like si existe, o vacío si no hay reacción.
     */
    @GetMapping("/verificar/{videoId}/{usuarioId}")
    public Optional<Like> obtenerLikeDeUsuarioEnVideo(@PathVariable Long videoId, @PathVariable Long usuarioId) {
        return likeService.obtenerLikeDeUsuarioEnVideo(videoId, usuarioId);
    }

    /**
     * Endpoint para obtener todas las reacciones del sistema.
     * 
     * Método útil para administradores o reportes que necesiten
     * acceso a todas las reacciones registradas en la plataforma.
     * 
     * @return List<Like> Lista completa de todas las reacciones en el sistema.
     */
    @GetMapping("/todos")
    public List<Like> obtenerTodosLosLikes() {
        return likeService.obtenerTodosLosLikes();
    }
}
