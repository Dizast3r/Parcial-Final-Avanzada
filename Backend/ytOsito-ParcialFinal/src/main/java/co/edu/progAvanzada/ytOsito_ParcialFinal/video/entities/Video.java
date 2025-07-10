package co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities;

import co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.entities.Comentario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.likes.entities.Like;
import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa un video en el sistema.
 * Contiene toda la información relacionada con un video, incluyendo
 * metadatos, relaciones con usuarios, comentarios y likes.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Roldan Rojas
 * @version 1.0
 * @since 2024
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "video")
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Video {

    /**
     * Identificador único del video.
     * Se genera automáticamente usando una estrategia de identidad.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Título del video.
     * Debe ser único, no nulo, no vacío y tener entre 1 y 50 caracteres.
     */
    @NotNull
    @NotBlank
    @Size(min = 1, max = 50)
    @Column(nullable = false, length = 50)
    private String titulo;

    /**
     * URL de la miniatura del video.
     * Debe ser no nula, no vacía y puede tener hasta 300 caracteres.
     */
    @NotNull
    @NotBlank
    @Column(nullable = false, length = 300)
    private String miniatura_src;

    /**
     * URL del archivo de video.
     * Debe ser no nula, no vacía y puede tener hasta 300 caracteres.
     */
    @NotNull
    @NotBlank
    @Column(nullable = false, length = 300)
    private String video_src;

    /**
     * Descripción del video.
     * Debe ser no nula, no vacía y tener entre 1 y 400 caracteres.
     */
    @NotNull
    @NotBlank
    @Size(min = 1, max = 400)
    @Column(nullable = false, length = 400)
    private String Descripcion;

    /**
     * Número de vistas del video.
     * Se inicializa en 0 y se incrementa cada vez que se reproduce el video.
     */
    @Column()
    private int vistas;

    /**
     * Fecha y hora de creación del video.
     * Se establece automáticamente cuando se persiste la entidad.
     */
    @Column(nullable = false)
    private LocalDateTime fechaDeCreacion;

    /**
     * Usuario propietario del video.
     * Relación muchos-a-uno con la entidad Usuario.
     * Se carga de forma lazy para optimizar el rendimiento.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @JsonIgnoreProperties({
        "videos", "comentarios", "videosLikeados",
        "suscripciones", "suscriptores",
        "password", "email"
    })
    private Usuario usuario;

    /**
     * Lista de comentarios asociados al video.
     * Relación uno-a-muchos con la entidad Comentario.
     * Los comentarios se eliminan en cascada cuando se elimina el video.
     */
    @OneToMany(mappedBy = "video", cascade = CascadeType.REMOVE)
    private List<Comentario> comentarios;

    /**
     * Lista de likes asociados al video.
     * Relación uno-a-muchos con la entidad Like.
     * Los likes se eliminan en cascada cuando se elimina el video.
     */
    @OneToMany(mappedBy = "video", cascade = CascadeType.REMOVE)
    private List<Like> likes;

    /**
     * Método ejecutado automáticamente antes de persistir la entidad.
     * Establece la fecha de creación al momento actual.
     */
    @PrePersist
    public void prePersist() {
        fechaDeCreacion = LocalDateTime.now();
    }
}
