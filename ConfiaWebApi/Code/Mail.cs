using System.Text;
using System;
using System.Threading.Tasks;

using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;

// Namespace
namespace ConfiaWebApi.Code
{
    public static class MailSender
    {
        private static string ServerUrl = "http://localhost:3000/login/confirm";
        private static string emailHost = Startup.StaticConfig.GetSection("Mail:host").Value;
        private static int emailPort = int.Parse(Startup.StaticConfig.GetSection("Mail:port").Value);
        private static string emailAddress = Startup.StaticConfig.GetSection("Mail:email").Value;
        private static string emailAuth = Startup.StaticConfig.GetSection("Mail:pass").Value;

        /// <summary>
        /// Callout for the html template
        /// </summary>
        /// <param name="content"></param>
        /// <returns></returns>
        private static string Callout(string content)
        {
            return string.Concat("<p style='text-align:center' class='callout'><span><strong>", content, "</strong></span></p>");
        }

        private static string SocialTable(string content)
        {
            return string.Concat("<table class='social' width='100%'><tbody><tr><td>", content, "</td></tr></tbody></table>");
        }

        private static string ContentTable(string content, string align)
        {
            return string.Concat("<table align='", align, "' class='column'><tr><td>", content, "</td></tr></table>");
        }

        /// <summary>
        /// Envia un correo al usuario cuando es registrado
        /// </summary>
        /// <param name="CorreoDestino">Correo del usuario de destino</param>
        /// <param name="CodigoValidacion">Codigo de validación para el usuario final</param>
        /// <returns></returns>
        public static async Task<bool> Usuarios__Nuevo(string CorreoDestino, string CodigoValidacion)
        {
            try
            {
                // Get our css style
                var template = string.Join(" ", await System.IO.File.ReadAllLinesAsync(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "StaticFiles", "mailFile.html").Trim()));
                var style = await System.IO.File.ReadAllTextAsync(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "StaticFiles", "mailStyle.min.css"));

                // Cuerpo HTML del email
                var htmlBody = template
                    .Replace("__STYLE_CSS__", style)
                    .Replace("__TITLE__", "Sistema de usuarios")
                    .Replace("__SUBTITLE__", "Su cuenta para el sistema de administración de CV ha sido generada")
                    .Replace("__BODY__",
                        string.Concat(
                            "Para continuar, utilice este <a href='",
                            ServerUrl,
                            "'>enlace</a>, adicionalmente se va a requerir utilizar el codigo de validación que se muestra a continuación",
                            Callout(CodigoValidacion)
                        )
                    )
                    .Replace("__SUB_ELEMENTS__", "");

                var textBody = string.Concat(
                    "Sistema de usuarios CV",
                    System.Environment.NewLine,
                    System.Environment.NewLine,
                    "Se genero una cuenta en el sistema de usuarios, para activar acceda a ",
                    ServerUrl,
                    ", utilizando el codigo de verificación: ",
                    CodigoValidacion
                );

                // create email message
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(emailAddress));
                email.To.Add(MailboxAddress.Parse(CorreoDestino));
                email.Subject = "Alta de usuario";
                email.Body = new BodyBuilder()
                {
                    HtmlBody = htmlBody,
                    TextBody = textBody
                }
                .ToMessageBody();

                // send email
                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(emailHost, emailPort, MailKit.Security.SecureSocketOptions.Auto);
                smtp.Authenticate(emailAddress, emailAuth);
                smtp.Send(email);
                smtp.Disconnect(true);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        /// <summary>
        /// Envia un correo al usuario cuando es registrado
        /// </summary>
        /// <param name="CorreoDestino">Correo del usuario de destino</param>
        /// <param name="CodigoValidacion">Codigo de validación para el usuario final</param>
        /// <returns></returns>
        public static async Task<bool> Usuarios__OlvidoPassword(string CorreoDestino, string CodigoValidacion)
        {
            try
            {
                // Get our css style
                var template = string.Join(" ", await System.IO.File.ReadAllLinesAsync(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "StaticFiles", "mailFile.html").Trim()));
                var style = await System.IO.File.ReadAllTextAsync(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "StaticFiles", "mailStyle.min.css"));

                var htmlBody = template
                    .Replace("__STYLE_CSS__", style)
                    .Replace("__TITLE__", "Sistema de usuarios")
                    .Replace("__SUBTITLE__",
                        @"
                            Se realizo una petición para restaurar su contraseña, si usted no realizo esta acción notifique al 
                            departamento de sistemas para reviszar la seguridad de su cuenta
                        "
                    )
                    .Replace("__BODY__",
                        string.Concat(
                            "Si usted realizo esta petición, ingrese a este <a href='",
                            ServerUrl,
                            "'>enlace</a>, adicionalmente se va a requerir utilizar el codigo de validación que se muestra a continuación",
                            Callout(CodigoValidacion)
                        )
                    )
                    .Replace("__SUB_ELEMENTS__", "");

