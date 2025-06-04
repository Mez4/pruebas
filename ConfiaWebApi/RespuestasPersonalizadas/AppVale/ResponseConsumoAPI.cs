using System.Collections.Generic;

namespace ConfiaWebApi.RespuestasPersonalizadas.AppVale
{
    public class ResponseChava
    {

        public long folioSolicitud { get; set; }
        public string Url { get; set; }
        public string? mensaje { get; set; }
    }

    public class ResponseSMSAgent
    {
        public int code { get; set; }
        public string msg { get; set; }
        public SMSuccess? responseSMS { get; set; }
    }
    public class SMSuccess
    {
        public string status { get; set; }
        public int campaign { get; set; }
        public int expires_in { get; set; }
    }
    public class ErrorResponse
    {
        public string type { get; set; }
        public string title { get; set; }
        public int status { get; set; }
        public string traceId { get; set; }
        public Dictionary<string, string[]> errors { get; set; }
    }
}