package co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.services;

import co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.entities.Comentario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.repositories.ComentarioRepository;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.repositories.UsuarioRepository;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.repositories.VideoRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author User
 */
@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VideoRepository videoRepository;

    public Comentario crearComentario(Long videoId, Long usuarioId, String comentarioTexto) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new EntityNotFoundException("Video no encontrado con ID: " + videoId));

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId));

        Comentario comentario = new Comentario();
        comentario.setComentario(comentarioTexto);
        comentario.setVideo(video);
        comentario.setUsuario(usuario);

        return comentarioRepository.save(comentario);
    }

    public Comentario crearComentario(Comentario comentario) {
        if (comentario == null) {
            throw new IllegalArgumentException("Comentario no puede ser null");
        }
        return comentarioRepository.save(comentario);
    }

    public List<Comentario> obtenerComentariosPorVideo(Long videoId) {
        return comentarioRepository.findByVideoIdOrderByFechaDeCreacionDesc(videoId);
    }

    public List<Comentario> obtenerComentariosPorUsuario(Long usuarioId) {
        return comentarioRepository.findByUsuarioId(usuarioId);
    }

    public Comentario obtenerComentarioPorId(Long id) {
        return comentarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comentario no encontrado con ID: " + id));
    }

    public List<Comentario> obtenerTodosLosComentarios() {
        return comentarioRepository.findAll();
    }

    public void eliminarComentario(Long id) {
        if (!comentarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Comentario no encontrado con ID: " + id);
        }
        comentarioRepository.deleteById(id);
    }
}
