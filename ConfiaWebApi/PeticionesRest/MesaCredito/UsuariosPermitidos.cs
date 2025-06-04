using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.UsuariosPermitidos
{
    public class  Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }
    }

    public class Add 
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idUsuario { get; set; }
    }

    public class Update 
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idUsuario { get; set; }
    }
}
