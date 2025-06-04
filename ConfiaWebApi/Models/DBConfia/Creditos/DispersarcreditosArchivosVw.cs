using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.DispersarCreditos_Archivos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DispersarCreditos_Archivos_VW
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
      
        
        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("ZonaNombre")]
        public string ZonaNombre { get; set; }
      
        
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
        public decimal ImporteTotal { get; set; }
      
        
        [Column("Abonos")]
        public decimal Abonos { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("DiasAtrasoMaximo")]
        public int DiasAtrasoMaximo { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }
      
        
        [Column("FechaHoraDesembolso")]
        public DateTime FechaHoraDesembolso { get; set; }
      
        
        [Column("FechaHoraUltimoPago")]
        public DateTime FechaHoraUltimoPago { get; set; }
      
        
        [Column("ValeCanje")]
        public Int64? ValeCanje { get; set; }
      
        
        [Column("CapitalPagado")]
        public decimal CapitalPagado { get; set; }
      
        
        [Column("CapitalPendientes")]
        public decimal? CapitalPendientes { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int UsuarioIDRegistro { get; set; }
      
        
        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }
      
        
        [Column("Bal_Apl")]
        public Int64? Bal_Apl { get; set; }
      
        
        [Column("EstatusMovimiento")]
        public int? EstatusMovimiento { get; set; }
      
        
        [Column("EstatusDescMovimiento")]
        public string EstatusDescMovimiento { get; set; }
      
        
        [Column("PagosAtrasados")]
        public int PagosAtrasados { get; set; }
      
        
        [Column("TipoDesembolsoID")]
        public int? TipoDesembolsoID { get; set; }
      
        
        [Column("TipoDesembolso")]
        public string TipoDesembolso { get; set; }
      
        
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
        public Int64 DispersionID { get; set; }
      
        
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
      
        
        [Column("EmpresaId")]
        public int EmpresaId { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("TasaTipoId")]
        public string TasaTipoId { get; set; }
      
        
        [Column("TasaTipo")]
        public string TasaTipo { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("ApellidoPaterno")]
        public string ApellidoPaterno { get; set; }
      
        
        [Column("ApellidoMaterno")]
        public string ApellidoMaterno { get; set; }
      
        
        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }
      
        
        [Column("LugarNacimiento")]
        public string LugarNacimiento { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("SexoID")]
        public string SexoID { get; set; }
      
        
        [Column("Sexo")]
        public string Sexo { get; set; }
      
        
        [Column("EstadoCivilID")]
        public string EstadoCivilID { get; set; }
      
        
        [Column("EstadoCivil")]
        public string EstadoCivil { get; set; }
      
        
        [Column("EscolaridadID")]
        public int? EscolaridadID { get; set; }
      
        
        [Column("Escolaridad")]
        public string Escolaridad { get; set; }
      
        
        [Column("IngresosMensuales")]
        public decimal IngresosMensuales { get; set; }
      
        
        [Column("DependientesEconomicos")]
        public int? DependientesEconomicos { get; set; }
      
        
        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("NombreConyuge")]
        public string NombreConyuge { get; set; }
      
        
        [Column("BuroInternoEstatusID")]
        public int? BuroInternoEstatusID { get; set; }
      
        
        [Column("BuroInternoEstatus")]
        public string BuroInternoEstatus { get; set; }
      
        
        [Column("BuroInternoEstatusPuedeCanjear")]
        public bool? BuroInternoEstatusPuedeCanjear { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("identificacionTipoId")]
        public int? identificacionTipoId { get; set; }
      
        
        [Column("identificacionTipo")]
        public string identificacionTipo { get; set; }
      
        
        [Column("identificacionNumero")]
        public string identificacionNumero { get; set; }
      
        
        [Column("canjeValeSolicitudId")]
        public Int64 canjeValeSolicitudId { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("PagareCantidad")]
        public decimal PagareCantidad { get; set; }
      
        
        [Column("PagareEstatusId")]
        public int PagareEstatusId { get; set; }
      
        
        [Column("pagareEstatusDesc")]
        public string pagareEstatusDesc { get; set; }
      
        
        [Column("LineaCreditoPersonal")]
        public decimal LineaCreditoPersonal { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("AvalPersona")]
        public Int64? AvalPersona { get; set; }
      
        
        [Column("Aval")]
        public string Aval { get; set; }
      
        
        [Column("AvalTelefono")]
        public string AvalTelefono { get; set; }
      
        
        [Column("NoCreditosActivos")]
        public int NoCreditosActivos { get; set; }
      
        
        [Column("EstatusNombre")]
        public string EstatusNombre { get; set; }
      
        
        [Column("Distribuidor")]
        public string Distribuidor { get; set; }
      
        
        [Column("CelularDistribuidor")]
        public string CelularDistribuidor { get; set; }
      
        
        [Column("empresaNombre")]
        public string empresaNombre { get; set; }
      
        
        [Column("NombreBanco")]
        public string NombreBanco { get; set; }
      
        
        [Column("DispersionConvenio")]
        public string DispersionConvenio { get; set; }
      
        
        [Column("FormatoImpresionExtra")]
        public bool? FormatoImpresionExtra { get; set; }
      
        
        [Column("TipoMovimientoID")]
        public int? TipoMovimientoID { get; set; }
      
        
        [Column("VentaId")]
        public Int64 VentaId { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64 CoordinadorID { get; set; }
      
        
        [Column("Comision")]
        public decimal? Comision { get; set; }
      
        
        [Column("SerieId")]
        public Int64? SerieId { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64 PersonaIDRegistro { get; set; }
      
        
        [Column("Reestructura")]
        public bool Reestructura { get; set; }
      
        
        [Column("ReestructuraCreditoID")]
        public Int64 ReestructuraCreditoID { get; set; }
      
        
        [Column("BuroInternoColor")]
        public string BuroInternoColor { get; set; }
      
        
        [Column("RequiereGrupo")]
        public bool RequiereGrupo { get; set; }
      
        
        [Column("Referencia")]
        public string Referencia { get; set; }
      
        
        [Column("Concepto")]
        public string Concepto { get; set; }
      
        
        [Column("Logo")]
        public byte[] Logo { get; set; }
      
        
        [Column("LogoBanco")]
        public byte[] LogoBanco { get; set; }
      
        
        [Column("personasDatosBancariosID")]
        public Int64? personasDatosBancariosID { get; set; }
      
        
        [Column("Color")]
        public string Color { get; set; }
      
        
        [Column("CajaID")]
        public int? CajaID { get; set; }
      
        
        [Column("Autorizado")]
        public bool? Autorizado { get; set; }
      
        
        [Column("Principal")]
        public bool? Principal { get; set; }
      
        
        [Column("PrestamoPersonal")]
        public bool? PrestamoPersonal { get; set; }
      
        
        [Column("EsReintento")]
        public bool EsReintento { get; set; }
      
        
        [Column("ReintentosDis")]
        public int ReintentosDis { get; set; }
      
        
        [Column("EsNomina")]
        public bool EsNomina { get; set; }
      
        
        [Column("NombreCompletoRegistra")]
        public string NombreCompletoRegistra { get; set; }
      
        
        [Column("MvCancelacion")]
        public string MvCancelacion { get; set; }
      
        
        [Column("NombreBeneficiario")]
        public string NombreBeneficiario { get; set; }
      
        
        [Column("ParentescoBeneficiario")]
        public string ParentescoBeneficiario { get; set; }
      
        
        [Column("FechaNacimientoBeneficiario")]
        public DateTime? FechaNacimientoBeneficiario { get; set; }
      
        
        [Column("IDExterno")]
        public string IDExterno { get; set; }
      
        
        [Column("Tiendita")]
        public decimal? Tiendita { get; set; }
      
        
        [Column("TipoCreditoDescripcion")]
        public string TipoCreditoDescripcion { get; set; }
      
        
        [Column("datoTipoID")]
        public int? datoTipoID { get; set; }
      
        
        [Column("cveBancoRef")]
        public int? cveBancoRef { get; set; }
      
        
        [Column("datoBancario")]
        public string datoBancario { get; set; }
      
        
        [Column("fechaRegistro")]
        public DateTime? fechaRegistro { get; set; }
      
        
        [Column("DatoActivo")]
        public bool? DatoActivo { get; set; }
      
        
        [Column("NombreBancoClabe")]
        public string NombreBancoClabe { get; set; }
      
        
        [Column("BancoStpID")]
        public int? BancoStpID { get; set; }
      
        
        [Column("TipoDatoID")]
        public int? TipoDatoID { get; set; }
      
        
        [Column("DatoTipoDesc")]
        public string DatoTipoDesc { get; set; }


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
