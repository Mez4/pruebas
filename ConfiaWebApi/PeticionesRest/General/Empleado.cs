using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.General.Empleado
{
    public class Get
    {
        public int SucursalID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int SACId { get; set; }

        public string Nombre { get; set; }

        public long? PersonaID { get; set; }
}
}
