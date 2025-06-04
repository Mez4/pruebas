using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ProteccionesSaldo")]
    [ExplicitColumns]
    // No primary key detected
    public class ProteccionesSaldo
    {
              
        
        [Column("ProteccionSaldoID")]
        public int ProteccionSaldoID { get; set; }
      
        
        [Column("MinColocacion")]
        public decimal MinColocacion { get; set; }
      
        
        [Column("MaxColocacion")]
        public decimal MaxColocacion { get; set; }
      
        
        [Column("Costo")]
        public int Costo { get; set; }
      
        
        [Column("CostoPesimo")]
        public int CostoPesimo { get; set; }


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
