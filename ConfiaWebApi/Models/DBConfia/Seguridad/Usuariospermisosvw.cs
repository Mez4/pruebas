using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.UsuariosPermisosVW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class UsuariosPermisosVW
    {
              
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("ModuloID")]
        public int? ModuloID { get; set; }
      
        
        [Column("ModuloNombre")]
        public string ModuloNombre { get; set; }
      
        
        [Column("ModuloRuta")]
        public string ModuloRuta { get; set; }
      
        
        [Column("ModuloColorFondo")]
        public string ModuloColorFondo { get; set; }
      
        
        [Column("ModuloColorBorde")]
        public string ModuloColorBorde { get; set; }
      
        
        [Column("ModuloColorFuente")]
        public string ModuloColorFuente { get; set; }
      
        
        [Column("ModuloIcono")]
        public string ModuloIcono { get; set; }
      
        
        [Column("ModuloRequiereProducto")]
        public bool? ModuloRequiereProducto { get; set; }
      
        
        [Column("PantallaID")]
        public int? PantallaID { get; set; }
      
        
        [Column("PantallaNombre")]
        public string PantallaNombre { get; set; }
      
        
        [Column("PantallaDescripcion")]
        public string PantallaDescripcion { get; set; }
      
        
        [Column("PantallaRuta")]
        public string PantallaRuta { get; set; }
      
        
        [Column("PermisoID")]
        public int? PermisoID { get; set; }
      
        
        [Column("PermisoNombre")]
        public string PermisoNombre { get; set; }
      
        
        [Column("PermisoDescripcion")]
        public string PermisoDescripcion { get; set; }
      
        
        [Column("PermisoEspecial")]
        public bool? PermisoEspecial { get; set; }
      
        
        [Column("PermisoRestUrl")]
        public string PermisoRestUrl { get; set; }
      
        
        [Column("PermisoRestMetodo")]
        public string PermisoRestMetodo { get; set; }
      
        
        [Column("ProductoNombre")]
        public string ProductoNombre { get; set; }
      
        
        [Column("ProductoActivo")]
        public bool? ProductoActivo { get; set; }
      
        
        [Column("ProductoPrincipal")]
        public bool? ProductoPrincipal { get; set; }
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }
      
        
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
