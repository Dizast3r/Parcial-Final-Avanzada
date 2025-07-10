package co.edu.progAvanzada.ytOsito_ParcialFinal.video.services;

import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.repositories.VideoRepository;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.repositories.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author User
 */
@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    public Video crearVideo(Video video) {
        if (video == null) {
            throw new IllegalArgumentException("Video no puede ser null");
        }
        return videoRepository.save(video);
    }

    public Video crearVideo(Long usuarioId, String titulo, String miniatura_src, String video_src, String descripcion) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId));
        
        Video video = new Video();
        video.setTitulo(titulo);
        video.setMiniatura_src(miniatura_src);
        video.setVideo_src(video_src);
        video.setDescripcion(descripcion);
        video.setVistas(0);
        video.setUsuario(usuario);
        
        return videoRepository.save(video);
    }

    public Video obtenerVideoPorId(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Video no encontrado con ID: " + id));
    }

    public List<Video> obtenerTodosLosVideos() {
        return videoRepository.findAll();
    }

    public Video actualizarVideo(Long id, Video videoActualizado) {
        Video video = obtenerVideoPorId(id);
        
        if (videoActualizado.getTitulo() != null) {
            video.setTitulo(videoActualizado.getTitulo());
        }
        if (videoActualizado.getMiniatura_src() != null) {
            video.setMiniatura_src(videoActualizado.getMiniatura_src());
        }
        if (videoActualizado.getVideo_src() != null) {
            video.setVideo_src(videoActualizado.getVideo_src());
        }
        if (videoActualizado.getDescripcion() != null) {
            video.setDescripcion(videoActualizado.getDescripcion());
        }
        
        return videoRepository.save(video);
    }

    public void eliminarVideo(Long id) {
        if (!videoRepository.existsById(id)) {
            throw new EntityNotFoundException("Video no encontrado con ID: " + id);
        }
        videoRepository.deleteById(id);
    }

    public Video incrementarVistas(Long id) {
        Video video = obtenerVideoPorId(id);
        video.setVistas(video.getVistas() + 1);
        return videoRepository.save(video);
    }
}
