using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.EstatusSolicitudes")]
    [ExplicitColumns]
    [PrimaryKey("EstatusID")]
    public class EstatusSolicitudes
    {
              
        
        [Column("EstatusID")]
        public int EstatusID { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }


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
