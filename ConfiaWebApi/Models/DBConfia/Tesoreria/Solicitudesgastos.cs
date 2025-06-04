using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.SolicitudesGastos")]
    [ExplicitColumns]
    [PrimaryKey("SolicitudGastoID")]
    public class SolicitudesGastos
    {
              
        
        [Column("SolicitudGastoID")]
        public int SolicitudGastoID { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("EstatusSolicitudID")]
        public int EstatusSolicitudID { get; set; }
      
        
        [Column("SolicitanteID")]
        public int SolicitanteID { get; set; }
      
        
        [Column("AutorizadoID")]
        public int? AutorizadoID { get; set; }
      
        
        [Column("RechazadoID")]
        public int? RechazadoID { get; set; }
      
        
        [Column("AplicadoID")]
        public int? AplicadoID { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("FechaSolicitud")]
        public DateTime FechaSolicitud { get; set; }
      
        
        [Column("FechaAutorizada")]
        public DateTime? FechaAutorizada { get; set; }
      
        
        [Column("FechaRechazado")]
        public DateTime? FechaRechazado { get; set; }
      
        
        [Column("FechaAplicado")]
        public DateTime? FechaAplicado { get; set; }
      
        
        [Column("MontoSolicitado")]
        public decimal MontoSolicitado { get; set; }
      
        
        [Column("MontoAutorizado")]
        public decimal MontoAutorizado { get; set; }
      
        
        [Column("MovimientoID")]
        public Int64? MovimientoID { get; set; }
      
        
        [Column("AfectaSucursal")]
        public bool? AfectaSucursal { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("CanceladoID")]
        public int? CanceladoID { get; set; }
      
        
        [Column("FechaCancelado")]
        public DateTime? FechaCancelado { get; set; }
      
        
        [Column("DocumentosConfirmados")]
        public bool DocumentosConfirmados { get; set; }
      
        
        [Column("ObservacionesTesoreria")]
        public string ObservacionesTesoreria { get; set; }
      
        
        [Column("FechaDocumentosCon")]
        public DateTime? FechaDocumentosCon { get; set; }
      
        
        [Column("OrigenSucursalID")]
        public int OrigenSucursalID { get; set; }
      
        
        [Column("ProrratearGasto")]
        public bool ProrratearGasto { get; set; }
      
        
        [Column("Meses")]
        public int Meses { get; set; }
      
        
        [Column("Util")]
        public bool? Util { get; set; }


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
