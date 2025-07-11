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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para la gestión de videos.
 * Proporciona endpoints para crear, obtener, actualizar y eliminar videos,
 * así como para incrementar el contador de vistas.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Roldan Rojas
 * @version 1.0
 * @since 2024
 */
@RestController
@RequestMapping("/video")
public class VideoController {

    /**
     * Servicio para la gestión de operaciones de video.
     */
    @Autowired
    private VideoService videoService;

    /**
     * Crea un nuevo video.
     * 
     * @param video el objeto Video a crear, debe ser válido según las validaciones JPA
     * @return el Video creado con su ID generado
     */
    @PostMapping("/crear")
    public Video crearVideo(@Valid @RequestBody Video video) {
        return videoService.crearVideo(video);
    }

    /**
     * Crea un nuevo video asociado a un usuario específico.
     * 
     * @param usuarioId el ID del usuario propietario del video
     * @param titulo el título del video
     * @param miniatura_src la URL de la miniatura del video
     * @param video_src la URL del archivo de video
     * @param descripcion la descripción del video
     * @return el Video creado
     */
    @PostMapping("/crear/{usuarioId}")
    public Video crearVideo(@PathVariable Long usuarioId, 
                           @RequestParam String titulo, 
                           @RequestParam String miniatura_src, 
                           @RequestParam String video_src, 
                           @RequestParam String descripcion) {
        return videoService.crearVideo(usuarioId, titulo, miniatura_src, video_src, descripcion);
    }

    /**
     * Obtiene un video por su identificador único.
     * 
     * @param id el ID del video a buscar
     * @return el Video encontrado
     */
    @GetMapping("/{id}")
    public Video obtenerVideoPorId(@PathVariable Long id) {
        return videoService.obtenerVideoPorId(id);
    }

    /**
     * Obtiene todos los videos existentes en el sistema.
     * 
     * @return una lista con todos los videos registrados
     */
    @GetMapping("/todos")
    public List<Video> obtenerTodosLosVideos() {
        return videoService.obtenerTodosLosVideos();
    }

    /**
     * Actualiza los datos de un video existente.
     * 
     * @param id el ID del video a actualizar
     * @param video el objeto Video con los nuevos datos, debe ser válido según las validaciones JPA
     * @return el Video actualizado
     */
    @PutMapping("/actualizar/{id}")
    public Video actualizarVideo(@PathVariable Long id, @Valid @RequestBody Video video) {
        return videoService.actualizarVideo(id, video);
    }

    /**
     * Elimina un video del sistema.
     * 
     * @param id el ID del video a eliminar
     */
    @DeleteMapping("/{id}")
    public void eliminarVideo(@PathVariable Long id) {
        videoService.eliminarVideo(id);
    }

    /**
     * Incrementa el contador de vistas de un video en una unidad.
     * 
     * @param id el ID del video al que se le incrementarán las vistas
     * @return el Video con el contador de vistas actualizado
     */
    @PostMapping("/incrementar-vistas/{id}")
    public Video incrementarVistas(@PathVariable Long id) {
        return videoService.incrementarVistas(id);
    }
    
    /**
     * Busca videos cuyo título contenga la cadena especificada (ignorando mayúsculas/minúsculas).
     * 
     * @param titulo la cadena a buscar en el título del video
     * @return una lista de videos que contienen la cadena en el título
     */
    @GetMapping("/buscar")
    public List<Video> buscarVideosPorTitulo(@RequestParam String titulo) {
        return videoService.buscarVideosPorTitulo(titulo);
    }
    
    /**
     * Obtiene todos los videos de un usuario específico.
     * 
     * @param usuarioId el ID del usuario del cual se quieren obtener los videos
     * @return una lista de videos del usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public List<Video> obtenerVideosPorUsuario(@PathVariable Long usuarioId) {
        return videoService.obtenerVideosPorUsuario(usuarioId);
    }
}
