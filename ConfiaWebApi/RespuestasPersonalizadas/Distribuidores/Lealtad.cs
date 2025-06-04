using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.RespuestasPersonalizadas.Distribuidores.Lealtad
{
    public class Auth
    {
        public string token { get; set; }
        public string email { get; set; }
        public string fullname { get; set; }
    }

    public class Get
    {
        public string referencia { get; set; }
        public string sistema { get; set; }
        public string id_mov_cs { get; set; }
        public int id_mov_vr { get; set; }
        public decimal saldo { get; set; }
    }
}
