using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Pagos
{
    [TableName("Pagos.CodigosAutorizacionDetalle")]
    [ExplicitColumns]
    [PrimaryKey("AutorizacionTipoID,CodigoAutorizacionID", AutoIncrement=false)]
    public class CodigosAutorizacionDetalle
    {
              
        
        [Column("CodigoAutorizacionID")]
        public Int64 CodigoAutorizacionID { get; set; }
      
        
        [Column("AutorizacionTipoID")]
        public int AutorizacionTipoID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Pagos.AutorizacionesTipos>> CH__AutorizacionTipo(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Pagos.AutorizacionesTipos>("WHERE AutorizacionTipoID = @AutorizacionTipoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Pagos.CodigosAutorizacion>> CH__CodigoAut(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Pagos.CodigosAutorizacion>("WHERE CodigoAutorizacionID = @CodigoAutorizacionID", this).ToListAsync();
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
