using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ValeraTrackingEstatus")]
    [ExplicitColumns]
    [PrimaryKey("ValeraTrackingEstatusID")]
    public class ValeraTrackingEstatus
    {
              
        
        [Column("ValeraTrackingEstatusID")]
        public int ValeraTrackingEstatusID { get; set; }
      
        
        [Column("TrackingEstatus")]
        public string TrackingEstatus { get; set; }
      
        
        [Column("Color")]
        public string Color { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___ValeraTrackingEstatusID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE ValeraTrackingEstatusID = @ValeraTrackingEstatusID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___ValeraTrackingEstatusID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE ValeraTrackingEstatusID = @ValeraTrackingEstatusID", this).ToListAsync();
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
