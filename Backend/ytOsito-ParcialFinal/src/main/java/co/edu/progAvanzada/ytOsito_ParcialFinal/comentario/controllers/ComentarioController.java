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
 *
 * @author User
 */
@RestController
@RequestMapping("/comentario")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    @PostMapping("/crear")
    public Comentario crearComentario(@Valid @RequestBody Comentario comentario) {
        return comentarioService.crearComentario(comentario);
    }

    @PostMapping("/crear/{videoId}/{usuarioId}")
    public Comentario crearComentario(@PathVariable Long videoId, @PathVariable Long usuarioId, @RequestBody String comentarioTexto) {
        return comentarioService.crearComentario(videoId, usuarioId, comentarioTexto);
    }

    @GetMapping("/{id}")
    public Comentario obtenerComentarioPorId(@PathVariable Long id) {
        return comentarioService.obtenerComentarioPorId(id);
    }

    @GetMapping("/video/{videoId}")
    public List<Comentario> obtenerComentariosPorVideo(@PathVariable Long videoId) {
        return comentarioService.obtenerComentariosPorVideo(videoId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Comentario> obtenerComentariosPorUsuario(@PathVariable Long usuarioId) {
        return comentarioService.obtenerComentariosPorUsuario(usuarioId);
    }

    @GetMapping("/todos")
    public List<Comentario> obtenerTodosLosComentarios() {
        return comentarioService.obtenerTodosLosComentarios();
    }

    @DeleteMapping("/{id}")
    public void eliminarComentario(@PathVariable Long id) {
        comentarioService.eliminarComentario(id);
    }
}
