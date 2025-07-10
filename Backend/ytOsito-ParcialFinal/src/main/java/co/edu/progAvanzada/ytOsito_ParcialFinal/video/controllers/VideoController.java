package co.edu.progAvanzada.ytOsito_ParcialFinal.video.controllers;

import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.services.VideoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author User
 */
@RestController
@RequestMapping("/video")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @PostMapping("/crear")
    public Video crearVideo(@Valid @RequestBody Video video) {
        return videoService.crearVideo(video);
    }

    @PostMapping("/crear/{usuarioId}")
    public Video crearVideo(@PathVariable Long usuarioId, 
                           @RequestBody String titulo, 
                           @RequestBody String miniatura_src, 
                           @RequestBody String video_src, 
                           @RequestBody String descripcion) {
        return videoService.crearVideo(usuarioId, titulo, miniatura_src, video_src, descripcion);
    }

    @GetMapping("/{id}")
    public Video obtenerVideoPorId(@PathVariable Long id) {
        return videoService.obtenerVideoPorId(id);
    }

    @GetMapping("/todos")
    public List<Video> obtenerTodosLosVideos() {
        return videoService.obtenerTodosLosVideos();
    }

    @PutMapping("/actualizar/{id}")
    public Video actualizarVideo(@PathVariable Long id, @Valid @RequestBody Video video) {
        return videoService.actualizarVideo(id, video);
    }

    @DeleteMapping("/{id}")
    public void eliminarVideo(@PathVariable Long id) {
        videoService.eliminarVideo(id);
    }

    @PostMapping("/incrementar-vistas/{id}")
    public Video incrementarVistas(@PathVariable Long id) {
        return videoService.incrementarVistas(id);
    }
}
