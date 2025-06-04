using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.Nivel
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int Id { get; set; }
    }
}
