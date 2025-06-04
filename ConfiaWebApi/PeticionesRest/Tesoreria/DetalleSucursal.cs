using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace ConfiaWebApi.PeticionesRest.Tesoreria.DetalleSucursal
{
    public class ModificarSucursalDetalle {
 
        // [Required]
        // public int SucursalId {get;set;}

        // [Required]
        public int ContratoID {get;set;}

        // [Required]
        // public string Colonia {get; set;}

        // [Required]
        public decimal Monto {get; set;} 

        // [Required]
        // public string Calle {get; set;}

        // [Required]
        public string DetSuc {get; set;}

        // [Required]
        public DateTime? FechaInicio {get;set;}

        // [Required]
        public DateTime? FechaFin {get;set;}


    }

    public class ActualizarSucursalDetalle : ModificarSucursalDetalle {}
    
    
    public class AgregarSucursalDetalle {
        [Required]
        public int SucursalId {get;set;}

        [Required]
        public decimal Monto {get; set;}

        [Required]
        public DateTime FechaFin {get;set;}

        [Required]
        public DateTime FechaInicio {get;set;}

        [Required]
        public string DetSuc {get; set;}

    }
    public class subirDoc
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ContratoID { get; set; }
        
        [Required]
        [Range(minimum: 1, maximum: 3)]
        public int identificador { get; set; }

        [Required]  
        public IFormFile doc { get; set; }
    }

        public class GetDoc
    {
        public int ContratoID { get; set; }
    }

}
    