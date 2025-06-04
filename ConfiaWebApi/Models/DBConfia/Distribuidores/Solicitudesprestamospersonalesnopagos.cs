using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.SolicitudesPrestamosPersonalesNoPagos")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SolicitudesPrestamosPersonalesNoPagos
    {
              
        
        [Column("SolicitudPrestamoPersonalID")]
        public int SolicitudPrestamoPersonalID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("PrestamoSolicitado")]
        public decimal PrestamoSolicitado { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("NoPago")]
        public int? NoPago { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }
      
        
        [Column("Interes")]
        public decimal? Interes { get; set; }
      
        
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
        [Column("ContratoID")]
        public Int64? ContratoID { get; set; }
      
        
        [Column("PlazoSolicitado")]
        public int? PlazoSolicitado { get; set; }


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
