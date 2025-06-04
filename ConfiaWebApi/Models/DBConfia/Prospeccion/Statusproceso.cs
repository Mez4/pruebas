using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.StatusProceso")]
    [ExplicitColumns]
    [PrimaryKey("StatusProcesoID")]
    public class StatusProceso
    {
              
        
        [Column("StatusProcesoID")]
        public Int64 StatusProcesoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Prospeccion.LogMensajes>> PA__Prospeccion___LogMensajes___StatusProcesoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.LogMensajes>("WHERE StatusProcesoID = @StatusProcesoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.LogTiempos>> PA__Prospeccion___LogTiempos___StatusProcesoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.LogTiempos>("WHERE StatusProcesoID = @StatusProcesoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.MatrizProcesosDetalle>> PA__Prospeccion___MatrizProcesosDetalle___StatusProcesoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.MatrizProcesosDetalle>("WHERE StatusProcesoID = @StatusProcesoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.MensajesRelacion>> PA__Prospeccion___MensajesRelacion___StatusProcesoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.MensajesRelacion>("WHERE StatusProcesoID = @StatusProcesoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Prospectos>> PA__Prospeccion___Prospectos___StatusProcesoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE StatusProcesoID = @StatusProcesoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Tuberia>> PA__Prospeccion___Tuberia___StatusProcesoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Tuberia>("WHERE StatusProcesoID = @StatusProcesoID", this).ToListAsync();
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
