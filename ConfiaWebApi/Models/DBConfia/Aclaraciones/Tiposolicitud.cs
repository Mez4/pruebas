using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.TipoSolicitud")]
    [ExplicitColumns]
    [PrimaryKey("TipoSolicitudID")]
    public class TipoSolicitud
    {
              
        
        [Column("TipoSolicitudID")]
        public int TipoSolicitudID { get; set; }
      
        
        [Column("ClaveSolicitud")]
        public string ClaveSolicitud { get; set; }
      
        
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
        
        public async Task<List<DBContext.DBConfia.Aclaraciones.Aclaraciones>> PA__Aclaraciones___Aclaraciones___TipoSolicitudID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaraciones>("WHERE TipoSolicitudID = @TipoSolicitudID", this).ToListAsync();
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
