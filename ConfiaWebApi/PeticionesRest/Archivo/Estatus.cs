using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ConfiaWebApi.PeticionesRest.General.Personas;

namespace ConfiaWebApi.PeticionesRest.Archivo.Estatus
{
    public class Get
    {
        [Range(minimum: 1, maximum: 99999999)]
        public int? EstatusID { get; set; }

    }

    public class Add
    {
        [Required]
        public string NombreEstatus { get; set; }
        [Required]
        public string Clave { get; set; }
        public string Color { get; set; }
        [Required]
        public string Descripcion { get; set; }
    }

    public class Update
    {
        [Required]
        public int EstatusID { get; set; }
        [Required]
        public string NombreEstatus { get; set; }
        [Required]
        public string Clave { get; set; }
        public string Color { get; set; }
        [Required]
        public string Descripcion { get; set; }
    }


     public class cobranzaglobal
    {  
        public string FechaInicio { get; set; }
        public string FechaFin { get; set; }
         
    }
}
