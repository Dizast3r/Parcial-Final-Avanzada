/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.controllers;

import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.services.UsuarioService;
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
 *
 * @author User
 */
@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public Usuario registrarUsuario(@Valid@RequestBody Usuario usuario) {
        return usuarioService.registrarUsuario(usuario);
    }

    @GetMapping("/{id}")
    public Usuario obtenerUsuarioById(@Valid@PathVariable Long id) {
        return usuarioService.buscarUsuarioPorId(id);
    }

    @GetMapping("/nickname={nickname}")
    public Optional<Usuario> obtenerUsuariosPorNickname(@Valid@PathVariable String nickname) {
        return usuarioService.buscarUsuarioPorNickname(nickname);
    }
    
    @PostMapping("/login")
    public Usuario iniciarSesion(@RequestBody Usuario usuario) { //Este no tiene valid, porque o si no valida que los demas campos esten vacios y pues no hace falta, si algo se tirara error
            System.out.println("➡️ Login recibido: " + usuario.getNickname() + "/" + usuario.getPassword());
        return usuarioService.iniciarSesion(usuario.getNickname(), usuario.getPassword());
    }

    @PostMapping("/{suscriptorId}/suscribirse/{suscritoId}")
    public Usuario suscribirseAUsuario(@Valid@PathVariable Long suscriptorId, @Valid@PathVariable Long suscritoId) {
        return usuarioService.suscribirseAUsuario(suscriptorId, suscritoId);
    }

    @DeleteMapping("/{suscriptorId}/desuscribirse/{suscritoId}")
    public Usuario desuscribirseDeUsuario(@Valid@PathVariable Long suscriptorId, @Valid@PathVariable Long suscritoId) {
        return usuarioService.desuscribirseDeUsuario(suscriptorId, suscritoId);
    }

    @GetMapping("/{usuarioId}/suscripciones")
    public List<Usuario> obtenerSuscripciones(@Valid@PathVariable Long usuarioId) {
        return usuarioService.obtenerSuscripciones(usuarioId);
    }

    @GetMapping("/{usuarioId}/suscriptores")
    public List<Usuario> obtenerSuscriptores(@Valid@PathVariable Long usuarioId) {
        return usuarioService.obtenerSuscriptores(usuarioId);
    }

    @GetMapping("/{suscriptorId}/esta-suscrito/{suscritoId}")
    public boolean estaSuscrito(@Valid@PathVariable Long suscriptorId, @Valid@PathVariable Long suscritoId) {
        return usuarioService.estaSuscrito(suscriptorId, suscritoId);
    }
}
