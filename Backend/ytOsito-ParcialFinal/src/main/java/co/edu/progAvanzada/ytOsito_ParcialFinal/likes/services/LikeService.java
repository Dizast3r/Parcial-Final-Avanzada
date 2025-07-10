package co.edu.progAvanzada.ytOsito_ParcialFinal.likes.services;

import co.edu.progAvanzada.ytOsito_ParcialFinal.likes.entities.Like;
import co.edu.progAvanzada.ytOsito_ParcialFinal.likes.repositories.LikeRepository;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.repositories.UsuarioRepository;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.repositories.VideoRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Servicio para la gestión de la lógica de negocio de likes y dislikes.
 * 
 * Esta clase implementa toda la lógica de negocio relacionada con las reacciones
 * de los usuarios hacia los videos. Maneja la creación, actualización, eliminación
 * y consulta de likes/dislikes, asegurando la integridad de los datos y la
 * consistencia de las operaciones.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Rojas Roldan
 * @version 1.0
 * @since 1.0
 */
@Service
public class LikeService {

    /**
     * Repositorio para el acceso a datos de likes.
     * 
     * Se inyecta automáticamente para gestionar las operaciones
     * de persistencia de las reacciones de usuarios.
     */
    @Autowired
    private LikeRepository likeRepository;
    
    /**
     * Repositorio para el acceso a datos de usuarios.
     * 
     * Se inyecta automáticamente para validar la existencia
     * de usuarios antes de crear reacciones.
     */
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    /**
     * Repositorio para el acceso a datos de videos.
     * 
     * Se inyecta automáticamente para validar la existencia
     * de videos antes de crear reacciones.
     */
    @Autowired
    private VideoRepository videoRepository;

    /**
     * Permite a un usuario dar like o dislike a un video.
     * 
     * Este método maneja la lógica completa de reacciones:
     * - Valida que el video y usuario existan
     * - Verifica si ya existe una reacción previa
     * - Actualiza la reacción existente o crea una nueva
     * 
     * @param videoId ID del video al que se le dará la reacción.
     * @param usuarioId ID del usuario que da la reacción.
     * @param isLike true para like, false para dislike.
     * @return Like La entidad Like creada o actualizada.
     * @throws EntityNotFoundException Si el video o usuario no existen.
     */
    public Like darLike(Long videoId, Long usuarioId, boolean isLike) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new EntityNotFoundException("Video no encontrado con ID: " + videoId));
        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId));
        
        // Verificar si ya existe un like/dislike del usuario para este video
        Optional<Like> likeExistente = likeRepository.findByVideoIdAndUsuarioId(videoId, usuarioId);
        
        if (likeExistente.isPresent()) {
            // Si ya existe, actualizar el valor
            Like like = likeExistente.get();
            like.setMegusta(isLike);
            return likeRepository.save(like);
        } else {
            // Si no existe, crear uno nuevo
            Like nuevoLike = new Like();
            nuevoLike.setVideo(video);
            nuevoLike.setUsuario(usuario);
            nuevoLike.setMegusta(isLike);
            return likeRepository.save(nuevoLike);
        }
    }

    /**
     * Elimina la reacción de un usuario hacia un video específico.
     * 
     * Si no existe una reacción previa, el método se ejecuta sin errores.
     * Permite a los usuarios retirar su opinión sobre un video.
     * 
     * @param videoId ID del video del cual se eliminará la reacción.
     * @param usuarioId ID del usuario cuya reacción se eliminará.
     */
    public void eliminarLike(Long videoId, Long usuarioId) {
        Optional<Like> like = likeRepository.findByVideoIdAndUsuarioId(videoId, usuarioId);
        if (like.isPresent()) {
            likeRepository.delete(like.get());
        }
    }

    /**
     * Obtiene todas las reacciones asociadas a un video específico.
     * 
     * @param videoId ID del video del cual se obtendrán las reacciones.
     * @return List<Like> Lista de todas las reacciones (likes y dislikes) del video.
     */
    public List<Like> obtenerLikesPorVideo(Long videoId) {
        return likeRepository.findByVideoId(videoId);
    }

    /**
     * Obtiene todas las reacciones realizadas por un usuario específico.
     * 
     * @param usuarioId ID del usuario del cual se obtendrán las reacciones.
     * @return List<Like> Lista de todas las reacciones del usuario.
     */
    public List<Like> obtenerLikesPorUsuario(Long usuarioId) {
        return likeRepository.findByUsuarioId(usuarioId);
    }

    /**
     * Cuenta el número total de likes de un video específico.
     * 
     * Método eficiente que utiliza una consulta de agregación para obtener
     * solo el conteo sin cargar todas las entidades.
     * 
     * @param videoId ID del video del cual se contarán los likes.
     * @return long Número total de likes (reacciones positivas) del video.
     */
    public long contarLikesPorVideo(Long videoId) {
        return likeRepository.countByVideoIdAndMegusta(videoId, true);
    }

    /**
     * Cuenta el número total de dislikes de un video específico.
     * 
     * Método eficiente que utiliza una consulta de agregación para obtener
     * solo el conteo sin cargar todas las entidades.
     * 
     * @param videoId ID del video del cual se contarán los dislikes.
     * @return long Número total de dislikes (reacciones negativas) del video.
     */
    public long contarDislikesPorVideo(Long videoId) {
        return likeRepository.countByVideoIdAndMegusta(videoId, false);
    }

    /**
     * Obtiene la reacción específica de un usuario hacia un video.
     * 
     * Útil para verificar el estado actual de la reacción de un usuario
     * antes de mostrar la interfaz correspondiente (botón like/dislike activo).
     * 
     * @param videoId ID del video a verificar.
     * @param usuarioId ID del usuario cuya reacción se verificará.
     * @return Optional<Like> Optional que contiene el Like si existe, o vacío si no hay reacción.
     */
    public Optional<Like> obtenerLikeDeUsuarioEnVideo(Long videoId, Long usuarioId) {
        return likeRepository.findByVideoIdAndUsuarioId(videoId, usuarioId);
    }

    /**
     * Obtiene todas las reacciones registradas en el sistema.
     * 
     * Método útil para administradores o análisis que requieran
     * acceso completo a todas las reacciones de la plataforma.
     * 
     * @return List<Like> Lista completa de todas las reacciones en el sistema.
     */
    public List<Like> obtenerTodosLosLikes() {
        return likeRepository.findAll();
    }
}
