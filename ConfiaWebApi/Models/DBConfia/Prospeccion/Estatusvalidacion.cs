using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.EstatusValidacion")]
    [ExplicitColumns]
    [PrimaryKey("EstatusValidacionID")]
    public class EstatusValidacion
    {
              
        
        [Column("EstatusValidacionID")]
        public int EstatusValidacionID { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Prospeccion.ValidacionMesa>> PA__Prospeccion___ValidacionMesa___EstatusValidacionID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ValidacionMesa>("WHERE EstatusValidacionID = @EstatusValidacionID", this).ToListAsync();
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
