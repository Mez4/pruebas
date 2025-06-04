using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasProducto")]
    [ExplicitColumns]
    [PrimaryKey("CuentaProductoid")]
    public class CuentasProducto
    {
              
        
        [Column("CuentaProductoid")]
        public int CuentaProductoid { get; set; }
      
        
        [Column("Capital")]
        public int Capital { get; set; }
      
        
        [Column("InteresNormal")]
        public int InteresNormal { get; set; }
      
        
        [Column("InteresMoratorio")]
        public int InteresMoratorio { get; set; }
      
        
        [Column("Iva")]
        public int Iva { get; set; }
      
        
        [Column("InteresNormalDeudor")]
        public int InteresNormalDeudor { get; set; }
      
        
        [Column("InteresNormalAcreedor")]
        public int InteresNormalAcreedor { get; set; }
      
        
        [Column("InteresMoratorioDeudor")]
        public int InteresMoratorioDeudor { get; set; }
      
        
        [Column("InteresMoratorioAcreedor")]
        public int InteresMoratorioAcreedor { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> CH__CUENTA_CONTABLE_CAPITAL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE Capital = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> CH__CUENTA_CONTABLE_INTERES_NORMAL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE InteresNormal = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> CH__CUENTA_CONTABLE_INTERES_NORMAL_ACREEDOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE InteresNormalAcreedor = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> CH__CUENTA_CONTABLE_INTERES_NORMAL_DEUDOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE InteresNormalDeudor = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> CH__CUENTA_CONTABLE_IVA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE Iva = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> CH__CUENTA_CONTABLE_MORATORIO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE InteresMoratorio = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> CH__CUENTA_CONTABLE_MORATORIO_ACREEDOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE InteresMoratorioAcreedor = @CuentaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> CH__CUENTA_CONTABLE_MORATORIO_DEUDOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE InteresMoratorioDeudor = @CuentaID", this).ToListAsync();
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
