package co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.repositories;

import co.edu.progAvanzada.ytOsito_ParcialFinal.usuario.entities.Usuario;
import co.edu.progAvanzada.ytOsito_ParcialFinal.video.entities.Video;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repositorio para la gestión de datos de usuarios. Extiende JpaRepository para
 * operaciones CRUD básicas y define consultas personalizadas para validaciones
 * y operaciones específicas del dominio.
 *
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Rojas Roldan
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Verifica si existe un usuario con el email especificado.
     *
     * @param email Email a verificar
     * @return true si existe un usuario con ese email, false en caso contrario
     */
    boolean existsByEmail(String email);

    /**
     * Verifica si existe un usuario con el nickname especificado.
     *
     * @param nickname Nickname a verificar
     * @return true si existe un usuario con ese nickname, false en caso
     * contrario
     */
    boolean existsByNickname(String nickname);

    /**
     * Busca un usuario por su nickname.
     *
     * @param nickname Nickname del usuario a buscar
     * @return Optional que contiene el usuario si existe, vacío si no existe
     */
    Optional<Usuario> findByNickname(String nickname);

    /**
     * Busca un usuario por sus credenciales (nickname y password). Utilizado
     * para autenticación.
     *
     * @param nickname Nickname del usuario
     * @param password Password del usuario
     * @return El usuario si las credenciales son correctas, null si no
     * coinciden
     */
    Usuario findByNicknameAndPassword(String nickname, String password);

    /**
     * Verifica si existe una suscripción entre dos usuarios. Utiliza una
     * consulta JPQL para verificar la relación many-to-many.
     *
     * @param suscriptorId ID del usuario suscriptor
     * @param suscritoId ID del usuario suscrito
     * @return true si existe la suscripción, false en caso contrario
     */
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u JOIN u.suscripciones s WHERE u.id = :suscriptorId AND s.id = :suscritoId")
    boolean existsSuscripcion(@Param("suscriptorId") Long suscriptorId, @Param("suscritoId") Long suscritoId);

    /**
     * Obtiene la lista de usuarios a los que está suscrito un usuario. Utiliza
     * una consulta JPQL para acceder a la colección de suscripciones.
     *
     * @param usuarioId ID del usuario del que se quieren obtener las
     * suscripciones
     * @return Lista de usuarios a los que está suscrito
     */
    @Query("SELECT u.suscripciones FROM Usuario u WHERE u.id = :usuarioId")
    List<Usuario> findSuscripcionesByUsuarioId(@Param("usuarioId") Long usuarioId);

    /**
     * Obtiene la lista de usuarios suscritos a un usuario. Utiliza una consulta
     * JPQL para acceder a la colección de suscriptores.
     *
     * @param usuarioId ID del usuario del que se quieren obtener los
     * suscriptores
     * @return Lista de usuarios suscritos
     */
    @Query("SELECT u.suscriptores FROM Usuario u WHERE u.id = :usuarioId")
    List<Usuario> findSuscriptoresByUsuarioId(@Param("usuarioId") Long usuarioId);

    /**
     * Obtiene la lista de videos que le gustan a un usuario. Utiliza una
     * consulta JPQL para obtener los videos donde el usuario dio like (megusta
     * = true).
     *
     * @param usuarioId ID del usuario del que se quieren obtener los videos que
     * le gustan
     * @return Lista de videos que le gustan al usuario
     */
    @Query("SELECT l.video FROM Like l WHERE l.usuario.id = :usuarioId AND l.megusta = true")
    List<Video> findVideosQueMeGustan(@Param("usuarioId") Long usuarioId);
}
