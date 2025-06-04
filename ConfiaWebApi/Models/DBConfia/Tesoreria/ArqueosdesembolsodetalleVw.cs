using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosDesembolsoDetalle_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ArqueosDesembolsoDetalle_VW
    {
              
        
        [Column("ArqueoDesembolsoDetalleID")]
        public Int64 ArqueoDesembolsoDetalleID { get; set; }
      
        
        [Column("ArqueosDesembolsoID")]
        public int ArqueosDesembolsoID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64? ClienteID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("ValeCanje")]
        public Int64? ValeCanje { get; set; }
      
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }
      
        
        [Column("EstatusNombre")]
        public string EstatusNombre { get; set; }
      
        
        [Column("TipoDesembolsoID")]
        public int? TipoDesembolsoID { get; set; }
      
        
        [Column("TipoDesembolso")]
        public string TipoDesembolso { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }
      
        
        [Column("fechaHoraActivacion")]
        public DateTime? fechaHoraActivacion { get; set; }
      
        
        [Column("NombreCompletoRegistra")]
        public string NombreCompletoRegistra { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime? FechaHoraRegistro { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("Distribuidor")]
        public string Distribuidor { get; set; }


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
