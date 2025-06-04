using System.IO;
using System.Net;

namespace ConfiaWebApi.Code
{
    public static class ConfiaShop
    {
        public static string LealtadAuth(string email, string password)
        {
            var url = $"https://lealtad.confiashop.com/api/Auth/login";
            var request = (HttpWebRequest)WebRequest.Create(url);
            string json = $"{{\"email\":\"{email}\", \"password\":\"{password}\"}}";
            request.Method = "POST";
            request.ContentType = "application/json";
            request.Accept = "application/json";
            using (var streamWriter = new StreamWriter(request.GetRequestStream()))
            {
                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();
            }
            try
            {
                using WebResponse response = request.GetResponse();
                using Stream strReader = response.GetResponseStream();
                if (strReader == null) return "";
                using StreamReader objReader = new(strReader);
                string responseBody = objReader.ReadToEnd();
                // Do something with responseBody
                return responseBody;
            }
            catch (WebException ex)
            {
                return "";
            }
        }

        public static string LealtadSel(string token, long DistribuidorID)
        {
            var url = $"https://lealtad.confiashop.com/api/Lealtad?id_usuario={DistribuidorID}";
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "GET";
            request.ContentType = "application/json";
            request.Accept = "application/json";
            var authHeader = "Bearer " + token;
            request.Headers.Add("Authorization", authHeader);
            try
            {
                using WebResponse response = request.GetResponse();
                using Stream strReader = response.GetResponseStream();
                if (strReader == null) return "";
                using StreamReader objReader = new(strReader);
                var responseBody = objReader.ReadToEnd();
                // Do something with responseBody
                return responseBody;
            }
            catch (WebException ex)
            {
                return "";
            }
        }

    }
}
