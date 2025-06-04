using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.ReferenciasTipos")]
    [ExplicitColumns]
    [PrimaryKey("referenciaTipoId")]
    public class ReferenciasTipos
    {
              
        
        [Column("referenciaTipoId")]
        public int referenciaTipoId { get; set; }
      
        
        [Column("referenciaTipo")]
        public string referenciaTipo { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("esFamiliar")]
        public bool esFamiliar { get; set; }
      
        
        [Column("esAval")]
        public bool esAval { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Distribuidores.Referencia>> PA__Distribuidores___Referencia___referenciaTipoId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Referencia>("WHERE referenciaTipoId = @referenciaTipoId", this).ToListAsync();
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
