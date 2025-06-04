using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.Usuarios_PermisosEspeciales_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Usuarios_PermisosEspeciales_VW
    {
              
        
        [Column("PantallaDescripcion")]
        public string PantallaDescripcion { get; set; }
      
        
        [Column("NombreModulo")]
        public string NombreModulo { get; set; }
      
        
        [Column("PermisoID")]
        public int? PermisoID { get; set; }
      
        
        [Column("PantallaID")]
        public int? PantallaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Especial")]
        public bool? Especial { get; set; }
      
        
        [Column("RestUrl")]
        public string RestUrl { get; set; }
      
        
        [Column("RestMetodo")]
        public string RestMetodo { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime? CreacionFecha { get; set; }
      
        
        [Column("PermisoHeader")]
        public bool? PermisoHeader { get; set; }


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
