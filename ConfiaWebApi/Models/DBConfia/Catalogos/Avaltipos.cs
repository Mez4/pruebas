using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.AvalTipos")]
    [ExplicitColumns]
    [PrimaryKey("avalTipoId")]
    public class AvalTipos
    {
              
        
        [Column("avalTipoId")]
        public int avalTipoId { get; set; }
      
        
        [Column("avalTipo")]
        public string avalTipo { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }
      
        
        [Column("color")]
        public string color { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Distribuidores.Avales>> PA__Distribuidores___Avales___TipoAvalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Avales>("WHERE avalTipoId = @TipoAvalID", this).ToListAsync();
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
