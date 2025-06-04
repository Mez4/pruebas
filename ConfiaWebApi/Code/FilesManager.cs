using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ConfiaWebApi.Code
{
    public static class FilesManager
    {
        [NonAction]
        public static async Task<string> SaveImage(IFormFile imageFile)
        {
            string imgName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imgName = imgName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
            string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Archivos", "LogoBancos", imgName);

            using (Stream stream = new FileStream(path, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }
            return imgName;
        }

        [NonAction]
        public static void DeleteImage(string imageName)
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Archivos", "LogoBancos", imageName);
            if (File.Exists(path))
                File.Delete(path);
        }

        [NonAction]
        public static byte[] ConvertFiletoByteArray(IFormFile file)
        {
            
            if (file == null)
                return Array.Empty<byte>();

            long length = file.Length;
            using var fileStream = file.OpenReadStream();
            byte[] bytes = new byte[length];
            fileStream.Read(bytes, 0, (int)file.Length);

            return bytes;

            //foreach (var file in files)
            //{
            //if (file.Length > 0)
            //{
            //    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            //    using var reader = new StreamReader(file.OpenReadStream());
            //    string contentAsString = reader.ReadToEnd();
            //    byte[] bytes = new byte[contentAsString.Length * sizeof(char)];
            //    Buffer.BlockCopy(contentAsString.ToCharArray(), 0, bytes, 0, bytes.Length);
            //    return bytes;
            //}

            //return Array.Empty<byte>(); 
            //}
        }

    }
}
