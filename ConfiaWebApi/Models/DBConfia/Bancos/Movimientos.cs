using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.Movimientos")]
    [ExplicitColumns]
    [PrimaryKey("MovimientoID")]
    public class Movimientos
    {
              
        
        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }
      
        
        [Column("CuentaID")]
        public int CuentaID { get; set; }
      
        
        [Column("SucursalId")]
        public int SucursalId { get; set; }
      
        
        [Column("CuentaDestinoID")]
        public int? CuentaDestinoID { get; set; }
      
        
        [Column("FechaAfectacion")]
        public DateTime? FechaAfectacion { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("Importe")]
        public decimal Importe { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("TipoMovimientoID")]
        public int TipoMovimientoID { get; set; }
      
        
        [Column("ProductoId")]
        public int? ProductoId { get; set; }
      
        
        [Column("RefApl")]
        public Int64? RefApl { get; set; }
      
        
        [Column("gastoSucursal")]
        public int? gastoSucursal { get; set; }
      
        
        [Column("movimientoIdTraspaso")]
        public Int64? movimientoIdTraspaso { get; set; }
      
        
        [Column("cancelacionObservacion")]
        public string cancelacionObservacion { get; set; }
      
        
        [Column("cancelacionUsuario")]
        public Int64? cancelacionUsuario { get; set; }
      
        
        [Column("cancelacionImporte")]
        public decimal? cancelacionImporte { get; set; }
      
        
        [Column("cancelacionFhRegistro")]
        public DateTime? cancelacionFhRegistro { get; set; }
      
        
        [Column("cancelacionTipMovimiento")]
        public int? cancelacionTipMovimiento { get; set; }
      
        
        [Column("PolizaId")]
        public Int64? PolizaId { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("Contabilizado")]
        public bool? Contabilizado { get; set; }
      
        
        [Column("CajaId")]
        public int? CajaId { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("PeriodoID")]
        public int PeriodoID { get; set; }
      
        
        [Column("ObservacionesUsuario")]
        public string ObservacionesUsuario { get; set; }
      
        
        [Column("CatEstatusMovID")]
        public int CatEstatusMovID { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("UsuarioIDRegistra")]
        public int UsuarioIDRegistra { get; set; }
      
        
        [Column("MovimientoBoveda")]
        public bool MovimientoBoveda { get; set; }
      
        
        [Column("Bal_Apl")]
        public Int64? Bal_Apl { get; set; }
      
        
        [Column("BovedaID")]
        public Int64? BovedaID { get; set; }
      
        
        [Column("bitAplicado")]
        public bool? bitAplicado { get; set; }
      
        
        [Column("bitAplicadoResto")]
        public bool? bitAplicadoResto { get; set; }
      
        
        [Column("restoDNI")]
        public decimal? restoDNI { get; set; }
      
        
        [Column("AplicacionAfecta")]
        public Int64? AplicacionAfecta { get; set; }
      
        
        [Column("AplicacionAfectaResto")]
        public Int64? AplicacionAfectaResto { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>> CH__CUENTA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("WHERE CuentaID = @CuentaBancoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>> CH__CUENTADESTINO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("WHERE CuentaDestinoID = @CuentaBancoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Productos>> CH__PRODUCTOS(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoId = @ProductoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.Movimientos>> CH__TRASPASOS(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE MovimientoID = @MovimientoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Sucursales>> CH__GASTOSUCURSAL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE gastoSucursal = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Sucursales>> CH__SUCURSAL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalId = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS35378383(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDRegistra = @UsuarioID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Bancos.Movimientos>> PA__Bancos___Movimientos___MovimientoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE MovimientoID = @MovimientoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.MovimientosDetalle>> PA__Bancos___MovimientosDetalle___MovimientoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosDetalle>("WHERE MovimientoID = @MovimientoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___MovimientoIDCredito(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE MovimientoID = @MovimientoIDCredito", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___MovimientoIDLiquida(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE MovimientoID = @MovimientoIDLiquida", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>> PA__Tesoreria___BalanceTempDetalle___MovimientoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>("WHERE MovimientoID = @MovimientoID", this).ToListAsync();
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
