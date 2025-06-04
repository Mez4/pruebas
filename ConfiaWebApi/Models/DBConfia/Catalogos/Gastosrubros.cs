using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.GastosRubros")]
    [ExplicitColumns]
    [PrimaryKey("gastosRubroID")]
    public class GastosRubros
    {
              
        
        [Column("gastosRubroID")]
        public int gastosRubroID { get; set; }
      
        
        [Column("gastosRubroDesc")]
        public string gastosRubroDesc { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }


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
