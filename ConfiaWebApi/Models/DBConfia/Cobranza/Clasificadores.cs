using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.Clasificadores")]
    [ExplicitColumns]
    [PrimaryKey("ClasificadorID")]
    public class Clasificadores
    {
              
        
        [Column("ClasificadorID")]
        public int ClasificadorID { get; set; }
      
        
        [Column("Clasificador")]
        public string Clasificador { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }


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
