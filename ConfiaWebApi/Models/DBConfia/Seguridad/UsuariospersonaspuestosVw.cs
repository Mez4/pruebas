using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.UsuariosPersonasPuestosVW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class UsuariosPersonasPuestosVW
    {
              
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("SACId")]
        public Int64? SACId { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("Usuario")]
        public string Usuario { get; set; }
      
        
        [Column("Ocupacion")]
        public string Ocupacion { get; set; }
      
        
        [Column("PuestoCV")]
        public int? PuestoCV { get; set; }
      
        
        [Column("EsGestor")]
        public int? EsGestor { get; set; }
      
        
        [Column("EsDirector")]
        public int? EsDirector { get; set; }


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
