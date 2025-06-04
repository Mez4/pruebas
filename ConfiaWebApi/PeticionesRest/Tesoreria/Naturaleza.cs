using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Tesoreria.Naturaleza
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int NaturalezaId { get; set; }
    }
    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(8)]
        public string Descripcion { get; set; }
    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int NaturalezaId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(8)]
        public string Descripcion { get; set; }

  
    }
}
