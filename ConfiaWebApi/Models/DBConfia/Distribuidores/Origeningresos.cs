using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.OrigenIngresos")]
    [ExplicitColumns]
    [PrimaryKey("OrigenIngresoID")]
    public class OrigenIngresos
    {
              
        
        [Column("OrigenIngresoID")]
        public int OrigenIngresoID { get; set; }
      
        
        [Column("OrigenIngreso")]
        public string OrigenIngreso { get; set; }
      
        
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
