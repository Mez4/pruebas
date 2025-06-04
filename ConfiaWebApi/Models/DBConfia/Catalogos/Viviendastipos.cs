using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.ViviendasTipos")]
    [ExplicitColumns]
    [PrimaryKey("ViviendaTipoId")]
    public class ViviendasTipos
    {
              
        
        [Column("ViviendaTipoId")]
        public int ViviendaTipoId { get; set; }
      
        
        [Column("ViviendaTipo")]
        public string ViviendaTipo { get; set; }
      
        
        [Column("Activa")]
        public bool Activa { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.Direcciones>> PA__General___Direcciones___ViviendaTipoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Direcciones>("WHERE ViviendaTipoId = @ViviendaTipoId", this).ToListAsync();
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
