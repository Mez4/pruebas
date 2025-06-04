using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.Abonos_x_Corte")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Abonos_x_Corte
    {
              
        
        [Column("id")]
        public Int64 id { get; set; }
      
        
        [Column("abonoId")]
        public Int64 abonoId { get; set; }
      
        
        [Column("corteId")]
        public Int64 corteId { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Cobranza.Cortes>> CH__Corte(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.Cortes>("WHERE corteId = @corteId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.Abonos>> CH__Abonos_x(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.Abonos>("WHERE abonoId = @abonoId", this).ToListAsync();
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
