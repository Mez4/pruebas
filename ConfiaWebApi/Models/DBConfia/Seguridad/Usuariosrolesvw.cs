using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.UsuariosRolesVW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class UsuariosRolesVW
    {
              
        
        [Column("UsuarioRolID")]
        public int UsuarioRolID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("RolID")]
        public int RolID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("EmpresaId")]
        public int EmpresaId { get; set; }
      
        
        [Column("ProductoNombre")]
        public string ProductoNombre { get; set; }
      
        
        [Column("ProductoActivo")]
        public bool ProductoActivo { get; set; }
      
        
        [Column("EmpresaNombre")]
        public string EmpresaNombre { get; set; }


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
