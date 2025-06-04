using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.PagareEstatus")]
    [ExplicitColumns]
    [PrimaryKey("pagareEstatusId")]
    public class PagareEstatus
    {
              
        
        [Column("pagareEstatusId")]
        public int pagareEstatusId { get; set; }
      
        
        [Column("pagareEstatusDesc")]
        public string pagareEstatusDesc { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Creditos.Clientes>> PA__Creditos___Clientes___PagareEstatusId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes>("WHERE pagareEstatusId = @PagareEstatusId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Directores>> PA__General___Directores___PagareEstatusId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE pagareEstatusId = @PagareEstatusId", this).ToListAsync();
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
