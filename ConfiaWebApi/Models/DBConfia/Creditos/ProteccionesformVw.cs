using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ProteccionesForm_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProteccionesForm_VW
    {
              
        
        [Column("ProteccionID")]
        public Int64 ProteccionID { get; set; }
      
        
        [Column("Minimo")]
        public decimal Minimo { get; set; }
      
        
        [Column("Maximo")]
        public decimal Maximo { get; set; }
      
        
        [Column("NivelOrigenDetalle")]
        public string NivelOrigenDetalle { get; set; }
      
        
        [Column("DistribuidorNivelDetalle")]
        public string DistribuidorNivelDetalle { get; set; }


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
