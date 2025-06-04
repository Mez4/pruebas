using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.DatosDeDispersion_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DatosDeDispersion_VW
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("SerieId")]
        public Int64? SerieId { get; set; }
      
        
        [Column("ValeCanje")]
        public Int64? ValeCanje { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("Plazos")]
        public int Plazos { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64 PersonaIDRegistro { get; set; }
      
        
        [Column("TipoDesembolsoID")]
        public int TipoDesembolsoID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }


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
