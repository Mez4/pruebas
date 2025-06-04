using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosDesembolsoDetalle")]
    [ExplicitColumns]
    [PrimaryKey("ArqueoDesembolsoDetalleID")]
    public class ArqueosDesembolsoDetalle
    {
              
        
        [Column("ArqueoDesembolsoDetalleID")]
        public Int64 ArqueoDesembolsoDetalleID { get; set; }
      
        
        [Column("ArqueosDesembolsoID")]
        public int ArqueosDesembolsoID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }


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
