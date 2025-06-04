using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ValerasFraccion")]
    [ExplicitColumns]
    [PrimaryKey("ValerasFraccionID")]
    public class ValerasFraccion
    {
              
        
        [Column("ValerasFraccionID")]
        public int ValerasFraccionID { get; set; }
      
        
        [Column("Fraccion")]
        public int Fraccion { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___ValerasFraccionID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE ValerasFraccionID = @ValerasFraccionID", this).ToListAsync();
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
