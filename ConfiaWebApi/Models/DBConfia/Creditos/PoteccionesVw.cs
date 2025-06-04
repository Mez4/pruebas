using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Potecciones_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Potecciones_VW
    {
              
        
        [Column("ProteccionID")]
        public Int64 ProteccionID { get; set; }
      
        
        [Column("Minimo")]
        public decimal Minimo { get; set; }
      
        
        [Column("Maximo")]
        public decimal Maximo { get; set; }
      
        
        [Column("Monto")]
        public decimal? Monto { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("DistribuidorNivelOrigen")]
        public string DistribuidorNivelOrigen { get; set; }
      
        
        [Column("NombreCaptura")]
        public string NombreCaptura { get; set; }
      
        
        [Column("NombreModifica")]
        public string NombreModifica { get; set; }


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
