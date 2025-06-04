using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.MultiSaldosArqueos")]
    [ExplicitColumns]
    [PrimaryKey("MultiSaldoArqueoID")]
    public class MultiSaldosArqueos
    {
              
        
        [Column("MultiSaldoArqueoID")]
        public int MultiSaldoArqueoID { get; set; }
      
        
        [Column("FechaGeneracion")]
        public DateTime FechaGeneracion { get; set; }
      
        
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
