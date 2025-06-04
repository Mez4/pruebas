using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.SOMA.CatalogoCuentasBancos
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int CuentaBancoID { get; set; }

    }

    public class ActualizarProductoCuenta
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int CuentaBancoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int ProductoID { get; set; }


    }


    public class Agregar
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string numeroCuenta { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int cuentaID { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int bancoID { get; set; }

        [Required]
        public bool activo { get; set; }
        public string cobranzaConvenio { get; set; }

        public string dispersionConvenio { get; set; }
        public string descripcionCuenta { get; set; }

        public int CuentaBancariaPrincipalID { get; set; }

        [Required]
        public bool global { get; set; }

        [Required]
        public bool puedeDispersar { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999999)]
        public double saldoMin { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999999)]
        public double saldoMax { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999999)]
        public double excedenteSaldo { get; set; }

        [Range(minimum: 0, maximum: 999999999)]
        public double saldoActual { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int productoID { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int sucursalID { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int cajaID { get; set; }

        public bool EsBoveda { get; set; }





    }

    public class Actualizar : Agregar
    {


    }
}
