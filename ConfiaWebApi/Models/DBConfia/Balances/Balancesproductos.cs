using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.BalancesProductos")]
    [ExplicitColumns]
    [PrimaryKey("BalanceID")]
    public class BalancesProductos
    {
              
        
        [Column("BalanceID")]
        public Int64 BalanceID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("FechaCreacion")]
        public DateTime? FechaCreacion { get; set; }
      
        
        [Column("NombreBalance")]
        public string NombreBalance { get; set; }
      
        
        [Column("NumeroBalance")]
        public string NumeroBalance { get; set; }
      
        
        [Column("ResponsableBalance")]
        public Int64? ResponsableBalance { get; set; }


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
