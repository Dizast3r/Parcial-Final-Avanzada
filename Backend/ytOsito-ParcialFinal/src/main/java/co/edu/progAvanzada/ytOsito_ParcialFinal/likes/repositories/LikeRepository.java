package co.edu.progAvanzada.ytOsito_ParcialFinal.likes.repositories;

import co.edu.progAvanzada.ytOsito_ParcialFinal.likes.entities.Like;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para el acceso a datos de la entidad Like.
 * 
 * Esta interfaz extiende JpaRepository para proporcionar operaciones CRUD
 * básicas y define métodos de consulta personalizados para obtener likes
 * basados en diferentes criterios como video, usuario, y tipo de reacción.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Rojas Roldan
 * @version 1.0
 * @since 1.0
 */
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    /**
     * Busca todas las reacciones asociadas a un video específico.
     * 
     * @param videoId ID del video del cual se obtendrán las reacciones.
     * @return List<Like> Lista de todas las reacciones (likes y dislikes) del video.
     */
    List<Like> findByVideoId(Long videoId);
    
    /**
     * Busca todas las reacciones realizadas por un usuario específico.
     * 
     * @param usuarioId ID del usuario del cual se obtendrán las reacciones.
     * @return List<Like> Lista de todas las reacciones del usuario.
     */
    List<Like> findByUsuarioId(Long usuarioId);
    
    /**
     * Busca una reacción específica de un usuario hacia un video.
     * 
     * Útil para verificar si un usuario ya tiene una reacción hacia un video
     * específico antes de crear una nueva o para actualizar una existente.
     * 
     * @param videoId ID del video.
     * @param usuarioId ID del usuario.
     * @return Optional<Like> Optional que contiene el Like si existe, o vacío si no existe.
     */
    Optional<Like> findByVideoIdAndUsuarioId(Long videoId, Long usuarioId);
    
    /**
     * Busca todas las reacciones de un video filtradas por tipo.
     * 
     * Permite obtener específicamente los likes o dislikes de un video
     * según el valor del parámetro megusta.
     * 
     * @param videoId ID del video.
     * @param megusta true para obtener likes, false para obtener dislikes.
     * @return List<Like> Lista de reacciones del tipo especificado.
     */
    List<Like> findByVideoIdAndMegusta(Long videoId, boolean megusta);
    
    /**
     * Cuenta las reacciones de un video filtradas por tipo.
     * 
     * Método eficiente para obtener el número total de likes o dislikes
     * de un video sin necesidad de cargar todas las entidades.
     * 
     * @param videoId ID del video.
     * @param megusta true para contar likes, false para contar dislikes.
     * @return long Número total de reacciones del tipo especificado.
     */
    long countByVideoIdAndMegusta(Long videoId, boolean megusta);
}
