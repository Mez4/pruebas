using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.BalanceTempDetalle")]
    [ExplicitColumns]
    [PrimaryKey("RegistroID")]
    public class BalanceTempDetalle
    {
              
        
        [Column("RegistroID")]
        public Int64 RegistroID { get; set; }
      
        
        [Column("BalanceTempID")]
        public Int64 BalanceTempID { get; set; }
      
        
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
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("MovimientoBoveda")]
        public bool MovimientoBoveda { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>> CH__CUENTA_Det(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>> CH__CUENTADESTINO_Det(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Creditos.Productos>> CH__PRODUCTOS_Det(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Bancos.Movimientos>> CH__TRASPASOS_Det(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.General.Sucursales>> CH__GASTOSUCURSAL_Det(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.General.Sucursales>> CH__SUCURSAL_Det(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS35378383_Det(DBConfiaContext parContext)
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
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
