using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Catalogos.CatalogoEstatusConsultaBuroID
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int EstatusConsultaBuroID { get; set; }
    }

    public class Add
    {
        public string Descripcion { get; set; }

    }

    public class Update
    {
        public int EstatusConsultaBuroID { get; set; }
        public string Descripcion { get; set; }

    }
}
