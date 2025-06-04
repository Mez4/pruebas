using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.Bonificaciones")]
    [ExplicitColumns]
    [PrimaryKey("BonificacionID")]
    public class Bonificaciones
    {
              
        
        [Column("BonificacionID")]
        public int BonificacionID { get; set; }
      
        
        [Column("PorcentajeBonificacion")]
        public decimal PorcentajeBonificacion { get; set; }


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
