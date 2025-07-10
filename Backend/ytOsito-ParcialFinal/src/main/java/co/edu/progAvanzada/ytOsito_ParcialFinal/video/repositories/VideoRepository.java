package co.edu.progAvanzada.ytOsito_ParcialFinal.video.repositories;

import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para operaciones de acceso a datos de videos.
 * Extiende JpaRepository para proporcionar operaciones CRUD básicas
 * y define consultas personalizadas para búsquedas específicas.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Roldan Rojas
 * @version 1.0
 * @since 2024
 */
public interface VideoRepository extends JpaRepository<Video, Long> {
    
    /**
     * Busca todos los videos que pertenecen a un usuario específico.
     * 
     * @param usuarioId el ID del usuario propietario de los videos
     * @return una lista de videos del usuario especificado
     */
    List<Video> findByUsuarioId(Long usuarioId);
    
    /**
     * Busca videos cuyo título contenga la cadena especificada (ignorando mayúsculas/minúsculas).
     * 
     * @param titulo la cadena a buscar en el título del video
     * @return una lista de videos que contienen la cadena en el título
     */
    List<Video> findByTituloContainingIgnoreCase(String titulo);
    
    /**
     * Obtiene todos los videos ordenados por fecha de creación descendente.
     * Los videos más recientes aparecen primero.
     * 
     * @return una lista de videos ordenados por fecha de creación (más recientes primero)
     */
    List<Video> findAllByOrderByFechaDeCreacionDesc();
    
    /**
     * Obtiene todos los videos ordenados por número de vistas descendente.
     * Los videos más vistos aparecen primero.
     * 
     * @return una lista de videos ordenados por vistas (más vistos primero)
     */
    List<Video> findAllByOrderByVistasDesc();
    
    /**
     * Busca videos que tienen más vistas que el número especificado.
     * 
     * @param vistas el número mínimo de vistas (exclusivo)
     * @return una lista de videos con más vistas que el número especificado
     */
    List<Video> findByVistasGreaterThan(int vistas);
    
    /**
     * Busca videos de un usuario específico ordenados por fecha de creación descendente.
     * 
     * @param usuarioId el ID del usuario propietario de los videos
     * @return una lista de videos del usuario ordenados por fecha de creación (más recientes primero)
     */
    List<Video> findByUsuarioIdOrderByFechaDeCreacionDesc(Long usuarioId);
    
    /**
     * Busca videos de un usuario específico ordenados por número de vistas descendente.
     * 
     * @param usuarioId el ID del usuario propietario de los videos
     * @return una lista de videos del usuario ordenados por vistas (más vistos primero)
     */
    List<Video> findByUsuarioIdOrderByVistasDesc(Long usuarioId);
    
}