/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.repositories;

import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author User
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    
    boolean existsByEmail(String email);
    
    boolean existsByNickname(String nickname);
    
    Optional<Usuario> findByNickname(String nickname);
    
    Usuario findByNicknameAndPassword(String nickname, String password);
    
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u JOIN u.suscripciones s WHERE u.id = :suscriptorId AND s.id = :suscritoId")
    boolean existsSuscripcion(@Param("suscriptorId") Long suscriptorId, @Param("suscritoId") Long suscritoId);
    
    @Query("SELECT u.suscripciones FROM Usuario u WHERE u.id = :usuarioId")
    List<Usuario> findSuscripcionesByUsuarioId(@Param("usuarioId") Long usuarioId);
    
    @Query("SELECT u.suscriptores FROM Usuario u WHERE u.id = :usuarioId")
    List<Usuario> findSuscriptoresByUsuarioId(@Param("usuarioId") Long usuarioId);
}