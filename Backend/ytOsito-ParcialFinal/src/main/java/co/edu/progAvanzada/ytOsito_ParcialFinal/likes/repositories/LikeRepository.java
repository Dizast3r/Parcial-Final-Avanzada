package co.edu.progAvanzada.ytOsito_ParcialFinal.likes.repositories;

import co.edu.progAvanzada.ytOsito_ParcialFinal.likes.entities.Like;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author User
 */
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    List<Like> findByVideoId(Long videoId);
    
    List<Like> findByUsuarioId(Long usuarioId);
    
    Optional<Like> findByVideoIdAndUsuarioId(Long videoId, Long usuarioId);
    
    List<Like> findByVideoIdAndMegusta(Long videoId, boolean megusta);
    
    long countByVideoIdAndMegusta(Long videoId, boolean megusta);
}
