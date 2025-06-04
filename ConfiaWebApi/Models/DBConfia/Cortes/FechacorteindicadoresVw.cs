using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cortes
{
    [TableName("Cortes.FechaCorteIndicadores_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class FechaCorteIndicadores_VW
    {
              
        
        [Column("fecha")]
        public DateTime fecha { get; set; }
      
        
        [Column("fechaCorte")]
        public string fechaCorte { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }


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
