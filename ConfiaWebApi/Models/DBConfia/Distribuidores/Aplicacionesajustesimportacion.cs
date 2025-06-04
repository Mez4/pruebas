using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.AplicacionesAjustesImportacion")]
    [ExplicitColumns]
    [PrimaryKey("AplicacionAjusteId")]
    public class AplicacionesAjustesImportacion
    {
              
        
        [Column("ImporteAplicar")]
        public decimal? ImporteAplicar { get; set; }
      
        
        [Column("movimientoId")]
        public Int64? movimientoId { get; set; }
      
        
        [Column("AplicacionAjusteId")]
        public Int64 AplicacionAjusteId { get; set; }
      
        
        [Column("CreditoId")]
        public Int64? CreditoId { get; set; }
      
        
        [Column("fHRegistro")]
        public DateTime fHRegistro { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Creditos.Creditos>> CH__CREDITO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoId = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Distribuidores>> CH__DISTRIBUIDOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
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
