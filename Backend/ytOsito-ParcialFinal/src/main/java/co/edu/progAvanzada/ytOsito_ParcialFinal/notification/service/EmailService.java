package co.edu.progAvanzada.ytOsito_ParcialFinal.email.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 *
 * @author User
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

//    public void enviarEmailBienvenida(String emailDestino) {
//        try {
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//            
//            helper.setTo(emailDestino);
//            helper.setSubject("¡Bienvenido a YtOsito!");
//            helper.setText(construirMensajeBienvenida(), true);
//            
//            mailSender.send(message);
//        } catch (MessagingException e) {
//            throw new RuntimeException("Error al enviar email de bienvenida", e);
//        }
//    }

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

//    private String construirMensajeBienvenida() {
//        return """
//            <html>
//            <body>
//                <h2>¡Bienvenido a YtOsito!</h2>
//                <p>Nos alegra tenerte en nuestra plataforma de videos.</p>
//                <p>Esperamos que disfrutes explorando y compartiendo contenido increíble.</p>
//                <br>
//                <p>¡Que tengas un excelente día!</p>
//                <p><strong>El equipo de YtOsito</strong></p>
//            </body>
//            </html>
//            """;
//    }

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
