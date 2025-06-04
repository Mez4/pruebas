using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Balances
{
    [ExplicitColumns]
    public class MultiSaldosArqueosSP
    {

        [Column("MultiSaldoArqueoBovedaID")]
        public int MultiSaldoArqueoBovedaID { get; set; }

        //CajaID
        [Column("CajaID")]
        public int CajaID { get; set; }

        //NombreCaja
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }

        [Column("SucursalID")]
        public int SucursalID { get; set; }

        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }

        //CuentaBancoID
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        //DescripcionCuenta
        [Column("NombreCuenta")]
        public string NombreCuenta { get; set; }

        [Column("UsuarioRealiza")]
        public string UsuarioRealiza { get; set; }

        //FechaUltimoArqueo
        [Column("FechaUltimoArqueoBoveda")]
        public string FechaUltimoArqueoBoveda { get; set; }

        //SaldoArqueoAnterior
        [Column("SaldoSistemaUltAB")]
        public decimal SaldoSistemaUltAB { get; set; }

        //SaldoFisico
        [Column("SaldoFisicoUltAB")]
        public decimal SaldoFisicoUltAB { get; set; }

        //Diferencia
        [Column("Diferencia")]
        public decimal Diferencia { get; set; }

    }


}
