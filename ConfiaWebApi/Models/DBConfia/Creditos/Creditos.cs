using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Creditos")]
    [ExplicitColumns]
    [PrimaryKey("CreditoID")]
    public class Creditos
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
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
        [Column("Abonos")]
        public decimal Abonos { get; set; }
      
        
        [Column("Comision")]
        public decimal? Comision { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
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
      
        [ComputedColumn(ComputedColumnType.Always)]
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
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcCapital")]
        public decimal? PorcCapital { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcInteres")]
        public decimal? PorcInteres { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcManejoCuenta")]
        public decimal? PorcManejoCuenta { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcCargo")]
        public decimal? PorcCargo { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcIVA")]
        public decimal? PorcIVA { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
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
      
        [ComputedColumn(ComputedColumnType.Always)]
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
      
        
        [Column("CreditoAnteriorID")]
        public Int64? CreditoAnteriorID { get; set; }
      
        
        [Column("ConvenioID")]
        public Int64? ConvenioID { get; set; }
      
        
        [Column("ReintentoDispersion")]
        public bool ReintentoDispersion { get; set; }
      
        
        [Column("ReintentosDeDispersion")]
        public int ReintentosDeDispersion { get; set; }
      
        
        [Column("CajaID")]
        public int? CajaID { get; set; }
      
        
        [Column("Autorizado")]
        public bool? Autorizado { get; set; }
      
        
        [Column("UsuarioIDModifico")]
        public int? UsuarioIDModifico { get; set; }
      
        
        [Column("FechaHoraModificacion")]
        public DateTime? FechaHoraModificacion { get; set; }
      
        
        [Column("MvCancelacion")]
        public string MvCancelacion { get; set; }
      
        
        [Column("NombreBeneficiario")]
        public string NombreBeneficiario { get; set; }
      
        
        [Column("ParentescoBeneficiario")]
        public string ParentescoBeneficiario { get; set; }
      
        
        [Column("FechaNacimientoBeneficiario")]
        public DateTime? FechaNacimientoBeneficiario { get; set; }
      
        
        [Column("ApellidoPaternoBeneficiario")]
        public string ApellidoPaternoBeneficiario { get; set; }
      
        
        [Column("ApellidoMaternoBeneficiario")]
        public string ApellidoMaternoBeneficiario { get; set; }
      
        
        [Column("DistribuidorNivelOrigenID")]
        public int? DistribuidorNivelOrigenID { get; set; }
      
        
        [Column("TipoCancelacionID")]
        public int? TipoCancelacionID { get; set; }
      
        
        [Column("Tiendita")]
        public decimal? Tiendita { get; set; }
      
        
        [Column("TipoCreditoID")]
        public int? TipoCreditoID { get; set; }
      
        
        [Column("IDExterno")]
        public string IDExterno { get; set; }
      
        
        [Column("IDSisFecha")]
        public string IDSisFecha { get; set; }
      
        
        [Column("ref_ban")]
        public Int64? ref_ban { get; set; }

        [Column("STPEnvioID")]
        public Int64? STPEnvioID { get; set; }

        
        [Column("ODPBancomerEnvioID")]
        public int? ODPBancomerEnvioID { get; set; }

        [Column("CreditoZona")]
        public bool? CreditoZona { get; set; }
        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.PersonasDatosBancarios>> CH__Creditos(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.PersonasDatosBancarios>("WHERE personasDatosBancariosID = @personasDatosBancariosID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS79CDC1BA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDRegistro = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Bancos.MovimientosBancarios>> PA__Bancos___MovimientosBancarios___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosBancarios>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.MovimientosDetalle>> PA__Bancos___MovimientosDetalle___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosDetalle>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.PorCobrar>> PA__Cobranza___PorCobrar___creditoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.PorCobrar>("WHERE CreditoID = @creditoId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortesDetalle>> PA__Cortes___RelacionCortesDetalle___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortesDetalle>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortesDetalleHistorico>> PA__Cortes___RelacionCortesDetalleHistorico___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortesDetalleHistorico>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Avales>> PA__Creditos___Avales___CreditoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Avales>("WHERE CreditoID = @CreditoId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CanjesValeApp>> PA__Creditos___CanjesValeApp___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CanjesValeApp>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CreditosApp>> PA__Creditos___CreditosApp___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CreditosApp>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Historico>> PA__Creditos___Historico___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Historico>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Notas>> PA__Creditos___Notas___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Notas>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.PlanPagos>> PA__Creditos___PlanPagos___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.PlanPagos>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.PlanPagosHistorico>> PA__Creditos___PlanPagosHistorico___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.PlanPagosHistorico>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Reestructura>> PA__Creditos___Reestructura___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Reestructura>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ReestructuraDetalle>> PA__Creditos___ReestructuraDetalle___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ReestructuraDetalle>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructuraClientes>> PA__Creditos___SolicitudReestructuraClientes___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructuraClientes>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.AplicacionesAjustesImportacion>> PA__Distribuidores___AplicacionesAjustesImportacion___CreditoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.AplicacionesAjustesImportacion>("WHERE CreditoID = @CreditoId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.STP.Dispersiones>> PA__STP___Dispersiones___CreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.STP.Dispersiones>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
