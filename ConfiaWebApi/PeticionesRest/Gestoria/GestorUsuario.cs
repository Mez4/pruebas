using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Gestoria.GestorUsuario
{
    public class Add
    {
        
        [Required]
        public Int64 UsuarioID { get; set; }

        [Required]
        public Int64 ResponsableId { get; set; }
        [Required]
        public int TipoUsuarioID { get; set; }
    }
}
