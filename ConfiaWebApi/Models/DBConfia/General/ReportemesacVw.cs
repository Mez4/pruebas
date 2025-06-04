using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.ReporteMesaC_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ReporteMesaC_VW
    {
              
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("Sucursal_Nombre")]
        public string Sucursal_Nombre { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("ZonaNombre")]
        public string ZonaNombre { get; set; }
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }
      
        
        [Column("empresaNombre")]
        public string empresaNombre { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("PersonaNombre")]
        public string PersonaNombre { get; set; }
      
        
        [Column("LineaCredito")]
        public decimal LineaCredito { get; set; }
      
        
        [Column("NombreUsuarioConsolida")]
        public string NombreUsuarioConsolida { get; set; }
      
        
        [Column("FHConsolida")]
        public DateTime? FHConsolida { get; set; }
      
        
        [Column("NombreUsuarioValida")]
        public string NombreUsuarioValida { get; set; }
      
        
        [Column("FechaValida")]
        public DateTime? FechaValida { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("EstatusBuroCredito")]
        public string EstatusBuroCredito { get; set; }
      
        
        [Column("Coordinador")]
        public string Coordinador { get; set; }
      
        
        [Column("Promotor")]
        public string Promotor { get; set; }


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
