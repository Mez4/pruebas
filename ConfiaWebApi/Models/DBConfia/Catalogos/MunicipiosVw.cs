using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.Municipios_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Municipios_VW
    {
              
        
        [Column("id_estado")]
        public int? id_estado { get; set; }
      
        
        [Column("id_municipio")]
        public int? id_municipio { get; set; }
      
        
        [Column("Municipio")]
        public string Municipio { get; set; }


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
