using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CatalogoCuentasBancos")]
    [ExplicitColumns]
    [PrimaryKey("CuentaBancoID")]
    public class CatalogoCuentasBancos
    {
              
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("CuentaID")]
        public int CuentaID { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("DispersionConvenio")]
        public string DispersionConvenio { get; set; }
      
        
        [Column("Global")]
        public bool Global { get; set; }
      
        
        [Column("PuedeDispersar")]
        public bool PuedeDispersar { get; set; }
      
        
        [Column("SaldoMinimo")]
        public decimal SaldoMinimo { get; set; }
      
        
        [Column("SaldoMaximo")]
        public decimal SaldoMaximo { get; set; }
      
        
        [Column("ExcedenteSaldo")]
        public decimal ExcedenteSaldo { get; set; }
      
        
        [Column("AgrupacionID")]
        public int? AgrupacionID { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("InstitucionOperante")]
        public string InstitucionOperante { get; set; }
      
        
        [Column("InstitucionContraparte")]
        public string InstitucionContraparte { get; set; }
      
        
        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }
      
        
        [Column("CobranzaConvenio")]
        public string CobranzaConvenio { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Disponible")]
        public bool Disponible { get; set; }
      
        
        [Column("EsBoveda")]
        public bool EsBoveda { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("CuentaBancariaPrincipalID")]
        public int CuentaBancariaPrincipalID { get; set; }
      
        
        [Column("BancoID")]
        public int? BancoID { get; set; }
      
        
        [Column("PuedeGenGastos")]
        public bool? PuedeGenGastos { get; set; }
      
        
        [Column("Activado")]
        public bool Activado { get; set; }
      
        
        [Column("bitConcentradora")]
        public bool bitConcentradora { get; set; }
      
        
        [Column("SaldosMovs_Sin_Balance")]
        public decimal? SaldosMovs_Sin_Balance { get; set; }
      
        
        [Column("FechaHoraUltMov")]
        public DateTime? FechaHoraUltMov { get; set; }
      
        
        [Column("BalanceVinculado")]
        public Int64? BalanceVinculado { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> CH__CUENTAS_CONTABLES(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE CuentaID = @CuentaID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Bancos.CuentasDesembolsosTipos>> PA__Bancos___CuentasDesembolsosTipos___cuentaId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.CuentasDesembolsosTipos>("WHERE CuentaBancoID = @cuentaId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.Movimientos>> PA__Bancos___Movimientos___CuentaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE CuentaBancoID = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.Movimientos>> PA__Bancos___Movimientos___CuentaDestinoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE CuentaBancoID = @CuentaDestinoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.MovimientosBancarios>> PA__Bancos___MovimientosBancarios___CuentaBancoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosBancarios>("WHERE CuentaBancoID = @CuentaBancoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>> PA__Tesoreria___BalanceTempDetalle___CuentaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>("WHERE CuentaBancoID = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>> PA__Tesoreria___BalanceTempDetalle___CuentaDestinoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>("WHERE CuentaBancoID = @CuentaDestinoID", this).ToListAsync();
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
