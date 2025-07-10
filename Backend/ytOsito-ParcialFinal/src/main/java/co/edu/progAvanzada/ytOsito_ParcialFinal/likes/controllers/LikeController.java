package co.edu.progAvanzada.ytOsito_ParcialFinal.likes.controllers;

import co.edu.progAvanzada.ytOsito_ParcialFinal.likes.entities.Like;
import co.edu.progAvanzada.ytOsito_ParcialFinal.likes.services.LikeService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author User
 */
@RestController
@RequestMapping("/like")
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/dar/{videoId}/{usuarioId}/{isLike}")
    public Like darLike(@PathVariable Long videoId, @PathVariable Long usuarioId, @PathVariable boolean isLike) {
        return likeService.darLike(videoId, usuarioId, isLike);
    }

    @DeleteMapping("/eliminar/{videoId}/{usuarioId}")
    public void eliminarLike(@PathVariable Long videoId, @PathVariable Long usuarioId) {
        likeService.eliminarLike(videoId, usuarioId);
    }

    @GetMapping("/video/{videoId}")
    public List<Like> obtenerLikesPorVideo(@PathVariable Long videoId) {
        return likeService.obtenerLikesPorVideo(videoId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Like> obtenerLikesPorUsuario(@PathVariable Long usuarioId) {
        return likeService.obtenerLikesPorUsuario(usuarioId);
    }

    @GetMapping("/contar/likes/{videoId}")
    public long contarLikesPorVideo(@PathVariable Long videoId) {
        return likeService.contarLikesPorVideo(videoId);
    }

    @GetMapping("/contar/dislikes/{videoId}")
    public long contarDislikesPorVideo(@PathVariable Long videoId) {
        return likeService.contarDislikesPorVideo(videoId);
    }

    @GetMapping("/verificar/{videoId}/{usuarioId}")
    public Optional<Like> obtenerLikeDeUsuarioEnVideo(@PathVariable Long videoId, @PathVariable Long usuarioId) {
        return likeService.obtenerLikeDeUsuarioEnVideo(videoId, usuarioId);
    }

    @GetMapping("/todos")
    public List<Like> obtenerTodosLosLikes() {
        return likeService.obtenerTodosLosLikes();
    }
}
