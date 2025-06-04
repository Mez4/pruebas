using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ValeraSeriesTipos")]
    [ExplicitColumns]
    [PrimaryKey("ValeraSeriesTiposID")]
    public class ValeraSeriesTipos
    {
              
        
        [Column("ValeraSeriesTiposID")]
        public int ValeraSeriesTiposID { get; set; }
      
        
        [Column("Tipo")]
        public string Tipo { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraSeries>> PA__Distribuidores___ValeraSeries___ValeraSeriesTiposID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraSeries>("WHERE ValeraSeriesTiposID = @ValeraSeriesTiposID", this).ToListAsync();
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
