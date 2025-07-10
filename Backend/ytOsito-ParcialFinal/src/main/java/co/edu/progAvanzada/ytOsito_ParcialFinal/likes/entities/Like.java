package co.edu.progAvanzada.ytOsito_ParcialFinal.likes.entities;

import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad que representa una reacción (like o dislike) de un usuario hacia un video.
 * 
 * Esta clase modela la relación entre usuarios y videos a través de reacciones,
 * permitiendo que los usuarios expresen su opinión sobre el contenido.
 * Cada reacción incluye información sobre el tipo (like/dislike), fecha y
 * las entidades relacionadas (usuario y video).
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Rojas Roldan
 * @version 1.0
 * @since 1.0
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "likes")
@JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id"
)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Like {
    
    /**
     * Identificador único de la reacción.
     * 
     * Este campo es generado automáticamente por la base de datos
     * utilizando una estrategia de identidad auto-incremental.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Tipo de reacción del usuario.
     * 
     * Campo booleano que determina si la reacción es positiva o negativa:
     * - true: Like (reacción positiva)
     * - false: Dislike (reacción negativa)
     */
    @Column(nullable = false)
    private boolean megusta; //Dislike = false, Like = true;
    
    /**
     * Fecha y hora en que se registró la reacción.
     * 
     * Este campo se establece automáticamente cuando se crea la reacción
     * y registra el momento exacto en que el usuario expresó su opinión.
     */
    @Column
    private LocalDateTime diaLike;
    
    /**
     * Video al que se le dio la reacción.
     * 
     * Relación muchos-a-uno con la entidad Video. Un video puede tener
     * múltiples reacciones, pero cada reacción pertenece a un solo video.
     * Se utiliza carga lazy para optimizar el rendimiento.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    private Video video;
    
    /**
     * Usuario que dio la reacción.
     * 
     * Relación muchos-a-uno con la entidad Usuario. Un usuario puede dar
     * múltiples reacciones, pero cada reacción pertenece a un solo usuario.
     * Se utiliza carga lazy para optimizar el rendimiento.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    private Usuario usuario;
    
    /**
     * Método ejecutado antes de persistir la entidad.
     * 
     * Este método se ejecuta automáticamente antes de que JPA persista
     * la entidad en la base de datos. Establece la fecha de creación
     * de la reacción con la fecha y hora actual del sistema.
     */
    @PrePersist
    public void prePersist() {
        diaLike = LocalDateTime.now();
    }
}

