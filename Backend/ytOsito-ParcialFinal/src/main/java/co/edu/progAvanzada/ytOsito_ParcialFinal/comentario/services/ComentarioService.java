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
 * Servicio para la gestión de comentarios en la aplicación ytOsito.
 * Proporciona operaciones CRUD para comentarios, incluyendo creación,
 * consulta, eliminación y gestión de relaciones con usuarios y videos.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Roldan Rojas
 * @version 1.0
 * @since 2024
 */
@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VideoRepository videoRepository;

    /**
     * Crea un nuevo comentario asociado a un video y usuario específicos.
     * 
     * @param videoId       El ID del video al que se asociará el comentario
     * @param usuarioId     El ID del usuario que realiza el comentario
     * @param comentarioTexto El texto del comentario
     * @return El comentario creado con fecha de creación establecida automáticamente
     * @throws EntityNotFoundException Si el video o usuario no existe en la base de datos
     * @throws IllegalArgumentException Si alguno de los parámetros es null o inválido
     */
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

    /**
     * Crea un nuevo comentario a partir de un objeto Comentario completo.
     * 
     * @param comentario El objeto comentario a crear, debe contener todas las 
     *                   propiedades necesarias incluyendo video y usuario
     * @return El comentario guardado en la base de datos
     * @throws IllegalArgumentException Si el comentario es null
     */
    public Comentario crearComentario(Comentario comentario) {
        if (comentario == null) {
            throw new IllegalArgumentException("Comentario no puede ser null");
        }
        return comentarioRepository.save(comentario);
    }

    /**
     * Obtiene todos los comentarios asociados a un video específico.
     * Los comentarios se ordenan por fecha de creación en orden descendente
     * (más recientes primero).
     * 
     * @param videoId El ID del video del cual se quieren obtener los comentarios
     * @return Lista de comentarios del video ordenados por fecha de creación descendente
     */
    public List<Comentario> obtenerComentariosPorVideo(Long videoId) {
        return comentarioRepository.findByVideoIdOrderByFechaDeCreacionDesc(videoId);
    }

    /**
     * Obtiene todos los comentarios realizados por un usuario específico.
     * 
     * @param usuarioId El ID del usuario del cual se quieren obtener los comentarios
     * @return Lista de comentarios realizados por el usuario
     */
    public List<Comentario> obtenerComentariosPorUsuario(Long usuarioId) {
        return comentarioRepository.findByUsuarioId(usuarioId);
    }

    /**
     * Busca y obtiene un comentario específico por su ID.
     * 
     * @param id El ID único del comentario a buscar
     * @return El comentario encontrado
     * @throws EntityNotFoundException Si no existe un comentario con el ID proporcionado
     */
    public Comentario obtenerComentarioPorId(Long id) {
        return comentarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Comentario no encontrado con ID: " + id));
    }

    /**
     * Obtiene todos los comentarios existentes en la base de datos.
     * 
     * @return Lista completa de todos los comentarios
     */
    public List<Comentario> obtenerTodosLosComentarios() {
        return comentarioRepository.findAll();
    }

    /**
     * Elimina un comentario específico de la base de datos.
     * 
     * @param id El ID del comentario a eliminar
     * @throws EntityNotFoundException Si no existe un comentario con el ID proporcionado
     */
    public void eliminarComentario(Long id) {
        if (!comentarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Comentario no encontrado con ID: " + id);
        }
        comentarioRepository.deleteById(id);
    }
}
