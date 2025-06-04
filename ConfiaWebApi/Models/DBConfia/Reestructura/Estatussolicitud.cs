using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Reestructura
{
    [TableName("Reestructura.EstatusSolicitud")]
    [ExplicitColumns]
    [PrimaryKey("Estatus", AutoIncrement=false)]
    public class EstatusSolicitud
    {
              
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


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
