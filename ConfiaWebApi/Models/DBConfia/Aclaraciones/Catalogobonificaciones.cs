using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.CatalogoBonificaciones")]
    [ExplicitColumns]
    [PrimaryKey("BonificacionID")]
    public class CatalogoBonificaciones
    {
              
        
        [Column("BonificacionID")]
        public int BonificacionID { get; set; }
      
        
        [Column("Bonificacion")]
        public decimal Bonificacion { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }


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
