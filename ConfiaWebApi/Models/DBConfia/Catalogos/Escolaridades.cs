using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.Escolaridades")]
    [ExplicitColumns]
    [PrimaryKey("EscolaridadID")]
    public class Escolaridades
    {
              
        
        [Column("EscolaridadID")]
        public int EscolaridadID { get; set; }
      
        
        [Column("Escolaridad")]
        public string Escolaridad { get; set; }


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
