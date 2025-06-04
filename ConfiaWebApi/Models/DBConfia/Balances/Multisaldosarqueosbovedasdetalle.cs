using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.MultiSaldosArqueosBovedasDetalle")]
    [ExplicitColumns]
    [PrimaryKey("MultiSaldoArqueoBovedaDetalleID")]
    public class MultiSaldosArqueosBovedasDetalle
    {
              
        
        [Column("MultiSaldoArqueoBovedaDetalleID")]
        public int MultiSaldoArqueoBovedaDetalleID { get; set; }
      
        
        [Column("MultiSaldoArqueoBovedaID")]
        public int MultiSaldoArqueoBovedaID { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("NombreCuenta")]
        public string NombreCuenta { get; set; }
      
        
        [Column("ArqueoBovedaID")]
        public int? ArqueoBovedaID { get; set; }
      
        
        [Column("UsuarioRealiza")]
        public string UsuarioRealiza { get; set; }
      
        
        [Column("FechaUltimoArqueoBoveda")]
        public DateTime? FechaUltimoArqueoBoveda { get; set; }
      
        
        [Column("SaldoSistemaUltAB")]
        public decimal SaldoSistemaUltAB { get; set; }
      
        
        [Column("SaldoFisicoUltAB")]
        public decimal SaldoFisicoUltAB { get; set; }
      
        
        [Column("Diferencia")]
        public decimal? Diferencia { get; set; }
      
        
        [Column("TipoMovID")]
        public int? TipoMovID { get; set; }
      
        
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
