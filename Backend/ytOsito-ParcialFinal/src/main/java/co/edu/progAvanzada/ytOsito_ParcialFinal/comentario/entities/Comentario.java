/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.entities;

import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author User
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comentario")
public class Comentario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(min = 1, max = 50)
    @Column(nullable = false, length = 50)
    private String comentario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Video video;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Usuario usuario;
    
    @Column(nullable = false)
    private LocalDateTime fechaDeCreacion;
    
    @PrePersist
    public void prePersist() {
        fechaDeCreacion = LocalDateTime.now();
    }
}
