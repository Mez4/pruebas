using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Seguridad.UsuariospersonaspuestosVw
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }


}
