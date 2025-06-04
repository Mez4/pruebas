using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Archivo
{
    [TableName("Archivo.PersonaEstatus")]
    [ExplicitColumns]
    [PrimaryKey("PersonaEstatusID")]
    public class PersonaEstatus
    {
              
        
        [Column("PersonaEstatusID")]
        public Int64 PersonaEstatusID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("EstatusID")]
        public int EstatusID { get; set; }


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
