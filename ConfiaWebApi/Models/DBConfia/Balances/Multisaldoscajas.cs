using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.MultisaldosCajas")]
    [ExplicitColumns]
    [PrimaryKey("MultisaldosCajaID")]
    public class MultisaldosCajas
    {
              
        
        [Column("MultisaldosCajaID")]
        public Int64 MultisaldosCajaID { get; set; }
      
        
        [Column("FechaGenerado")]
        public DateTime FechaGenerado { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }


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
