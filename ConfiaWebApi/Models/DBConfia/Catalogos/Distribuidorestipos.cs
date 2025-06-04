using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.DistribuidoresTipos")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidorTiposID")]
    public class DistribuidoresTipos
    {
              
        
        [Column("DistribuidorTiposID")]
        public int DistribuidorTiposID { get; set; }
      
        
        [Column("DistribuidorTipos")]
        public string DistribuidorTipos { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Prospeccion.Prospectos>> PA__Prospeccion___Prospectos___DistribuidorTiposID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE DistribuidorTiposID = @DistribuidorTiposID", this).ToListAsync();
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
