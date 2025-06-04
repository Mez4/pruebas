using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.PantallaProceso")]
    [ExplicitColumns]
    [PrimaryKey("PantallaProcesoID", AutoIncrement=false)]
    public class PantallaProceso
    {
              
        
        [Column("PantallaProcesoID")]
        public int PantallaProcesoID { get; set; }
      
        
        [Column("PantallaProcesoDesc")]
        public string PantallaProcesoDesc { get; set; }


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
