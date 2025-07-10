package co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.entities;

import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
 * Entidad que representa un comentario en la aplicación ytOsito. Un comentario
 * está asociado a un video específico y es realizado por un usuario. Contiene
 * el texto del comentario y la fecha de creación que se establece
 * automáticamente.
 *
 * <p>
 * Esta entidad maneja las relaciones Many-to-One con Usuario y Video,
 * utilizando diferentes estrategias de fetch y anotaciones de Jackson para
 * controlar la serialización JSON y evitar referencias circulares.</p>
 *
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Roldan Rojas
 * @version 1.0
 * @since 2024
 */
@Entity
@Table(name = "comentario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comentario {

    /**
     * Identificador único del comentario. Se genera automáticamente mediante
     * estrategia de identidad.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Texto del comentario realizado por el usuario. Debe tener entre 1 y 300
     * caracteres y no puede estar vacío.
     */
    @NotBlank
    @Size(min = 1, max = 300)
    @Column(nullable = false, length = 300)
    private String comentario;

    /**
     * Fecha y hora en que fue creado el comentario. Se establece
     * automáticamente antes de persistir la entidad.
     */
    @Column(nullable = false)
    private LocalDateTime fechaDeCreacion;

    /**
     * Usuario que realizó el comentario. Relación Many-to-One con carga eager
     * para tener siempre disponible la información del usuario. Se excluyen
     * ciertas propiedades de la serialización JSON para evitar referencias
     * circulares.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    @JsonIgnoreProperties({
        "hibernateLazyInitializer", "handler",
        "videos", "comentarios", "videosLikeados"
    })
    private Usuario usuario;

    /**
     * Video al que pertenece el comentario. Relación Many-to-One con carga lazy
     * para optimizar el rendimiento. Se ignora completamente en la
     * serialización JSON para evitar referencias circulares.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id")
    @JsonIgnore
    private Video video;

    /**
     * Método que se ejecuta automáticamente antes de persistir la entidad.
     * Establece la fecha de creación del comentario con la fecha y hora actual.
     */
    @PrePersist
    public void prePersist() {
        this.fechaDeCreacion = LocalDateTime.now();
    }
}
