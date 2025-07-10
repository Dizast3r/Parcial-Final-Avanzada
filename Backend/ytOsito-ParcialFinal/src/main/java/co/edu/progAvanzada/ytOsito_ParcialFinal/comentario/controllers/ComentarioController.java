package co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.controllers;

import co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.entities.Comentario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.services.ComentarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para la gestión de comentarios en la aplicación ytOsito.
 * Proporciona endpoints para crear, consultar y eliminar comentarios,
 * así como para obtener comentarios por video, usuario o ID específico.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Roldan Rojas
 * @version 1.0
 * @since 2024
 */
@RestController
@RequestMapping("/comentario")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    /**
     * Crea un nuevo comentario a partir de un objeto Comentario completo.
     * 
     * @param comentario El objeto comentario a crear, debe ser válido según las anotaciones de validación
     * @return El comentario creado con fecha de creación establecida automáticamente
     * @throws jakarta.validation.ConstraintViolationException Si el comentario no cumple las validaciones
     */
    @PostMapping("/crear")
    public Comentario crearComentario(@Valid @RequestBody Comentario comentario) {
        return comentarioService.crearComentario(comentario);
    }

    /**
     * Crea un nuevo comentario asociado a un video y usuario específicos.
     * 
     * @param videoId El ID del video al que se asociará el comentario
     * @param usuarioId El ID del usuario que realiza el comentario
     * @param comentarioTexto El texto del comentario
     * @return El comentario creado con las relaciones establecidas
     * @throws jakarta.persistence.EntityNotFoundException Si el video o usuario no existe
     */
    @PostMapping("/crear/{videoId}/{usuarioId}")
    public Comentario crearComentario(@PathVariable Long videoId, @PathVariable Long usuarioId, @RequestBody String comentarioTexto) {
        return comentarioService.crearComentario(videoId, usuarioId, comentarioTexto);
    }

    /**
     * Obtiene un comentario específico por su ID único.
     * 
     * @param id El ID único del comentario a buscar
     * @return El comentario encontrado
     * @throws jakarta.persistence.EntityNotFoundException Si no existe un comentario con el ID proporcionado
     */
    @GetMapping("/{id}")
    public Comentario obtenerComentarioPorId(@PathVariable Long id) {
        return comentarioService.obtenerComentarioPorId(id);
    }

    /**
     * Obtiene todos los comentarios asociados a un video específico.
     * Los comentarios se devuelven ordenados por fecha de creación descendente.
     * 
     * @param videoId El ID del video del cual se quieren obtener los comentarios
     * @return Lista de comentarios del video ordenados por fecha más reciente
     */
    @GetMapping("/video/{videoId}")
    public List<Comentario> obtenerComentariosPorVideo(@PathVariable Long videoId) {
        return comentarioService.obtenerComentariosPorVideo(videoId);
    }

    /**
     * Obtiene todos los comentarios realizados por un usuario específico.
     * 
     * @param usuarioId El ID del usuario del cual se quieren obtener los comentarios
     * @return Lista de comentarios realizados por el usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public List<Comentario> obtenerComentariosPorUsuario(@PathVariable Long usuarioId) {
        return comentarioService.obtenerComentariosPorUsuario(usuarioId);
    }

    /**
     * Obtiene todos los comentarios existentes en la base de datos.
     * 
     * @return Lista completa de todos los comentarios
     */
    @GetMapping("/todos")
    public List<Comentario> obtenerTodosLosComentarios() {
        return comentarioService.obtenerTodosLosComentarios();
    }

    /**
     * Elimina un comentario específico de la base de datos.
     * 
     * @param id El ID del comentario a eliminar
     * @throws jakarta.persistence.EntityNotFoundException Si no existe un comentario con el ID proporcionado
     */
    @DeleteMapping("/{id}")
    public void eliminarComentario(@PathVariable Long id) {
        comentarioService.eliminarComentario(id);
    }
}
