using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.TabuladoresTipos")]
    [ExplicitColumns]
    [PrimaryKey("tabuladorTipoId", AutoIncrement=false)]
    public class TabuladoresTipos
    {
              
        
        [Column("tabuladorTipoId")]
        public int tabuladorTipoId { get; set; }
      
        
        [Column("tabuladorTipoDesc")]
        public string tabuladorTipoDesc { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.Sucursales>> PA__General___Sucursales___tabuladorTipoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE tabuladorTipoId = @tabuladorTipoID", this).ToListAsync();
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
