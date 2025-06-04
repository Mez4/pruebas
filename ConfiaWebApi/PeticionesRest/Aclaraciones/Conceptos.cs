using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.Conceptos
{
    public class ActualizarConcepto
    {
        [Required]
        public int ConceptoID { get; set; }
        public string Clave {get; set;}
        public string DescripcionConcepto {get; set;}
    }
    public class AltaConcepto
    {
        public string Clave {get; set;}
        public string DescripcionConcepto {get; set;}
    }
    public class ObtenerConcepto
    {
        [Required]
        public string Clave {get; set;}
        public string DescripcionConcepto {get; set;}
    }
}