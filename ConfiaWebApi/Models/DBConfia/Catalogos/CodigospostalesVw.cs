using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.CodigosPostales_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CodigosPostales_VW
    {
              
        
        [Column("id_estado")]
        public int? id_estado { get; set; }
      
        
        [Column("id_municipio")]
        public int? id_municipio { get; set; }
      
        
        [Column("CodigoPostalID")]
        public int CodigoPostalID { get; set; }
      
        
        [Column("CodigoPostal")]
        public int CodigoPostal { get; set; }


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
