package co.edu.progAvanzada.ytOsito_ParcialFinal.video.repositories;

import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author User
 */
public interface VideoRepository extends JpaRepository<Video, Long> {
    
    // Buscar videos por usuario
    List<Video> findByUsuarioId(Long usuarioId);
    
    // Buscar videos por título (contiene)
    List<Video> findByTituloContainingIgnoreCase(String titulo);
    
    // Buscar videos ordenados por fecha de creación (más recientes primero)
    List<Video> findAllByOrderByFechaDeCreacionDesc();
    
    // Buscar videos ordenados por vistas (más vistos primero)
    List<Video> findAllByOrderByVistasDesc();
    
    // Buscar videos con más de X vistas
    List<Video> findByVistasGreaterThan(int vistas);
    
    // Buscar videos de un usuario ordenados por fecha
    List<Video> findByUsuarioIdOrderByFechaDeCreacionDesc(Long usuarioId);
    
    // Buscar videos de un usuario ordenados por vistas
    List<Video> findByUsuarioIdOrderByVistasDesc(Long usuarioId);
    
}