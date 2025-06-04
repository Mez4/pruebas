using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.MonedaSAT")]
    [ExplicitColumns]
    [PrimaryKey("MonedaSatID")]
    public class MonedaSAT
    {
              
        
        [Column("MonedaSatID")]
        public int MonedaSatID { get; set; }
      
        
        [Column("NombreMoneda")]
        public string NombreMoneda { get; set; }
      
        
        [Column("TipoCambio")]
        public decimal TipoCambio { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("ClaveMonedaSat")]
        public string ClaveMonedaSat { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Tesoreria.CuentasContables>> PA__Tesoreria___CuentasContables___CatMonedaSatID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE MonedaSatID = @CatMonedaSatID", this).ToListAsync();
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
