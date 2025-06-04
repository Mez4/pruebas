using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.SOMA.CatBancos
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int BancoID { get; set; }

    }

    public class Agregar
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string nombre { get; set; }

        [Required]
        public bool activo { get; set; }


        [Required]
        [Range(1, 999999)]
        public int archivoDispersionID { get; set; }

        [Required]
        [Range(1, 999999)]
        public int tipoBancoID { get; set; }

        public IFormFile Logo { get; set; }


    }

    public class Actualizar : Agregar
    {



    }
}
