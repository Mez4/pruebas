using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Productos")]
    [ExplicitColumns]
    [PrimaryKey("ProductoID")]
    public class Productos
    {


        [Column("ProductoID")]
        public int ProductoID { get; set; }


        [Column("EmpresaId")]
        public int EmpresaId { get; set; }


        [Column("Producto")]
        public string Producto { get; set; }


        [Column("Activo")]
        public bool Activo { get; set; }


        [Column("TasaTipoId")]
        public string TasaTipoId { get; set; }


        [Column("DiasPago")]
        public string DiasPago { get; set; }


        [Column("DiaParaCorte")]
        public int? DiaParaCorte { get; set; }


        [Column("PrioridadCobranza")]
        public int? PrioridadCobranza { get; set; }


        [Column("RequiereDistribuidor")]
        public bool RequiereDistribuidor { get; set; }


        [Column("RequiereGrupo")]
        public bool RequiereGrupo { get; set; }


        [Column("ValidaDisponible")]
        public bool ValidaDisponible { get; set; }


        [Column("Restructura")]
        public bool Restructura { get; set; }


        [Column("GeneraDesembolso")]
        public bool GeneraDesembolso { get; set; }


        [Column("SeguroFinanciado")]
        public bool SeguroFinanciado { get; set; }


        [Column("Canje")]
        public bool Canje { get; set; }


        [Column("DesglosarIVA")]
        public bool DesglosarIVA { get; set; }


        [Column("EdadMinima")]
        public int EdadMinima { get; set; }


        [Column("EdadMaxima")]
        public int EdadMaxima { get; set; }


        [Column("CapitalAlFinal")]
        public bool CapitalAlFinal { get; set; }


        [Column("CargoFinanciado")]
        public bool CargoFinanciado { get; set; }


        [Column("CargoAlInicio")]
        public bool CargoAlInicio { get; set; }


        [Column("ActivaCredito")]
        public bool ActivaCredito { get; set; }


        [Column("CreditosLiquidadosReq")]
        public bool CreditosLiquidadosReq { get; set; }


        [Column("PermisoEspecial")]
        public bool PermisoEspecial { get; set; }


        [Column("ValidarCondiciones")]
        public bool ValidarCondiciones { get; set; }


        [Column("FhRegitro")]
        public DateTime FhRegitro { get; set; }


        [Column("FhMoficiacion")]
        public DateTime FhMoficiacion { get; set; }


        [Column("AplicaIVAInteres")]
        public bool AplicaIVAInteres { get; set; }


        [Column("AplicaIVASeguro")]
        public bool AplicaIVASeguro { get; set; }


        [Column("AplicaIVAManejoCuenta")]
        public bool AplicaIVAManejoCuenta { get; set; }


        [Column("Logo")]
        public byte[] Logo { get; set; }


        [Column("AdicProductoId")]
        public int? AdicProductoId { get; set; }


        [Column("UsuarioRegistro")]
        public int? UsuarioRegistro { get; set; }


        [Column("UsuarioModifico")]
        public int? UsuarioModifico { get; set; }


        [Column("CtaCapitalId")]
        public int? CtaCapitalId { get; set; }


        [Column("CtaInteresNormalId")]
        public int? CtaInteresNormalId { get; set; }


        [Column("CtaInteresMoraId")]
        public int? CtaInteresMoraId { get; set; }


        [Column("CtaIvaId")]
        public int? CtaIvaId { get; set; }


        [Column("CtaInteresNormDeudorId")]
        public int? CtaInteresNormDeudorId { get; set; }


        [Column("CtaInteresNormAcreedorId")]
        public int? CtaInteresNormAcreedorId { get; set; }


        [Column("CtaInteresMoraDeudorId")]
        public int? CtaInteresMoraDeudorId { get; set; }


        [Column("CtaInteresMoraAcreedorId")]
        public int? CtaInteresMoraAcreedorId { get; set; }


        [Column("SerieId")]
        public Int64? SerieId { get; set; }


        [Column("EmpresaStpID")]
        public int? EmpresaStpID { get; set; }


        [Column("PrestamoPersonal")]
        public bool? PrestamoPersonal { get; set; }


        [Column("DescripcionApp")]
        public string DescripcionApp { get; set; }


        [Column("EsNomina")]
        public bool EsNomina { get; set; }


        [Column("PersonaResponsableID")]
        public Int64? PersonaResponsableID { get; set; }


        [Column("Principal")]
        public bool? Principal { get; set; }


        [Column("DiasCaducidadVale")]
        public decimal? DiasCaducidadVale { get; set; }


        [Column("DiasCaducidadFolio")]
        public decimal? DiasCaducidadFolio { get; set; }


        [Column("Tiendita")]
        public bool? Tiendita { get; set; }


        [Column("PPI")]
        public bool? PPI { get; set; }


        [Column("ProteccionSaldo")]
        public bool? ProteccionSaldo { get; set; }


        [Column("EsOperativo")]
        public bool? EsOperativo { get; set; }


        [Column("CuentaMaestraId")]
        public int? CuentaMaestraId { get; set; }


        [Column("AplicaComision")]
        public bool? AplicaComision { get; set; }


        [Column("TipoProductoID")]
        public int? TipoProductoID { get; set; }

        [Column("Relacionesbloqueadas")]
        public bool Relacionesbloqueadas { get; set; }


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

        public async Task<List<DBContext.DBConfia.Bancos.Movimientos>> PA__Bancos___Movimientos___ProductoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE ProductoID = @ProductoId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.PorCobrar>> PA__Cobranza___PorCobrar___productoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.PorCobrar>("WHERE ProductoID = @productoId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.RelacionMesaProducto>> PA__Cobranza___RelacionMesaProducto___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.RelacionMesaProducto>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.tabDiasMora>> PA__Cobranza___tabDiasMora___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.tabDiasMora>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CanjesValeApp>> PA__Creditos___CanjesValeApp___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CanjesValeApp>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CondicionesSucursal>> PA__Creditos___CondicionesSucursal___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CondicionesSucursal>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Promotores>> PA__Creditos___Promotores___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Promotores>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraSeries>> PA__Distribuidores___ValeraSeries___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraSeries>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.MatrizProcesos>> PA__Prospeccion___MatrizProcesos___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.MatrizProcesos>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.ProductoMesaCredito>> PA__Prospeccion___ProductoMesaCredito___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ProductoMesaCredito>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Prospectos>> PA__Prospeccion___Prospectos___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.TipoDocumento>> PA__Prospeccion___TipoDocumento___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.TipoDocumento>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.TipoDocumentoAval>> PA__Prospeccion___TipoDocumentoAval___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.TipoDocumentoAval>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios_Roles>> PA__Seguridad___Usuarios_Roles___ProductoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Roles>("WHERE ProductoID = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>> PA__Tesoreria___BalanceTempDetalle___ProductoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>("WHERE ProductoID = @ProductoId", this).ToListAsync();
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
