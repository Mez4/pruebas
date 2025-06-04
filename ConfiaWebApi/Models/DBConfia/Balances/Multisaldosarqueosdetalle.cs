using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.MultiSaldosArqueosDetalle")]
    [ExplicitColumns]
    [PrimaryKey("MultiSaldoArqueoDetalleID")]
    public class MultiSaldosArqueosDetalle
    {
              
        
        [Column("MultiSaldoArqueoDetalleID")]
        public int MultiSaldoArqueoDetalleID { get; set; }
      
        
        [Column("MultiSaldoArqueoID")]
        public int MultiSaldoArqueoID { get; set; }
      
        
        [Column("IDT")]
        public int IDT { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }
      
        
        [Column("Cerrada")]
        public bool Cerrada { get; set; }
      
        
        [Column("Estatus")]
        public bool Estatus { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("NombreCuenta")]
        public string NombreCuenta { get; set; }
      
        
        [Column("DescCuenta")]
        public string DescCuenta { get; set; }
      
        
        [Column("ArqueoID")]
        public int? ArqueoID { get; set; }
      
        
        [Column("UsuarioRealiza")]
        public string UsuarioRealiza { get; set; }
      
        
        [Column("FechaUltimoArqueo")]
        public DateTime? FechaUltimoArqueo { get; set; }
      
        
        [Column("SaldoSistemaUltA")]
        public decimal SaldoSistemaUltA { get; set; }
      
        
        [Column("SaldoFisicoUltA")]
        public decimal SaldoFisicoUltA { get; set; }


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
