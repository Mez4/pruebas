using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.BalanzaDetalle")]
    [ExplicitColumns]
    [PrimaryKey("BalanzaDetalleID")]
    public class BalanzaDetalle
    {
              
        
        [Column("BalanzaDetalleID")]
        public int BalanzaDetalleID { get; set; }
      
        
        [Column("BalanzaID")]
        public int BalanzaID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("CuentaContableID")]
        public int CuentaContableID { get; set; }
      
        
        [Column("Factor")]
        public decimal? Factor { get; set; }
      
        
        [Column("CtaBanco")]
        public string CtaBanco { get; set; }
      
        
        [Column("CtaContable")]
        public string CtaContable { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("SaldoImporte")]
        public decimal SaldoImporte { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("CuentaDestino")]
        public string CuentaDestino { get; set; }
      
        
        [Column("FechaAfectacion")]
        public DateTime FechaAfectacion { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("TipoMovimientoDesc")]
        public string TipoMovimientoDesc { get; set; }


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
