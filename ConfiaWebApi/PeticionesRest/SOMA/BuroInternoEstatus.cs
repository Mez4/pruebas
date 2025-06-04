using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.SOMA.BuroInternoEstatus
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int BuroInternoEstatusID { get; set; }
    }

    public class Agregar
    {
        [Required]
        [MinLength(3)]
        [MaxLength(64)]
        public string Nombre { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string Color { get; set; }

        [Required]
        public bool PuedeCanjear { get; set; }


    }
    public class Actualizar
    {
        /*    [Range(minimum: 0, maximum: 9999)]
           public int BuroInternoEstatusID { get; set; }
    */
        [Required]
        [MinLength(3)]
        [MaxLength(64)]
        public string Nombre { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string Color { get; set; }

        [Required]
        public bool PuedeCanjear { get; set; }
    }


}
