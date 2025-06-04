using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.AppCreditos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AppCreditos_VW
    {


        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }


        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }


        [Column("EstatusID")]
        public string EstatusID { get; set; }


        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }


        [Column("Plazos")]
        public int Plazos { get; set; }


        [Column("ProductoID")]
        public int ProductoID { get; set; }


        [Column("CondicionesID")]
        public int CondicionesID { get; set; }


        [Column("CondicionesRenglonId")]
        public int CondicionesRenglonId { get; set; }


        [Column("SucursalID")]
        public int SucursalID { get; set; }


        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }


        [Column("Capital")]
        public decimal Capital { get; set; }


        [Column("Interes")]
        public decimal Interes { get; set; }


        [Column("ManejoCuenta")]
        public decimal ManejoCuenta { get; set; }


        [Column("Seguro")]
        public decimal Seguro { get; set; }


        [Column("Cargo")]
        public decimal Cargo { get; set; }


        [Column("IVA")]
        public decimal IVA { get; set; }


        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }


        [Column("Abonos")]
        public decimal Abonos { get; set; }


        [Column("Comision")]
        public decimal? Comision { get; set; }


        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }


        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }


        [Column("DiasAtrasoMaximo")]
        public int DiasAtrasoMaximo { get; set; }


        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }


        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }


        [Column("FechaHoraDesembolso")]
        public DateTime? FechaHoraDesembolso { get; set; }


        [Column("FechaHoraUltimoPago")]
        public DateTime? FechaHoraUltimoPago { get; set; }


        [Column("SerieId")]
        public Int64? SerieId { get; set; }


        [Column("ValeCanje")]
        public Int64? ValeCanje { get; set; }


        [Column("CapitalPagado")]
        public decimal CapitalPagado { get; set; }


        [Column("CapitalPendientes")]
        public decimal? CapitalPendientes { get; set; }


        [Column("UsuarioIDRegistro")]
        public int UsuarioIDRegistro { get; set; }


        [Column("MovimientoID")]
        public Int64? MovimientoID { get; set; }


        [Column("PagosAtrasados")]
        public int PagosAtrasados { get; set; }


        [Column("TipoDesembolsoID")]
        public int? TipoDesembolsoID { get; set; }


        [Column("InteresPagado")]
        public decimal InteresPagado { get; set; }


        [Column("IVAPagado")]
        public decimal IVAPagado { get; set; }


        [Column("ManejoCuentaPagado")]
        public decimal ManejoCuentaPagado { get; set; }


        [Column("SeguroPagado")]
        public decimal SeguroPagado { get; set; }


        [Column("CargoPagado")]
        public decimal CargoPagado { get; set; }


        [Column("PorcCapital")]
        public decimal? PorcCapital { get; set; }


        [Column("PorcInteres")]
        public decimal? PorcInteres { get; set; }


        [Column("PorcManejoCuenta")]
        public decimal? PorcManejoCuenta { get; set; }


        [Column("PorcCargo")]
        public decimal? PorcCargo { get; set; }


        [Column("PorcIVA")]
        public decimal? PorcIVA { get; set; }


        [Column("PorcSeguro")]
        public decimal? PorcSeguro { get; set; }


        [Column("MotivoCancelacionID")]
        public int MotivoCancelacionID { get; set; }


        [Column("TasaInteres")]
        public decimal TasaInteres { get; set; }


        [Column("TasaIVA")]
        public decimal TasaIVA { get; set; }


        [Column("CostoSeguroPlazo")]
        public decimal CostoSeguroPlazo { get; set; }


        [Column("DispersionID")]
        public Int64? DispersionID { get; set; }


        [Column("PuedeDispersar")]
        public bool PuedeDispersar { get; set; }


        [Column("CostoSeguroDistribuidorXMil")]
        public decimal CostoSeguroDistribuidorXMil { get; set; }


        [Column("PrimerVencimiento")]
        public DateTime? PrimerVencimiento { get; set; }


        [Column("UltimoVencimiento")]
        public DateTime? UltimoVencimiento { get; set; }


        [Column("PlazosAdicionales")]
        public int PlazosAdicionales { get; set; }


        [Column("FHGeneracionPlazosAdicionales")]
        public DateTime? FHGeneracionPlazosAdicionales { get; set; }


        [Column("LineaAdicionalTipoID")]
        public int? LineaAdicionalTipoID { get; set; }


        [Column("referenciaMigracion")]
        public Int64? referenciaMigracion { get; set; }


        [Column("creditoClasificacionId")]
        public int creditoClasificacionId { get; set; }


        [Column("fechaPP")]
        public DateTime? fechaPP { get; set; }


        [Column("primaSeguro")]
        public decimal primaSeguro { get; set; }


        [Column("capitalPendienteDisponible")]
        public decimal capitalPendienteDisponible { get; set; }


        [Column("fechaHoraActivacion")]
        public DateTime? fechaHoraActivacion { get; set; }


        [Column("pagoModa")]
        public decimal? pagoModa { get; set; }


        [Column("PersonaIDRegistro")]
        public Int64 PersonaIDRegistro { get; set; }


        [Column("Reestructura")]
        public bool? Reestructura { get; set; }


        [Column("ReestructuraCreditoID")]
        public Int64? ReestructuraCreditoID { get; set; }


        [Column("VentaId")]
        public Int64? VentaId { get; set; }


        [Column("ReferenciaODP")]
        public string ReferenciaODP { get; set; }


        [Column("ConceptoODP")]
        public string ConceptoODP { get; set; }


        [Column("PrestamoNomina")]
        public bool PrestamoNomina { get; set; }


        [Column("refMigracionSis")]
        public int? refMigracionSis { get; set; }


        [Column("Observaciones")]
        public string Observaciones { get; set; }


        [Column("movCli")]
        public int? movCli { get; set; }


        [Column("personasDatosBancariosID")]
        public Int64? personasDatosBancariosID { get; set; }


        [Column("FechaVencimientoActual")]
        public DateTime? FechaVencimientoActual { get; set; }


        [Column("Activo")]
        public bool Activo { get; set; }


        [Column("LineaCredito")]
        public decimal LineaCredito { get; set; }


        [Column("LineaCreditoDisponible")]
        public decimal? LineaCreditoDisponible { get; set; }


        [Column("NoCreditosActivos")]
        public int NoCreditosActivos { get; set; }


        [Column("PagoPuntualUltmoPago")]
        public bool? PagoPuntualUltmoPago { get; set; }


        [Column("CapitalPendiente")]
        public decimal? CapitalPendiente { get; set; }


        [Column("InteresPendiente")]
        public decimal? InteresPendiente { get; set; }


        [Column("IVAPendiente")]
        public decimal? IVAPendiente { get; set; }


        [Column("ManejoCuentaPendiente")]
        public decimal? ManejoCuentaPendiente { get; set; }


        [Column("SeguroPendiente")]
        public decimal? SeguroPendiente { get; set; }


        [Column("CargoPendiente")]
        public decimal? CargoPendiente { get; set; }


        [Column("Ciclo")]
        public int Ciclo { get; set; }


        [Column("PersonaId")]
        public Int64 PersonaId { get; set; }


        [Column("convenioTipoID")]
        public int convenioTipoID { get; set; }


        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }


        [Column("FechaHoraUltimoIncremento")]
        public DateTime? FechaHoraUltimoIncremento { get; set; }


        [Column("EstatusNombre")]
        public string EstatusNombre { get; set; }


        [Column("codigoValeDig")]
        public string codigoValeDig { get; set; }
        [Column("STPEnvioID")]
        public long? STPEnvioID { get; set; }
        [Column("EnvioSTPEstatusID")]
        public string? EnvioSTPEstatusID { get; set; }


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
