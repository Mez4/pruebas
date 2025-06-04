using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.PMultiSaldos")]
    [ExplicitColumns]
    // No primary key detected
    public class PMultiSaldos
    {
              
        
        [Column("MultiSaldoID")]
        public int MultiSaldoID { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime? FechaCaptura { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }


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
