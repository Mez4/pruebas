using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Sistema
{
    [TableName("Sistema.PermisosEspeciales_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class PermisosEspeciales_VW
    {
              
        
        [Column("PermisoID")]
        public int PermisoID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Especial")]
        public bool Especial { get; set; }
      
        
        [Column("NombrePantalla")]
        public string NombrePantalla { get; set; }
      
        
        [Column("DescPantalla")]
        public string DescPantalla { get; set; }
      
        
        [Column("NombreModulo")]
        public string NombreModulo { get; set; }
      
        
        [Column("Etiqueta")]
        public string Etiqueta { get; set; }
      
        
        [Column("RequiereProducto")]
        public bool? RequiereProducto { get; set; }


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
