using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.TuberiaResultado")]
    [ExplicitColumns]
    [PrimaryKey("TuberiaResultadoID")]
    public class TuberiaResultado
    {
              
        
        [Column("TuberiaResultadoID")]
        public Int64 TuberiaResultadoID { get; set; }
      
        
        [Column("Resultado")]
        public string Resultado { get; set; }


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
