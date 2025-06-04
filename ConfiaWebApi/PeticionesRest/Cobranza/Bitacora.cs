using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Cobranza.Bitacora
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }

    public class getProcesos
    {
        [Range(minimum: 0, maximum: 999999)]
        public int ProcesoId { get; set; }
    }
    public class addP
    {
        public string Clave { get; set; }
        public string Descripcion { get; set; }
        public Boolean activo { get; set; }
    }
    public class updP
    {
        [Required]
        public int ProcesoId { get; set; }
        [Required]
        public string Clave { get; set; }
        [Required]
        public string Descripcion { get; set; }
        [Required]
        public Boolean activo { get; set; }
    }

}
