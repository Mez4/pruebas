using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.CuentasDesembolsosTipos")]
    [ExplicitColumns]
    [PrimaryKey("cuentaId,tipoDesembolsoId", AutoIncrement=false)]
    public class CuentasDesembolsosTipos
    {
              
        
        [Column("Id")]
        public int Id { get; set; }
      
        
        [Column("cuentaId")]
        public int cuentaId { get; set; }
      
        
        [Column("tipoDesembolsoId")]
        public int tipoDesembolsoId { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Bancos.TiposDesembolso>> CH__TIPO_DESENBOLSO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.TiposDesembolso>("WHERE tipoDesembolsoId = @TipoDesembolsoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>> CH__CUENTA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("WHERE cuentaId = @CuentaBancoID", this).ToListAsync();
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
