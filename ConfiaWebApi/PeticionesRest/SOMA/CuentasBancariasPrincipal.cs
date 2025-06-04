using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.CuentasBancariasPrincipal
{


    public class Add
    {
        public int CuentaBancariaPrincipalID { get; set; }

        [Required]
        public string NumeroCuenta { get; set; }

        [Required]
        public string DescripcionCuenta { get; set; }

        [Required]
        public int BancoID { get; set; }

        [Required]
        public int TipoCuentaBancoID { get; set; }

        [Required]
        public bool EsReal { get; set; }

        [Required]
        public bool Activa { get; set; }
    }


    public class AddMovimiento
    {
        [Required]
        public int CatalogoCuentaID { get; set; }

        [Required]
        public decimal Monto { get; set; }

        [Required]
        public bool CargoAbono { get; set; }

        public string Observaciones { get; set; }

    }
}