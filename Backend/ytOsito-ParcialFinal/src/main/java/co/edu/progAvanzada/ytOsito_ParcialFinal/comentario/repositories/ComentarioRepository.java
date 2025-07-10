/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.repositories;

import co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.entities.Comentario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author User
 */
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    
    List<Comentario> findByVideoId(Long videoId);
    
    List<Comentario> findByUsuarioId(Long usuarioId);
    
    List<Comentario> findByVideoIdOrderByFechaDeCreacionDesc(Long videoId);
}
