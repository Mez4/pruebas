using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.CreditoSpei
{
    public class GetCreditos
    {
        [Required]
        public int EnvioSTPID { get; set;}
    }

    public class GetSpeiFile
    {
        [Required]
        public int STPEnvioID { get; set;}

        public Int64 Usu  { get; set;}
    }

    public class DispersarPagos
    {
        [Required]
        public string PagosList { get; set;}

        public Int64 UsuarioID  { get; set;}
    }
}
