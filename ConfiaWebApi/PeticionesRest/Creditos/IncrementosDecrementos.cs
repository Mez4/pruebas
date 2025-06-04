using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.IncrementosDecrementos
{
    public class Get
    {
        public Int64 UsuarioID { get; set; }

        [Required]
        public string LineasString { get; set; }

        [Required]
        public int Tipo { get; set; }
 
        public string Observaciones { get; set; }
        
        public int Upd { get; set; }
        
        public int ProductoID { get; set; }
    }
}
