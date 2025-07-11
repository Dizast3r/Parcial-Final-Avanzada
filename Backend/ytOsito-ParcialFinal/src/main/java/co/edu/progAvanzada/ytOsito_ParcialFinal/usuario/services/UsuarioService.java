package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.services;

import co.edu.progAvanzada.ytOsito_ParcialFinal.notification.service.EmailService;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.repositories.UsuarioRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Servicio para la gestión de usuarios del sistema ytOsito.
 * Proporciona funcionalidades para registro, autenticación, gestión de suscripciones
 * y operaciones CRUD sobre usuarios.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Rojas Roldan
 */
@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Registra un nuevo usuario en el sistema.
     * Valida que el email y nickname sean únicos antes de crear el usuario.
     * 
     * @param usuario El usuario a registrar, debe contener todos los campos obligatorios
     * @return El usuario registrado con su ID asignado
     * @throws IllegalArgumentException Si el usuario es null
     * @throws EntityExistsException Si el email o nickname ya están en uso
     */
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Usuario no puede ser null");
        }
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new EntityExistsException("Ya existe alguien con el email: " + usuario.getEmail());
        }
        if (usuarioRepository.existsByNickname(usuario.getNickname())) {
            throw new EntityExistsException("Ese nickname ya ha sido usado por otro usuario");
        }
        emailService.enviarEmailRegistro(usuario.getEmail());
        return usuarioRepository.save(usuario);
    }

    /**
     * Elimina un usuario del sistema por su ID.
     * Elimina en cascada todos los elementos relacionados (videos, comentarios, likes).
     * 
     * @param id El ID del usuario a eliminar
     * @throws EntityNotFoundException Si no existe un usuario con el ID especificado
     */
    public void borrarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    /**
     * Busca un usuario por su nickname.
     * 
     * @param nickname El nickname del usuario a buscar
     * @return Optional que contiene el usuario si existe, vacío si no existe
     */
    public Optional<Usuario> buscarUsuarioPorNickname(String nickname) {
        return usuarioRepository.findByNickname(nickname);
    }

    /**
     * Busca un usuario por su ID.
     * 
     * @param id El ID del usuario a buscar
     * @return El usuario encontrado
     * @throws EntityNotFoundException Si no existe un usuario con el ID especificado
     */
    public Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + id));
    }

    /**
     * Obtiene todos los usuarios registrados en el sistema.
     * 
     * @return Lista de todos los usuarios
     */
    public List<Usuario> buscarTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    /**
     * Autentica un usuario con sus credenciales.
     * Valida que el nickname y password coincidan con un usuario registrado.
     * 
     * @param nickname El nickname del usuario
     * @param password La contraseña del usuario
     * @return El usuario autenticado
     * @throws EntityNotFoundException Si las credenciales son inválidas
     */
    public Usuario iniciarSesion(String nickname, String password) {
        Usuario usuario = usuarioRepository.findByNicknameAndPassword(nickname, password);
        if (usuario == null) {
            throw new EntityNotFoundException("Credenciales inválidas");
        }

        return usuario;
    }

    /**
     * Suscribe un usuario a otro usuario.
     * Crea una relación de suscripción bidireccional entre dos usuarios.
     * 
     * @param suscriptorId ID del usuario que se suscribe
     * @param suscritoId ID del usuario al que se suscribe
     * @return El usuario suscriptor actualizado con la nueva suscripción
     * @throws IllegalArgumentException Si un usuario intenta suscribirse a sí mismo
     * @throws EntityNotFoundException Si alguno de los usuarios no existe
     * @throws EntityExistsException Si la suscripción ya existe
     */
    public Usuario suscribirseAUsuario(Long suscriptorId, Long suscritoId) {
        if (suscriptorId.equals(suscritoId)) {
            throw new IllegalArgumentException("Un usuario no puede suscribirse a sí mismo");
        }

        Usuario suscriptor = usuarioRepository.findById(suscriptorId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario suscriptor no encontrado con ID: " + suscriptorId));

        Usuario suscrito = usuarioRepository.findById(suscritoId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario a suscribirse no encontrado con ID: " + suscritoId));

        if (usuarioRepository.existsSuscripcion(suscriptorId, suscritoId)) {
            throw new EntityExistsException("Ya existe una suscripción entre estos usuarios");
        }

        suscriptor.getSuscripciones().add(suscrito);
        return usuarioRepository.save(suscriptor);
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
    public Usuario desuscribirseDeUsuario(Long suscriptorId, Long suscritoId) {
        Usuario suscriptor = usuarioRepository.findById(suscriptorId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario suscriptor no encontrado con ID: " + suscriptorId));

        Usuario suscrito = usuarioRepository.findById(suscritoId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario a desuscribirse no encontrado con ID: " + suscritoId));

        if (!usuarioRepository.existsSuscripcion(suscriptorId, suscritoId)) {
            throw new EntityNotFoundException("No existe una suscripción entre estos usuarios");
        }

        suscriptor.getSuscripciones().remove(suscrito);
        return usuarioRepository.save(suscriptor);
    }

    /**
     * Obtiene la lista de usuarios a los que está suscrito un usuario.
     * 
     * @param usuarioId ID del usuario del que se quieren obtener las suscripciones
     * @return Lista de usuarios a los que está suscrito
     * @throws EntityNotFoundException Si el usuario no existe
     */
    public List<Usuario> obtenerSuscripciones(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId);
        }
        return usuarioRepository.findSuscripcionesByUsuarioId(usuarioId);
    }

    /**
     * Obtiene la lista de usuarios suscritos a un usuario.
     * 
     * @param usuarioId ID del usuario del que se quieren obtener los suscriptores
     * @return Lista de usuarios suscritos
     * @throws EntityNotFoundException Si el usuario no existe
     */
    public List<Usuario> obtenerSuscriptores(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId);
        }
        return usuarioRepository.findSuscriptoresByUsuarioId(usuarioId);
    }
    
    /**
     * Obtiene el número total de suscripciones de un usuario.
     * 
     * @param usuarioId ID del usuario
     * @return Número de usuarios a los que está suscrito
     * @throws EntityNotFoundException Si el usuario no existe
     */
    public long contarSuscripciones(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId);
        }
        return usuarioRepository.findSuscripcionesByUsuarioId(usuarioId).size();
    }

    /**
     * Obtiene el número total de suscriptores de un usuario.
     * 
     * @param usuarioId ID del usuario
     * @return Número de usuarios suscritos a este usuario
     * @throws EntityNotFoundException Si el usuario no existe
     */
    public long contarSuscriptores(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId);
        }
        return usuarioRepository.findSuscriptoresByUsuarioId(usuarioId).size();
    }

    /**
     * Verifica si un usuario está suscrito a otro usuario.
     * 
     * @param suscriptorId ID del usuario suscriptor
     * @param suscritoId ID del usuario suscrito
     * @return true si existe la suscripción, false en caso contrario
     */
    public boolean estaSuscrito(Long suscriptorId, Long suscritoId) {
        return usuarioRepository.existsSuscripcion(suscriptorId, suscritoId);
    }
}
