using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.BalanceMovimientoDetalle2")]
    [ExplicitColumns]
    [PrimaryKey("BalanceMovDetalleID")]
    public class BalanceMovimientoDetalle2
    {
              
        
        [Column("BalanceMovDetalleID")]
        public Int64 BalanceMovDetalleID { get; set; }
      
        
        [Column("BalanceID")]
        public Int64 BalanceID { get; set; }
      
        
        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }
      
        
        [Column("SaldoSistema")]
        public decimal SaldoSistema { get; set; }


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
