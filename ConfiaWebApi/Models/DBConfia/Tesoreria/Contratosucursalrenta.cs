using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ContratoSucursalRenta")]
    [ExplicitColumns]
    // No primary key detected
    public class ContratoSucursalRenta
    {
              
        
        [Column("LadoFrontal")]
        public string LadoFrontal { get; set; }
      
        
        [Column("LadoTrasero")]
        public string LadoTrasero { get; set; }
      
        
        [Column("ContratoID")]
        public int ContratoID { get; set; }


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
