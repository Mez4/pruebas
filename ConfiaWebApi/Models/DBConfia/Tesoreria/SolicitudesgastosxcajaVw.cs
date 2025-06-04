using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.SolicitudesGastosXCaja_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SolicitudesGastosXCaja_VW
    {
              
        
        [Column("SucursalCajaID")]
        public int? SucursalCajaID { get; set; }
      
        
        [Column("CanceladoID")]
        public int? CanceladoID { get; set; }
      
        
        [Column("RubroGastosID")]
        public int? RubroGastosID { get; set; }
      
        
        [Column("DescGasto")]
        public string DescGasto { get; set; }
      
        
        [Column("EstatusSolicitudID")]
        public int EstatusSolicitudID { get; set; }
      
        
        [Column("FechaDocumentosCon")]
        public DateTime? FechaDocumentosCon { get; set; }
      
        
        [Column("ObservacionesTesoreria")]
        public string ObservacionesTesoreria { get; set; }
      
        
        [Column("DocumentosConfirmados")]
        public bool DocumentosConfirmados { get; set; }
      
        
        [Column("AutorizadoID")]
        public int? AutorizadoID { get; set; }
      
        
        [Column("FechaCancelado")]
        public DateTime? FechaCancelado { get; set; }
      
        
        [Column("RechazadoID")]
        public int? RechazadoID { get; set; }
      
        
        [Column("AplicadoID")]
        public int? AplicadoID { get; set; }
      
        
        [Column("SolicitudGastoID")]
        public int SolicitudGastoID { get; set; }
      
        
        [Column("FechaSolicitud")]
        public DateTime FechaSolicitud { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("EstatusClave")]
        public string EstatusClave { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("NombreSucursalAfectada")]
        public string NombreSucursalAfectada { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("MontoSolicitado")]
        public decimal MontoSolicitado { get; set; }
      
        
        [Column("MontoAutorizado")]
        public decimal MontoAutorizado { get; set; }
      
        
        [Column("SolicitanteID")]
        public int SolicitanteID { get; set; }
      
        
        [Column("Solicitante")]
        public string Solicitante { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("FechaAutorizada")]
        public DateTime? FechaAutorizada { get; set; }
      
        
        [Column("FechaRechazado")]
        public DateTime? FechaRechazado { get; set; }
      
        
        [Column("FechaAplicado")]
        public DateTime? FechaAplicado { get; set; }
      
        
        [Column("SucursalAfecta")]
        public string SucursalAfecta { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


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
