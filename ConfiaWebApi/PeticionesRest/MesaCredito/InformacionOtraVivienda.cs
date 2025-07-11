﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace ConfiaWebApi.PeticionesRest.MesaCredito.InformacionOtraVivienda
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }
    }

    public class Add 
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idPersona { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idTipoPersona { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idTipoVivienda { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idAsentamiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string calle { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string numero { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string localidad { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string direccion { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal valorAproximado { get; set; }

    }

    public class Update 
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idPersona { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idTipoPersona { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idTipoVivienda { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idAsentamiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string calle { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string numero { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string localidad { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string direccion { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal valorAproximado { get; set; }
    }
}
