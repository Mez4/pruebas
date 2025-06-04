using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.TraspasoEntreCuentasZonales
{
    public class cuentasRetiro
    {
        [Required]
        public int SucursalID { set; get; }
        [Required]
        public int CajaID { set; get; }

        [Required]
        public int ProductoID { set; get; }
    }

    public class cuentasDeposito
    {
        [Required]
        public int SucursalID { set; get; }

        [Required]
        public int ZonaID { set; get; }
        [Required]
        public int CajaID { set; get; }

        [Required]
        public int ProductoID { set; get; }
    }

    public class Traspaso
    {
        [Required]
        public int CuentaOrigenID { get; set; }

        [Required]
        public int CuentaDestinoID { get; set; }

        [Required]
        public int Cantidad { get; set; }
        [Required]
        public int SucursalID { set; get; }
        [Required]
        public int CajaID { set; get; }

        [Required]
        public string Concepto { set; get; }
    }

    public class Imprimir
    {
        [Required]
        public int CuentaOrigenID { get; set; }

        [Required]
        public int CuentaDestinoID { get; set; }

        [Required]
        public int Cantidad { get; set; }
        [Required]
        public int SucursalID { set; get; }
        [Required]
        public int CajaID { set; get; }

        [Required]
        public string Concepto { set; get; }
    }

}
