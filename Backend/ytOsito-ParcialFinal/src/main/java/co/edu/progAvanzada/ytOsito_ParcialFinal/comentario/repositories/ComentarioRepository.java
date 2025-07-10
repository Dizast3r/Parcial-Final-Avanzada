package co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.repositories;

import co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.entities.Comentario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para la gestión de persistencia de comentarios en la base de datos.
 * Extiende JpaRepository para proporcionar operaciones CRUD básicas y define
 * métodos de consulta personalizados para obtener comentarios por video y usuario.
 * 
 * <p>Utiliza Spring Data JPA para generar automáticamente las implementaciones
 * de los métodos de consulta basados en las convenciones de nomenclatura.</p>
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Roldan Rojas
 * @version 1.0
 * @since 2024
 */
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    
    /**
     * Busca todos los comentarios asociados a un video específico.
     * 
     * @param videoId El ID del video del cual se quieren obtener los comentarios
     * @return Lista de comentarios del video especificado
     */
    List<Comentario> findByVideoId(Long videoId);
    
    /**
     * Busca todos los comentarios realizados por un usuario específico.
     * 
     * @param usuarioId El ID del usuario del cual se quieren obtener los comentarios
     * @return Lista de comentarios realizados por el usuario especificado
     */
    List<Comentario> findByUsuarioId(Long usuarioId);
    
    /**
     * Busca todos los comentarios asociados a un video específico
     * y los ordena por fecha de creación en orden descendente (más recientes primero).
     * 
     * @param videoId El ID del video del cual se quieren obtener los comentarios
     * @return Lista de comentarios del video ordenados por fecha de creación descendente
     */
    List<Comentario> findByVideoIdOrderByFechaDeCreacionDesc(Long videoId);
}
