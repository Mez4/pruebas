using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Creditos;
using System.IO;
using System.Collections.Generic;
using System.Diagnostics;


namespace ConfiaWebApi.Code
{
    public static class PDF
    {
        public static async Task<FileStreamResult> GenerarPDF(string[] ArchivosHTML, string Motivo = "Fimado de documentos", string Localizacion = "Torreon Coahuila, México", string Contacto = "-")
        {
            try
            {


                // Generamos un prefijo del nombre de archivo
                var prefijo_archivo = string.Concat(System.Guid.NewGuid().ToString().Replace("-", ""), "__");

                // Ejecutamos el proceso de wkhtmltopdf
                Process p = new Process();
                p.StartInfo = new ProcessStartInfo(Code.PDF.RUTA_WKHTMLTOPDF());
                p.StartInfo.Arguments = string.Concat("", string.Join(" ", ArchivosHTML), " ", Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                p.StartInfo.CreateNoWindow = true;
                p.Start();
                await p.WaitForExitAsync();

                // Ejecutamos el proceso de formado digital del PDF
                //Process p2 = new Process();
                //p2.StartInfo = new ProcessStartInfo("java");
                //p2.StartInfo.Arguments = string.Concat(
                //    "-jar ",
                //    RUTA_JSIGNPDF, " ",
                //    Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")), " ",
                //    "-ksf ", Path.Combine(PDF.RUTA_BASE, "keystore", "confia.pdf.keystore"), " ",
                //    "-ksp Mexico2021 ",
                //    "-ka confia_pdf ",
                //    "-ksp Mexico2021 ",
                //    "-d ", RUTA_BASE, " ",
                //    "-r '", Motivo, "' ",
                //    "-l '", Localizacion, "' ",
                //    "-c '", Contacto, "' ",
                //    "-cl CERTIFIED_NO_CHANGES_ALLOWED ",
                //    "-ha SHA512 ",
                //    "-pg 1 ",
                //    "-llx 35.0 ",
                //    "-lly 830.0 ",
                //    "-urx 345 ",
                //    "-ury 762 ",
                //    "--render-mode DESCRIPTION_ONLY ",
                //    "-fs 8.0 ",
                //    "-V ",
                //    "-q"
                //);
                //p2.StartInfo.CreateNoWindow = true;
                //p2.Start();
                //await p2.WaitForExitAsync();

                // Obtenemos el contenido de nuestro archivo de PDF
                var pdf = await System.IO.File.ReadAllBytesAsync(System.IO.Path.Combine(Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                // Obtenemos nuestro PDF
                var pdfStream = new System.IO.MemoryStream();
                pdfStream.Write(pdf, 0, pdf.Length);
                pdfStream.Position = 0;

                // Limpiamos los archivos que se utilizaron
                foreach (var archivo in ArchivosHTML)
                    System.IO.File.Delete(archivo);

                // Eliminamos el PDF
                System.IO.File.Delete(System.IO.Path.Combine(Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //System.IO.File.Delete(System.IO.Path.Combine(Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");
            }

            catch (Exception ex)
            {
                return null;
                throw;
            }
        }

        /// <summary>
        /// Funcion para generar la ruta de WKHTMLTOPDF
        /// </summary>
        /// <returns>wkhtmltopdf</returns>
        public static string RUTA_WKHTMLTOPDF()
        {
            if (System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.OSX))
                return Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "wkhtmltopdf", "Mac", "wkhtmltopdf");
            else if (System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.Linux))
                return Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "wkhtmltopdf", "Linux", "wkhtmltopdf");
            else if (System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(System.Runtime.InteropServices.OSPlatform.Windows))
                return Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "wkhtmltopdf", "Windows", "wkhtmltopdf.exe");
            else
                return null;
        }

        /// <summary>
        /// ruta de JSignPdf
        /// </summary>
        public static string RUTA_JSIGNPDF = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "jsignpdf", "JSignPdf.jar");

        /// <summary>
        /// Ruta base
        /// </summary>
        public static string RUTA_BASE = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "DocumentosPDF");
    }
}