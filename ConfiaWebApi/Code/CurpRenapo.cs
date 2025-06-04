using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using ConfiaWebApi.RespuestasPersonalizadas.RENAPO.DatosCURP;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ConfiaWebApi.Code
{
    public static class CurpRenapo
    {
        [NonAction]
        public static async Task<string> GetbyCURP(string CURP, string APIKEY)
        {
            
            try
            {
                var client = new HttpClient();
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri($"https://curp-renapo.p.rapidapi.com/v1/curp/{CURP}"),
                    Headers =
                    {
                        { "X-RapidAPI-Host", "curp-renapo.p.rapidapi.com" },
                        { "X-RapidAPI-Key", "57743efcedmsh592a9e7212555f4p19afe7jsnff3410662812" },
                    },
                };
                using (var response = await client.SendAsync(request))
                {
                    response.EnsureSuccessStatusCode();
                    var body = await response.Content.ReadAsStringAsync();
                    Console.WriteLine(body);
                    return body;
                    // return JsonConvert.DeserializeObject<GetInfo>(body);
                }
            }
            catch (WebException ex)
            {
                return $"{ex.Message}";
            }
            
        }

    }
}