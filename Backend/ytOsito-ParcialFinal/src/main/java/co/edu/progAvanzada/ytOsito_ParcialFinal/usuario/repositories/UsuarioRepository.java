/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.repositories;

import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author User
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    
    boolean emailAlreadyExist(String email);
    
    boolean nicknameAlreadyExist(String nickname);
    
    Optional<Usuario> findByNickname(String nickname);
}
