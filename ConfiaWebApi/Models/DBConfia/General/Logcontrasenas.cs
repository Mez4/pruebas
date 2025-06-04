using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.LogContrasenas")]
    [ExplicitColumns]
    [PrimaryKey("LogContrasenaID")]
    public class LogContrasenas
    {
              
        
        [Column("LogContrasenaID")]
        public int LogContrasenaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("PersonaIDModifica")]
        public Int64 PersonaIDModifica { get; set; }
      
        
        [Column("UsuarioIDModifica")]
        public int UsuarioIDModifica { get; set; }
      
        
        [Column("FechaHora")]
        public DateTime? FechaHora { get; set; }


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
