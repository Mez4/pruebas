using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.General.Zonales
{
    public class GetZonales
    {
        [Range(minimum: 0, maximum: 99999)]
        public int ZonaID { get; set; }
        [Range(minimum: 0, maximum: 99999)]
        public int UsuarioID { get; set; }
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }
    }
}