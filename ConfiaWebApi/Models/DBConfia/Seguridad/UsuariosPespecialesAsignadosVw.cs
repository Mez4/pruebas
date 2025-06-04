using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.Usuarios_PEspeciales_Asignados_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Usuarios_PEspeciales_Asignados_VW
    {
              
        
        [Column("UsuarioPermisoEspecialID")]
        public int UsuarioPermisoEspecialID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("PermisoID")]
        public int? PermisoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("UsuarioID")]
        public int? UsuarioID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }


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
