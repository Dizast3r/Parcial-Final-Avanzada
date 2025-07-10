/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 *
 * @author User
 */
@Entity
@DiscriminatorValue("USUARIO")
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Usuario")

public class Usuario extends Persona {

    @NotBlank
    @Size(min = 3, max = 50)
    @Column(nullable = false, unique = true, length = 50)
    private String nickname;

    @Email
    @Column(name = "correo", nullable = false)
    private String email;

    /**
     * La contraseña debe tener: - al menos una mayúscula - al menos una
     * minúscula - al menos un número - al menos un carácter especial @$!%*?& -
     * mínimo 8 caracteres de longitud
     */
    @NotBlank
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "La contraseña debe tener al menos una mayúscula, una minúscula, un número, "
            + "un carácter especial @$!%*?& y un mínimo de 8 caracteres"
    )
    @Column(nullable = false)
    private String password;

    @NotNull
    @Column(name = "fecha_union", nullable = false)
    private LocalDate fechaUnion;

}
