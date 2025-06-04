using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.SOMA.CatDenomEfectivo
{
    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int CatDenomEfectivoID { get; set; }

    }

    public class Agregar
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Clave { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Concepto { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public double ValorMonetario { get; set; }



    }

    public class Actualizar : Agregar
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int CatDenomEfectivoID { get; set; }

    }
}
