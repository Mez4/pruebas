using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.LogTelefono")]
    [ExplicitColumns]
    [PrimaryKey("LogTelefonoID")]
    public class LogTelefono
    {
              
        
        [Column("LogTelefonoID")]
        public int LogTelefonoID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("Telefono")]
        public string Telefono { get; set; }
      
        
        [Column("PersonaIDModifica")]
        public Int64 PersonaIDModifica { get; set; }
      
        
        [Column("UsuarioIDModifica")]
        public int UsuarioIDModifica { get; set; }
      
        
        [Column("FechaHora")]
        public DateTime FechaHora { get; set; }


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
