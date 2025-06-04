using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.EstatusAumentoNivel")]
    [ExplicitColumns]
    // No primary key detected
    public class EstatusAumentoNivel
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
