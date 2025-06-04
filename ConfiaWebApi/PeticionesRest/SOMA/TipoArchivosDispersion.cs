using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.TipoArchivosDispersion
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int ArchivoDispersionID { get; set; }

    }

    public class Agregar
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Descripcion { get; set; }

        [Required]
        [MaxLength(8)]
        [MinLength(1)]
        public string Clave { get; set; }

    }


    public class Actualizar
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Descripcion { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Clave { get; set; }

    }

}
