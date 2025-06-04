using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Pagos
{
    [TableName("Pagos.AutorizacionesTipos")]
    [ExplicitColumns]
    [PrimaryKey("AutorizacionTipoID")]
    public class AutorizacionesTipos
    {
              
        
        [Column("AutorizacionTipoID")]
        public int AutorizacionTipoID { get; set; }
      
        
        [Column("AutorizacionTipo")]
        public string AutorizacionTipo { get; set; }
      
        
        [Column("Parametro")]
        public decimal? Parametro { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("Parametro2")]
        public decimal? Parametro2 { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Pagos.CodigosAutorizacionDetalle>> PA__Pagos___CodigosAutorizacionDetalle___AutorizacionTipoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Pagos.CodigosAutorizacionDetalle>("WHERE AutorizacionTipoID = @AutorizacionTipoID", this).ToListAsync();
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
