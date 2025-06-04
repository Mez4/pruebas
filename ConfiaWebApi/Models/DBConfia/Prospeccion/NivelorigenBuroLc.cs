using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.NivelOrigen_Buro_LC")]
    [ExplicitColumns]
    [PrimaryKey("NivelOrigen_BuroID")]
    public class NivelOrigen_Buro_LC
    {
              
        
        [Column("NivelOrigen_BuroID")]
        public int NivelOrigen_BuroID { get; set; }
      
        
        [Column("DistribuidorNivelOrigenID")]
        public int DistribuidorNivelOrigenID { get; set; }
      
        
        [Column("BuroInternoEstatusID")]
        public int BuroInternoEstatusID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
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
