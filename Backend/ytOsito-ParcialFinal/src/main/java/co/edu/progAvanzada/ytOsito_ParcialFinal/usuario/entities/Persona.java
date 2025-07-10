package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase entidad que representa una persona en el sistema.
 * 
 * Esta clase sirve como entidad base para diferentes tipos de personas
 * en el sistema, utilizando herencia JPA con estrategia JOINED.
 * Contiene la información básica común a todas las personas.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Rojas Roldan
 * @version 1.0
 * @since 1.0
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "tipo_persona")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "persona")
public class Persona {

    /**
     * Identificador único de la persona.
     * 
     * Este campo es generado automáticamente por la base de datos
     * utilizando una estrategia de identidad auto-incremental.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre de la persona.
     * 
     * Campo obligatorio que debe contener el nombre completo de la persona.
     * Tiene una longitud máxima de 50 caracteres y no puede estar vacío.
     */
    @NotNull
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String nombre;

    /**
     * Ciudad de nacimiento de la persona.
     * 
     * Campo obligatorio que indica la ciudad donde nació la persona.
     * Tiene una longitud máxima de 50 caracteres y no puede estar vacío.
     */
    @NotNull
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String ciudadDeNacimiento;

    /**
     * Sexo de la persona.
     * 
     * Campo obligatorio que indica el sexo de la persona.
     * Tiene una longitud máxima de 50 caracteres y no puede estar vacío.
     */
    @NotNull
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String sexo;
    
    /**
     * Fecha y hora de creación del registro.
     * 
     * Este campo se establece automáticamente cuando se persiste
     * la entidad por primera vez en la base de datos.
     */
    @Column(nullable = false)
    private LocalDateTime fechaDeCreacion;
    
    /**
     * Método ejecutado antes de persistir la entidad.
     * 
     * Este método se ejecuta automáticamente antes de que JPA
     * persista la entidad en la base de datos. Establece la fecha
     * de creación con la fecha y hora actual del sistema.
     */
    @PrePersist
    public void prePersist() {
        fechaDeCreacion = LocalDateTime.now();
    }
}
