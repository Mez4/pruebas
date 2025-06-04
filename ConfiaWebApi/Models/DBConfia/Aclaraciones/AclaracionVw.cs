using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.Aclaracion_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Aclaracion_VW
    {
              
        
        [Column("AclaracionID")]
        public int AclaracionID { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("FechaInicioAsignacion")]
        public DateTime? FechaInicioAsignacion { get; set; }
      
        
        [Column("FechaFinalizacionSolicitud")]
        public DateTime? FechaFinalizacionSolicitud { get; set; }
      
        
        [Column("TiempoTotalSolicitud")]
        public int? TiempoTotalSolicitud { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("DistribuidorID")]
        public int DistribuidorID { get; set; }
      
        
        [Column("NombreDistribuidor")]
        public string NombreDistribuidor { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("DescripcionAclaracion")]
        public string DescripcionAclaracion { get; set; }
      
        
        [Column("EstatusID")]
        public int? EstatusID { get; set; }
      
        
        [Column("ClaveEstatus")]
        public string ClaveEstatus { get; set; }
      
        
        [Column("DescripcionEstatus")]
        public string DescripcionEstatus { get; set; }
      
        
        [Column("NotasTesoreria")]
        public string NotasTesoreria { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("MesaAclaracionID")]
        public int? MesaAclaracionID { get; set; }
      
        
        [Column("NombreMesaAclaracion")]
        public string NombreMesaAclaracion { get; set; }
      
        
        [Column("BonificacionID")]
        public int? BonificacionID { get; set; }
      
        
        [Column("PorcentajeBonificacion")]
        public decimal? PorcentajeBonificacion { get; set; }
      
        
        [Column("SolicitaID")]
        public int? SolicitaID { get; set; }
      
        
        [Column("NombreSolicita")]
        public string NombreSolicita { get; set; }
      
        
        [Column("FechaAsignacion")]
        public DateTime? FechaAsignacion { get; set; }
      
        
        [Column("AnalistaID")]
        public Int64? AnalistaID { get; set; }
      
        
        [Column("NombreAnalista")]
        public string NombreAnalista { get; set; }
      
        
        [Column("GerenteID")]
        public Int64? GerenteID { get; set; }
      
        
        [Column("NombreGerente")]
        public string NombreGerente { get; set; }
      
        
        [Column("Asiganada")]
        public bool? Asiganada { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("ClaveSolicitud")]
        public string ClaveSolicitud { get; set; }
      
        
        [Column("DescTipoSolicitud")]
        public string DescTipoSolicitud { get; set; }


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
