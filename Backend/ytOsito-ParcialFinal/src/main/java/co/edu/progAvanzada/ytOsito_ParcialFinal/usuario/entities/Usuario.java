package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities;

import co.edu.progAvanzada.ytOsito_ParcialFinal.comentario.entities.Comentario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.likes.entities.Like;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Entidad que representa un usuario del sistema ytOsito.
 * Extiende de Persona para heredar atributos básicos como nombre, ciudad de nacimiento, etc.
 * 
 * Implementa un sistema de suscripciones bidireccional entre usuarios, permitiendo
 * que los usuarios se suscriban entre sí y mantengan listas de videos, comentarios y likes.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Rojas Roldan
 */
@Entity
@DiscriminatorValue("USUARIO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Usuario extends Persona {

    /**
     * Nombre de usuario único en el sistema.
     * Debe tener entre 3 y 50 caracteres.
     */
    @NotBlank
    @Size(min = 3, max = 50)
    @Column(nullable = false, unique = true, length = 50)
    private String nickname;

    /**
     * Correo electrónico del usuario.
     * Debe ser una dirección de email válida y única en el sistema.
     */
    @Email
    @Column(name = "correo", nullable = false)
    private String email;

    /**
     * Contraseña del usuario con validación de seguridad.
     * Debe cumplir los siguientes requisitos:
     * - Al menos una letra minúscula
     * - Al menos una letra mayúscula
     * - Al menos un número
     * - Al menos un carácter especial (@$!%*?&)
     * - Mínimo 8 caracteres de longitud
     */
    @NotBlank
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "La contraseña debe tener al menos una mayúscula, una minúscula, un número, "
            + "un carácter especial @$!%*?& y un mínimo de 8 caracteres"
    )
    @Column(nullable = false)
    private String password;

    /**
     * Lista de videos publicados por el usuario.
     * Relación OneToMany con eliminación en cascada.
     */
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.REMOVE)
    private List<Video> videos;

    /**
     * Lista de comentarios realizados por el usuario.
     * Relación OneToMany con eliminación en cascada.
     */
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.REMOVE)
    private List<Comentario> comentarios;

    /**
     * Lista de likes dados por el usuario a diferentes videos.
     * Relación OneToMany con eliminación en cascada.
     */
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.REMOVE)
    private List<Like> videosLikeados;

    /**
     * Lista de usuarios a los que este usuario está suscrito.
     * Relación ManyToMany que utiliza una tabla intermedia "suscripciones".
     * Se ignoran ciertas propiedades en la serialización JSON para evitar recursión infinita.
     */
    @ManyToMany
    @JoinTable(
        name = "suscripciones",
        joinColumns = @JoinColumn(name = "suscriptor_id"),
        inverseJoinColumns = @JoinColumn(name = "suscrito_id")
    )
    @JsonIgnoreProperties({"suscripciones", "suscriptores", "videos", "comentarios", "videosLikeados"})
    private List<Usuario> suscripciones;

    /**
     * Lista de usuarios que están suscritos a este usuario.
     * Lado inverso de la relación ManyToMany de suscripciones.
     * Se ignoran ciertas propiedades en la serialización JSON para evitar recursión infinita.
     */
    @ManyToMany(mappedBy = "suscripciones")
    @JsonIgnoreProperties({"suscripciones", "suscriptores", "videos", "comentarios", "videosLikeados"})
    private List<Usuario> suscriptores;
}
