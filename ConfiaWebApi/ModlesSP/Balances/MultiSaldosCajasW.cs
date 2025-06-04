using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Balances
{
    [ExplicitColumns]

    public class MultiSaldosCajasW
    {
        [Column("MuiltisaldosCajaDetalleID")]
        public int MuiltisaldosCajaDetalleID { get; set; }
        //MultisaldosCajaID
        [Column("MultisaldosCajaID")]
        public int MultisaldosCajaID { get; set; }

        //CajaID
        [Column("CajaID")]
        public int CajaID { get; set; }

        //NombreCaja
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }

        //CuentaBancoID
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        //TipoMovID
        [Column("TipoMovID")]
        public int TipoMovID { get; set; }

        //TipoMovDesc
        [Column("TipoMovDesc")]
        public string TipoMovDesc { get; set; }

        //NumeroCuenta
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        //DescripcionCuenta
        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }

        //FechaUltimoArqueo
        [Column("FechaUltimoArqueo")]
        public string FechaUltimoArqueo { get; set; }

        //SaldoArqueoAnterior
        [Column("SaldoArqueoAnterior")]
        public decimal SaldoArqueoAnterior { get; set; }

        //SaldoFisico
        [Column("SaldoFisico")]
        public decimal SaldoFisico { get; set; }

        //Diferencia
        [Column("Diferencia")]
        public decimal Diferencia { get; set; }


    }

    public class MultiSaldosGeneral
    {
        // NombreBalance
        [Column("NombreBalance")]
        public decimal NombreBalance { get; set; }
        // CUENTAID
        [Column("CUENTAID")]
        public int CUENTAID { get; set; }

        // CUENTA
        [Column("CUENTA")]
        public string CUENTA { get; set; }

        // CARGOS
        [Column("CARGOS")]
        public decimal CARGOS { get; set; }

        // ABONOS
        [Column("ABONOS")]
        public decimal ABONOS { get; set; }

        // SALDOENMOVS
        [Column("SALDOENMOVS")]
        public decimal SALDOENMOVS { get; set; }

        // SALDOACTUAL
        [Column("SALDOACTUAL")]
        public decimal SALDOACTUAL { get; set; }

        
    }

}
