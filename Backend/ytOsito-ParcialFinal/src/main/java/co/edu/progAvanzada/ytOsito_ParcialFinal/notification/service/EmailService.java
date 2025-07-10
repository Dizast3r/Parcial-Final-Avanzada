package co.edu.progAvanzada.ytOsito_ParcialFinal.notification.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Servicio para el envío de correos electrónicos del sistema YtOsito.
 * 
 * Esta clase proporciona funcionalidades para enviar diferentes tipos de
 * correos electrónicos a los usuarios, incluyendo notificaciones de registro
 * y otros eventos importantes del sistema.
 * 
 * Utiliza JavaMailSender de Spring para gestionar el envío de correos
 * con formato HTML y codificación UTF-8.
 * 
 * @author Jorge Miguel Mendez Baron
 * @author Jose David Cucanchon Ramirez
 * @author Edgar Julian Rojas Roldan
 * @version 1.0
 * @since 1.0
 */
@Service
public class EmailService {

    /**
     * Componente de Spring para el envío de correos electrónicos.
     * 
     * Se inyecta automáticamente mediante Spring Boot y permite
     * la creación y envío de mensajes MIME con formato HTML.
     */
    @Autowired
    private JavaMailSender mailSender;

    /**
     * Envía un correo de confirmación de registro exitoso a un usuario.
     * 
     * Este método crea y envía un correo electrónico con formato HTML
     * informando al usuario que su registro en la plataforma YtOsito
     * ha sido completado exitosamente.
     * 
     * @param emailDestino La dirección de correo electrónico del destinatario.
     *                     Debe ser una dirección válida y no nula.
     * @throws RuntimeException Si ocurre un error durante la creación o envío del correo.
     *                         Encapsula la excepción MessagingException original.
     */
    public void enviarEmailRegistro(String emailDestino) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(emailDestino);
            helper.setSubject("Registro exitoso en YtOsito");
            helper.setText(construirMensajeRegistro(), true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar email de registro", e);
        }
    }

    /**
     * Construye el mensaje HTML para el correo de confirmación de registro.
     * 
     * Crea un mensaje estructurado con información sobre las funcionalidades
     * disponibles para el usuario recién registrado, incluyendo:
     * - Subir videos
     * - Comentar en videos
     * - Dar like a contenido
     * 
     * @return String con el contenido HTML del mensaje de confirmación de registro.
     *         El mensaje incluye formato HTML con encabezados, párrafos y lista.
     */
    private String construirMensajeRegistro() {
        return """
            <html>
            <body>
                <h2>¡Registro exitoso!</h2>
                <p>Tu cuenta ha sido creada correctamente en YtOsito.</p>
                <p>Ya puedes comenzar a:</p>
                <ul>
                    <li>Subir tus videos favoritos</li>
                    <li>Comentar en otros videos</li>
                    <li>Dar like a contenido que te guste</li>
                </ul>
                <br>
                <p>¡Gracias por unirte a nuestra comunidad!</p>
                <p><strong>El equipo de YtOsito</strong></p>
            </body>
            </html>
            """;
    }
}
