using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.Estatus
{
    public class ActualizarEstatus
    {
        [Required]
        public int EstatusID { get; set; }
        public string Clave {get; set;}
        public string Descripcion {get; set;}
    }
    public class AltaEstatus
    {
        public string Clave {get; set;}
        public string Descripcion {get; set;}
    }
    public class ObtenerEstatus
    {
        [Required]
        public string Clave {get; set;}
        public string Descripcion {get; set;}
    }
}