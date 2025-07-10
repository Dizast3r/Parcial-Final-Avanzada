/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.services;

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

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Usuario no puede ser null");
        }
        if (usuarioRepository.emailAlreadyExist(usuario.getEmail())) {
            throw new EntityExistsException("Ya existe alguien con el email: " + usuario.getEmail());
        }
        if (usuarioRepository.nicknameAlreadyExist(usuario.getNickname())) {
            throw new EntityExistsException("Ese nickname ya ha sido usado por otro usuario");
        }
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
}
