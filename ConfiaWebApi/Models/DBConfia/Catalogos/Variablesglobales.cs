using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.VariablesGlobales")]
    [ExplicitColumns]
    [PrimaryKey("Id")]
    public class VariablesGlobales
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("varName")]
        public string varName { get; set; }
      
        
        [Column("varValue")]
        public object varValue { get; set; }
      
        
        [Column("usuario")]
        public bool usuario { get; set; }


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