                var textBody = string.Concat(
                    "Sistema de usuarios CV",
                    System.Environment.NewLine,
                    System.Environment.NewLine,
                    @"
                        Se realizo una petición para restaurar su contraseña, si usted no realizo esta acción notifique al 
                        departamento de sistemas para reviszar la seguridad de su cuenta. Si desea continuar con el cambio acceda a 
                    ",
                    ServerUrl,
                    ", utilizando el codigo de verificación: ",
                    CodigoValidacion
                );

                // create email message
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(emailAddress));
                email.To.Add(MailboxAddress.Parse(CorreoDestino));
                email.Subject = "Cambiar contraseña";
                email.Body = new BodyBuilder()
                {
                    HtmlBody = htmlBody,
                    TextBody = textBody
                }
                .ToMessageBody();

                // send email
                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(emailHost, emailPort, MailKit.Security.SecureSocketOptions.Auto);
                smtp.Authenticate(emailAddress, emailAuth);
                smtp.Send(email);
                smtp.Disconnect(true);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        /// <summary>
        /// Envia un correo al usuario cuando es registrado
        /// </summary>
        /// <param name="CorreoDestino">Correo del usuario de destino</param>
        /// <param name="CodigoValidacion">Codigo de validación para el usuario final</param>
        /// <returns></returns>
        public static async Task<bool> Enviar__Correo(List<string> CorreosDestino, string Subject, string Titulo, string bodyMensaje, string subElements, Stream file = null)
        {
            try
            {
                // Get our css style
                var template = string.Join(" ", await System.IO.File.ReadAllLinesAsync(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "StaticFiles", "mailFile.html").Trim()));
                var style = await System.IO.File.ReadAllTextAsync(System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "StaticFiles", "mailStyle.min.css"));

                // Cuerpo HTML del email
                var htmlBody = template
                    .Replace("__STYLE_CSS__", style)
                    .Replace("__TITLE__", Subject)
                    .Replace("__SUBTITLE__", Titulo)
                    .Replace("__BODY__", bodyMensaje)
                    .Replace("__SUB_ELEMENTS__", subElements);

                var textBody = string.Concat(
                    Subject,
                    System.Environment.NewLine,
                    Titulo,
                    System.Environment.NewLine,
                    System.Environment.NewLine,
                    bodyMensaje,
                    System.Environment.NewLine,
                    System.Environment.NewLine,
                    subElements
                );


                // create email message
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(emailAddress));
                CorreosDestino.Add(emailAddress);
                foreach (var correo in CorreosDestino)
                {
                    email.To.Add(MailboxAddress.Parse(correo));
                }

                email.Subject = Subject;

                var builder = new BodyBuilder();
                builder.HtmlBody = htmlBody;
                builder.TextBody = textBody;

                byte[] m_Bytes = ReadToEnd(file);
                builder.Attachments.Add($"{Subject.Replace(" ", string.Empty)}_{DateTime.Now.ToString("ddMMyyyyhhmmss")}.pdf", m_Bytes, new ContentType("application", "pdf"));

                email.Body = builder.ToMessageBody();

                // send email
                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(emailHost, emailPort, MailKit.Security.SecureSocketOptions.Auto);
                smtp.Authenticate(emailAddress, emailAuth);
                smtp.Send(email);
                smtp.Disconnect(true);

                Console.WriteLine($"Email '{Subject}' enviado correctamente");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR Email '{Subject}' no enviado: {ex.Message}");
                return false;
            }
        }

        public static byte[] ReadToEnd(System.IO.Stream stream)
        {
            long originalPosition = 0;

            if (stream.CanSeek)
            {
                originalPosition = stream.Position;
                stream.Position = 0;
            }

            try
            {
                byte[] readBuffer = new byte[4096];

                int totalBytesRead = 0;
                int bytesRead;

                while ((bytesRead = stream.Read(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
                {
                    totalBytesRead += bytesRead;

                    if (totalBytesRead == readBuffer.Length)
                    {
                        int nextByte = stream.ReadByte();
                        if (nextByte != -1)
                        {
                            byte[] temp = new byte[readBuffer.Length * 2];
                            Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
                            Buffer.SetByte(temp, totalBytesRead, (byte)nextByte);
                            readBuffer = temp;
                            totalBytesRead++;
                        }
                    }
                }

                byte[] buffer = readBuffer;
                if (readBuffer.Length != totalBytesRead)
                {
                    buffer = new byte[totalBytesRead];
                    Buffer.BlockCopy(readBuffer, 0, buffer, 0, totalBytesRead);
                }
                return buffer;
            }
            finally
            {
                if (stream.CanSeek)
                {
                    stream.Position = originalPosition;
                }
            }
        }
    }
}