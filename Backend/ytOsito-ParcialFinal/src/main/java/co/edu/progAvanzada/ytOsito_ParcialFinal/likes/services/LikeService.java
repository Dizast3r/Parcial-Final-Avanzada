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
 *
 * @author User
 */
@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private VideoRepository videoRepository;

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

    public void eliminarLike(Long videoId, Long usuarioId) {
        Optional<Like> like = likeRepository.findByVideoIdAndUsuarioId(videoId, usuarioId);
        if (like.isPresent()) {
            likeRepository.delete(like.get());
        }
    }

    public List<Like> obtenerLikesPorVideo(Long videoId) {
        return likeRepository.findByVideoId(videoId);
    }

    public List<Like> obtenerLikesPorUsuario(Long usuarioId) {
        return likeRepository.findByUsuarioId(usuarioId);
    }

    public long contarLikesPorVideo(Long videoId) {
        return likeRepository.countByVideoIdAndMegusta(videoId, true);
    }

    public long contarDislikesPorVideo(Long videoId) {
        return likeRepository.countByVideoIdAndMegusta(videoId, false);
    }

    public Optional<Like> obtenerLikeDeUsuarioEnVideo(Long videoId, Long usuarioId) {
        return likeRepository.findByVideoIdAndUsuarioId(videoId, usuarioId);
    }

    public List<Like> obtenerTodosLosLikes() {
        return likeRepository.findAll();
    }
}
