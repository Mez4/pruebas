using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.NivelOrigen_Buro_LC_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class NivelOrigen_Buro_LC_VW
    {
              
        
        [Column("NivelOrigen_BuroID")]
        public int NivelOrigen_BuroID { get; set; }
      
        
        [Column("DistribuidorNivelOrigenID")]
        public int DistribuidorNivelOrigenID { get; set; }
      
        
        [Column("NivelOrigen")]
        public string NivelOrigen { get; set; }
      
        
        [Column("BuroInternoEstatusID")]
        public int BuroInternoEstatusID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("DistribuidorNivelInternoID")]
        public int DistribuidorNivelInternoID { get; set; }
      
        
        [Column("NivelInterno")]
        public string NivelInterno { get; set; }
      
        
        [Column("LineaCredito")]
        public int LineaCredito { get; set; }
      
        
        [Column("LineaCreditoMinimo")]
        public int? LineaCreditoMinimo { get; set; }


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
