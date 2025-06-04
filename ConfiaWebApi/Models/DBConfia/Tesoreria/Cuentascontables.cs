using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasContables")]
    [ExplicitColumns]
    [PrimaryKey("CuentaID")]
    public class CuentasContables
    {
              
        
        [Column("CuentaID")]
        public int CuentaID { get; set; }
      
        
        [Column("Cuenta")]
        public string Cuenta { get; set; }
      
        
        [Column("AcumulaCuentaID")]
        public int? AcumulaCuentaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("TipoID")]
        public int TipoID { get; set; }
      
        
        [Column("NaturalezaID")]
        public int NaturalezaID { get; set; }
      
        
        [Column("RubroID")]
        public int RubroID { get; set; }
      
        
        [Column("EmpresaID")]
        public int EmpresaID { get; set; }
      
        
        [Column("CatMonedaSatID")]
        public int CatMonedaSatID { get; set; }
      
        
        [Column("Activa")]
        public bool Activa { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("TipoBancoId")]
        public int? TipoBancoId { get; set; }
      
        
        [Column("Dispersa")]
        public bool? Dispersa { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Empresas>> CH__EMPRESA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Empresas>("WHERE EmpresaID = @empresaId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> CH__CUENTA_CONTABLE_ACUMULACION(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE AcumulaCuentaID = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.MonedaSAT>> CH__MONEDA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.MonedaSAT>("WHERE CatMonedaSatID = @MonedaSatID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.Rubro>> CH__RUBRO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.Rubro>("WHERE RubroID = @RubroID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.Naturaleza>> CH__NATURALEZA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.Naturaleza>("WHERE NaturalezaID = @NaturalezaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.TipoCuenta>> CH__TIPO_CUENTA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoCuenta>("WHERE TipoID = @TipoID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>> PA__Bancos___CatalogoCuentasBancos___CuentaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("WHERE CuentaID = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.CuentasSaldos>> PA__General___CuentasSaldos___CuentaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.CuentasSaldos>("WHERE CuentaID = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> PA__Tesoreria___CuentasContables___AcumulaCuentaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE CuentaID = @AcumulaCuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasProducto>> PA__Tesoreria___CuentasProducto___Capital(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasProducto>("WHERE CuentaID = @Capital", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasProducto>> PA__Tesoreria___CuentasProducto___InteresNormal(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasProducto>("WHERE CuentaID = @InteresNormal", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasProducto>> PA__Tesoreria___CuentasProducto___InteresNormalAcreedor(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasProducto>("WHERE CuentaID = @InteresNormalAcreedor", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasProducto>> PA__Tesoreria___CuentasProducto___InteresNormalDeudor(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasProducto>("WHERE CuentaID = @InteresNormalDeudor", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasProducto>> PA__Tesoreria___CuentasProducto___Iva(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasProducto>("WHERE CuentaID = @Iva", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasProducto>> PA__Tesoreria___CuentasProducto___InteresMoratorio(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasProducto>("WHERE CuentaID = @InteresMoratorio", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasProducto>> PA__Tesoreria___CuentasProducto___InteresMoratorioAcreedor(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasProducto>("WHERE CuentaID = @InteresMoratorioAcreedor", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasProducto>> PA__Tesoreria___CuentasProducto___InteresMoratorioDeudor(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasProducto>("WHERE CuentaID = @InteresMoratorioDeudor", this).ToListAsync();
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
