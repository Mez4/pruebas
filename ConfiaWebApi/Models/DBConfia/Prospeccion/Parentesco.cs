using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.parentesco")]
    [ExplicitColumns]
    [PrimaryKey("ParentescoID")]
    public class parentesco
    {
              
        
        [Column("ParentescoID")]
        public int ParentescoID { get; set; }
      
        
        [Column("Parentesco")]
        public string Parentesco { get; set; }


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
