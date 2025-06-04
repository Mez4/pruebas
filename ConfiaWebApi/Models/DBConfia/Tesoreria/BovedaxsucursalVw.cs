using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.BovedaXSucursal_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class BovedaXSucursal_VW
    {
              
        
        [Column("Boveda")]
        public string Boveda { get; set; }
      
        
        [Column("BovedaID")]
        public int BovedaID { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }


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
