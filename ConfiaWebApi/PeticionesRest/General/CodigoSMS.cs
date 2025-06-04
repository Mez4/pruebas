using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.General.CodigoSMS
{
    public class Get
    {
        [Required]
        public int Id { get; set; }

        public int PersonaID { get; set; }

        [Required]
        public string Codigo { get; set; }

        public DateTime FechaCaduca { get; set; }

        public int TipoID { get; set; }

    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public long PersonaID { get; set; }

        [Required]
        public string TelefonoMovil { get; set; }

        [Required]
        public string src { get; set; }

        [MinLength(1)]
        public string MSG { get; set; }  

    }

    public class SMS
    {

        [Required]
        [Range(minimum: 0, maximum: 999999999)]
        public long PersonaID { get; set; }

        [Required]
        public string TelefonoMovil { get; set; }

        // [Required]
        public string src { get; set; }

        [Required]
        [MinLength(1)]
        public string MSG { get; set; }  
        
        [Required]
        public string Referencia { get; set; } 

    }
}
