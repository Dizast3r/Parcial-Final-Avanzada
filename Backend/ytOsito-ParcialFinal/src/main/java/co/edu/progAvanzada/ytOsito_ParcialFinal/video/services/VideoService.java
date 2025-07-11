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
 * Servicio para la gestión de operaciones relacionadas con videos.
 * Proporciona funcionalidades para crear, obtener, actualizar y eliminar videos,
 * así como para gestionar las vistas de los videos.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Roldan Rojas
 * @version 1.0
 * @since 2024
 */
@Service
public class VideoService {

    /**
     * Repositorio para operaciones de acceso a datos de videos.
     */
    @Autowired
    private VideoRepository videoRepository;
    
    /**
     * Repositorio para operaciones de acceso a datos de usuarios.
     */
    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Crea un nuevo video en el sistema.
     * 
     * @param video el objeto Video a crear, no puede ser null
     * @return el Video creado con su ID generado
     * @throws IllegalArgumentException si el video es null
     */
    public Video crearVideo(Video video) {
        if (video == null) {
            throw new IllegalArgumentException("Video no puede ser null");
        }
        return videoRepository.save(video);
    }

    /**
     * Crea un nuevo video asociado a un usuario específico.
     * 
     * @param usuarioId el ID del usuario propietario del video
     * @param titulo el título del video
     * @param miniatura_src la URL de la miniatura del video
     * @param video_src la URL del archivo de video
     * @param descripcion la descripción del video
     * @return el Video creado con todos sus datos inicializados
     * @throws EntityNotFoundException si no se encuentra el usuario con el ID especificado
     */
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

    /**
     * Obtiene un video por su identificador único.
     * 
     * @param id el ID del video a buscar
     * @return el Video encontrado
     * @throws EntityNotFoundException si no se encuentra el video con el ID especificado
     */
    public Video obtenerVideoPorId(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Video no encontrado con ID: " + id));
    }

    /**
     * Obtiene todos los videos existentes en el sistema.
     * 
     * @return una lista con todos los videos registrados
     */
    public List<Video> obtenerTodosLosVideos() {
        return videoRepository.findAll();
    }

    /**
     * Actualiza los datos de un video existente.
     * Solo actualiza los campos que no sean null en el objeto videoActualizado.
     * 
     * @param id el ID del video a actualizar
     * @param videoActualizado el objeto Video con los nuevos datos
     * @return el Video actualizado
     * @throws EntityNotFoundException si no se encuentra el video con el ID especificado
     */
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

    /**
     * Elimina un video del sistema.
     * 
     * @param id el ID del video a eliminar
     * @throws EntityNotFoundException si no se encuentra el video con el ID especificado
     */
    public void eliminarVideo(Long id) {
        if (!videoRepository.existsById(id)) {
            throw new EntityNotFoundException("Video no encontrado con ID: " + id);
        }
        videoRepository.deleteById(id);
    }

    /**
     * Incrementa el contador de vistas de un video en una unidad.
     * 
     * @param id el ID del video al que se le incrementarán las vistas
     * @return el Video con el contador de vistas actualizado
     * @throws EntityNotFoundException si no se encuentra el video con el ID especificado
     */
    public Video incrementarVistas(Long id) {
        Video video = obtenerVideoPorId(id);
        video.setVistas(video.getVistas() + 1);
        return videoRepository.save(video);
    }
    
    /**
     * Busca videos cuyo título contenga la cadena especificada (ignorando mayúsculas/minúsculas).
     * 
     * @param titulo la cadena a buscar en el título del video
     * @return una lista de videos que contienen la cadena en el título
     */
    public List<Video> buscarVideosPorTitulo(String titulo) {
        return videoRepository.findByTituloContainingIgnoreCase(titulo);
    }
}
