package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.controllers;

import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.services.UsuarioService;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para la gestión de usuarios del sistema ytOsito.
 * Proporciona endpoints para operaciones CRUD, autenticación y gestión de suscripciones.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Rojas Roldan
 */
@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Registra un nuevo usuario en el sistema.
     * 
     * @param usuario Datos del usuario a registrar (JSON en el cuerpo de la petición)
     * @return El usuario registrado con su ID asignado
     * @throws EntityExistsException Si el email o nickname ya están en uso
     * @throws IllegalArgumentException Si los datos del usuario son inválidos
     */
    @PostMapping("/registro")
    public Usuario registrarUsuario(@Valid @RequestBody Usuario usuario) {
        return usuarioService.registrarUsuario(usuario);
    }

    /**
     * Obtiene un usuario por su ID.
     * 
     * @param id ID del usuario a buscar
     * @return El usuario encontrado
     * @throws EntityNotFoundException Si no existe un usuario con el ID especificado
     */
    @GetMapping("/{id}")
    public Usuario obtenerUsuarioById(@Valid @PathVariable Long id) {
        return usuarioService.buscarUsuarioPorId(id);
    }

    /**
     * Busca un usuario por su nickname.
     * 
     * @param nickname Nickname del usuario a buscar
     * @return Optional que contiene el usuario si existe, vacío si no existe
     */
    @GetMapping("/nickname={nickname}")
    public Optional<Usuario> obtenerUsuariosPorNickname(@Valid @PathVariable String nickname) {
        return usuarioService.buscarUsuarioPorNickname(nickname);
    }
    
    /**
     * Autentica un usuario en el sistema.
     * No utiliza @Valid para permitir que solo se envíen nickname y password.
     * 
     * @param usuario Objeto que contiene nickname y password para autenticación
     * @return El usuario autenticado
     * @throws EntityNotFoundException Si las credenciales son inválidas
     */
    @PostMapping("/login")
    public Usuario iniciarSesion(@RequestBody Usuario usuario) {
        // Este endpoint no tiene @Valid porque no necesita validar que los demás campos estén completos
        return usuarioService.iniciarSesion(usuario.getNickname(), usuario.getPassword());
    }

    /**
     * Suscribe un usuario a otro usuario.
     * Crea una relación de suscripción bidireccional.
     * 
     * @param suscriptorId ID del usuario que se suscribe
     * @param suscritoId ID del usuario al que se suscribe
     * @return El usuario suscriptor actualizado con la nueva suscripción
     * @throws IllegalArgumentException Si un usuario intenta suscribirse a sí mismo
     * @throws EntityNotFoundException Si alguno de los usuarios no existe
     * @throws EntityExistsException Si la suscripción ya existe
     */
    @PostMapping("/{suscriptorId}/suscribirse/{suscritoId}")
    public Usuario suscribirseAUsuario(@Valid @PathVariable Long suscriptorId, @Valid @PathVariable Long suscritoId) {
        return usuarioService.suscribirseAUsuario(suscriptorId, suscritoId);
    }

    /**
     * Desuscribe un usuario de otro usuario.
     * Elimina la relación de suscripción entre dos usuarios.
     * 
     * @param suscriptorId ID del usuario que se desuscribe
     * @param suscritoId ID del usuario del que se desuscribe
     * @return El usuario suscriptor actualizado sin la suscripción
     * @throws EntityNotFoundException Si alguno de los usuarios no existe o no hay suscripción
     */
    @DeleteMapping("/{suscriptorId}/desuscribirse/{suscritoId}")
    public Usuario desuscribirseDeUsuario(@Valid @PathVariable Long suscriptorId, @Valid @PathVariable Long suscritoId) {
        return usuarioService.desuscribirseDeUsuario(suscriptorId, suscritoId);
    }

    /**
     * Obtiene la lista de usuarios a los que está suscrito un usuario.
     * 
     * @param usuarioId ID del usuario del que se quieren obtener las suscripciones
     * @return Lista de usuarios a los que está suscrito
     * @throws EntityNotFoundException Si el usuario no existe
     */
    @GetMapping("/{usuarioId}/suscripciones")
    public List<Usuario> obtenerSuscripciones(@Valid @PathVariable Long usuarioId) {
        return usuarioService.obtenerSuscripciones(usuarioId);
    }

    /**
     * Obtiene la lista de usuarios suscritos a un usuario.
     * 
     * @param usuarioId ID del usuario del que se quieren obtener los suscriptores
     * @return Lista de usuarios suscritos
     * @throws EntityNotFoundException Si el usuario no existe
     */
    @GetMapping("/{usuarioId}/suscriptores")
    public List<Usuario> obtenerSuscriptores(@Valid @PathVariable Long usuarioId) {
        return usuarioService.obtenerSuscriptores(usuarioId);
    }

    /**
     * Verifica si un usuario está suscrito a otro usuario.
     * 
     * @param suscriptorId ID del usuario suscriptor
     * @param suscritoId ID del usuario suscrito
     * @return true si existe la suscripción, false en caso contrario
     */
    @GetMapping("/{suscriptorId}/esta-suscrito/{suscritoId}")
    public boolean estaSuscrito(@Valid @PathVariable Long suscriptorId, @Valid @PathVariable Long suscritoId) {
        return usuarioService.estaSuscrito(suscriptorId, suscritoId);
    }
    
    /**
     * Obtiene el número total de suscripciones de un usuario.
     * 
     * @param usuarioId ID del usuario del que se quiere obtener el número de suscripciones
     * @return Número de usuarios a los que está suscrito
     * @throws EntityNotFoundException Si el usuario no existe
     */
    @GetMapping("/{usuarioId}/suscripciones/count")
    public long contarSuscripciones(@Valid @PathVariable Long usuarioId) {
        return usuarioService.contarSuscripciones(usuarioId);
    }

    /**
     * Obtiene el número total de suscriptores de un usuario.
     * 
     * @param usuarioId ID del usuario del que se quiere obtener el número de suscriptores
     * @return Número de usuarios suscritos a este usuario
     * @throws EntityNotFoundException Si el usuario no existe
     */
    @GetMapping("/{usuarioId}/suscriptores/count")
    public long contarSuscriptores(@Valid @PathVariable Long usuarioId) {
        return usuarioService.contarSuscriptores(usuarioId);
    }
    
    /**
     * Obtiene la lista de videos que le gustan a un usuario.
     * 
     * @param usuarioId ID del usuario del que se quieren obtener los videos que le gustan
     * @return Lista de videos que le gustan al usuario
     * @throws EntityNotFoundException Si el usuario no existe
     */
    @GetMapping("/{usuarioId}/videos-que-me-gustan")
    public List<Video> obtenerVideosQueMeGustan(@Valid @PathVariable Long usuarioId) {
        return usuarioService.obtenerVideosQueMeGustan(usuarioId);
    }
}
