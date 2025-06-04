using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Balances.MultiSaldos
{
    public class Get
    {
        [Required]
        public int ProductoID { get; set; }

    }
    public class Print
    {
        [Required]
        public int MultiSaldoID { get; set; }

    }

    public class CierreMultiSaldosGet
    {
        [Required]
        public string FechaInicio { get; set; }

    }

    public class PrintArqueosBovedas
    {
        //MultiSaldoCajaID
        [Required]
        public int MultiSaldoArqueoBovedaID { get; set; }
    }



    public class PrintCaja
    {
        //MultiSaldoCajaID
        [Required]
        public int MultiSaldoCajaID { get; set; }
    }
    public class Add
    {


    }

    public class Update
    {


    }

    public class Movimientos
    {
        public int ProductoID { get; set; }
        public int CuentaBancoID { get; set; }
    }

    public class MovimientosTraspasos
    {
        public int ProductoID { get; set; }
        public int CuentaBancoID { get; set; }
    }

    public class MovimientosBalance
    {
        public int CuentaBancoID { get; set; }
    }

    public class ObtenerBalance 
    {
        public int BalanceID { get; set; }
    }
}
