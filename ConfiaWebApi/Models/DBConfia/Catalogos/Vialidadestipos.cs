using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.VialidadesTipos")]
    [ExplicitColumns]
    [PrimaryKey("vialidadTipoId")]
    public class VialidadesTipos
    {
              
        
        [Column("vialidadTipoId")]
        public int vialidadTipoId { get; set; }
      
        
        [Column("vialidadTipo")]
        public string vialidadTipo { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.Direcciones>> PA__General___Direcciones___vialidadTipoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Direcciones>("WHERE vialidadTipoId = @vialidadTipoId", this).ToListAsync();
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
