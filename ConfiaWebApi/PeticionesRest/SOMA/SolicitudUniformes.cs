using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.SolicitudUniformes
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int AgrupacionID { get; set; }

    }

    public class Agregar
    {

        [Required]
        public string Estatus { get; set; }

        [Required]
        public string Descripcion { get; set; }

    }

    public class Actualizar : Agregar
    {

        [Required]
        public int EstatusID { get; set; }

    }
}
