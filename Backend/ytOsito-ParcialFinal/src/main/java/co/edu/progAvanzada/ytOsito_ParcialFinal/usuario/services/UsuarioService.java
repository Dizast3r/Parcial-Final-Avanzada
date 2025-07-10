/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.services;

import co.edu.progAvanzada.ytOsito_ParcialFinal.email.services.EmailService;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.repositories.UsuarioRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author User
 */
@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

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
        //emailService.enviarEmailRegistro(usuario.getEmail());
        return usuarioRepository.save(usuario);
    }

    public void borrarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> buscarUsuarioPorNickname(String nickname) {
        return usuarioRepository.findByNickname(nickname);
    }

    public Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + id));
    }

    public List<Usuario> buscarTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario iniciarSesion(String nickname, String password) {
        Usuario usuario = usuarioRepository.findByNicknameAndPassword(nickname, password);
        if (usuario == null) {
            throw new EntityNotFoundException("Credenciales inválidas");
        }

        return usuario;
    }

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

    public List<Usuario> obtenerSuscripciones(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId);
        }
        return usuarioRepository.findSuscripcionesByUsuarioId(usuarioId);
    }

    public List<Usuario> obtenerSuscriptores(Long usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new EntityNotFoundException("Usuario no encontrado con ID: " + usuarioId);
        }
        return usuarioRepository.findSuscriptoresByUsuarioId(usuarioId);
    }

    public boolean estaSuscrito(Long suscriptorId, Long suscritoId) {
        return usuarioRepository.existsSuscripcion(suscriptorId, suscritoId);
    }
}
