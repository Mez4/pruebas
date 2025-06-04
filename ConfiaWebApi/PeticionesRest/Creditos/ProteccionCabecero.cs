using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.ProteccionCabecero
{
    public class Get
    {
        
        [Range(minimum: 0, maximum: 9999)]
        public int ProteccionCabeceroID { get; set; }
    }
    public class Add
    {
        
        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string Descripcion { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProteccionCabeceroID { get; set; }
        
        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string Descripcion { get; set; }
    }
}
