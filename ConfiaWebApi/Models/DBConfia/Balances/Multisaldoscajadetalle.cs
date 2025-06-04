using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.MultisaldosCajaDetalle")]
    [ExplicitColumns]
    [PrimaryKey("MuiltisaldosCajaDetalleID")]
    public class MultisaldosCajaDetalle
    {
              
        
        [Column("MuiltisaldosCajaDetalleID")]
        public Int64 MuiltisaldosCajaDetalleID { get; set; }
      
        
        [Column("MultisaldosCajaID")]
        public Int64 MultisaldosCajaID { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }
      
        
        [Column("FechaUltimoArqueo")]
        public DateTime? FechaUltimoArqueo { get; set; }
      
        
        [Column("SaldoArqueoAnterior")]
        public decimal SaldoArqueoAnterior { get; set; }
      
        
        [Column("SaldoFisico")]
        public decimal SaldoFisico { get; set; }
      
        
        [Column("Diferencia")]
        public decimal Diferencia { get; set; }
      
        
        [Column("TipoMovID")]
        public int TipoMovID { get; set; }
      
        
        [Column("TipoMovDesc")]
        public string TipoMovDesc { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
