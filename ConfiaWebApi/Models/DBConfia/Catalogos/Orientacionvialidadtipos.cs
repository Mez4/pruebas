using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.OrientacionVialidadTipos")]
    [ExplicitColumns]
    [PrimaryKey("orientacionVialidadTipoId")]
    public class OrientacionVialidadTipos
    {
              
        
        [Column("orientacionVialidadTipoId")]
        public int orientacionVialidadTipoId { get; set; }
      
        
        [Column("orientacionVialidadTipo")]
        public string orientacionVialidadTipo { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.Direcciones>> PA__General___Direcciones___orientacionVialidadTipoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Direcciones>("WHERE orientacionVialidadTipoId = @orientacionVialidadTipoId", this).ToListAsync();
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
