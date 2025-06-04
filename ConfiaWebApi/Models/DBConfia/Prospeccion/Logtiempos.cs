using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.LogTiempos")]
    [ExplicitColumns]
    [PrimaryKey("LogTiempoID")]
    public class LogTiempos
    {
              
        
        [Column("LogTiempoID")]
        public int LogTiempoID { get; set; }
      
        
        [Column("AsignaAnalistaID")]
        public int AsignaAnalistaID { get; set; }
      
        
        [Column("Tiempo")]
        public DateTime Tiempo { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64 StatusProcesoID { get; set; }
      
        
        [Column("Validado")]
        public bool? Validado { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Prospeccion.StatusProceso>> CH__STATUS_PROCESO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.StatusProceso>("WHERE StatusProcesoID = @StatusProcesoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.AsignaAnalista>> CH__ASIGNA_ANALiSTA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.AsignaAnalista>("WHERE AsignaAnalistaID = @AsignaAnalistaID", this).ToListAsync();
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
