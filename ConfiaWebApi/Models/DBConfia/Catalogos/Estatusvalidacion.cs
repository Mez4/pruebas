using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.EstatusValidacion")]
    [ExplicitColumns]
    [PrimaryKey("EstatusValidacionID")]
    public class EstatusValidacion
    {
              
        
        [Column("EstatusValidacionID")]
        public int EstatusValidacionID { get; set; }
      
        
        [Column("descripcion")]
        public string descripcion { get; set; }


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
