using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.EstadosCiviles")]
    [ExplicitColumns]
    [PrimaryKey("EstadoCivilID", AutoIncrement=false)]
    public class EstadosCiviles
    {
              
        
        [Column("EstadoCivilID")]
        public string EstadoCivilID { get; set; }
      
        
        [Column("EstadoCivil")]
        public string EstadoCivil { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.General.Personas>> PA__General___Personas___EstadoCivilID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE EstadoCivilID = @EstadoCivilID", this).ToListAsync();
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
