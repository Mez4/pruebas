using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Sistema
{
    [TableName("Sistema.ConsultasReportes")]
    [ExplicitColumns]
    [PrimaryKey("ReporteID")]
    public class ConsultasReportes
    {
              
        
        [Column("ReporteID")]
        public Int64 ReporteID { get; set; }
      
        
        [Column("PantallaID")]
        public Int64? PantallaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("SQL")]
        public string SQL { get; set; }
      
        
        [Column("Especial")]
        public bool? Especial { get; set; }


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
