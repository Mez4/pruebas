using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.EstadosPais")]
    [ExplicitColumns]
    [PrimaryKey("estadoPaisId")]
    public class EstadosPais
    {
              
        
        [Column("estadoPaisId")]
        public int estadoPaisId { get; set; }
      
        
        [Column("estadoPaisNombre")]
        public string estadoPaisNombre { get; set; }
      
        
        [Column("abreviatura")]
        public string abreviatura { get; set; }
      
        
        [Column("estadoPaisCodigo")]
        public string estadoPaisCodigo { get; set; }
      
        
        [Column("RENAPOA")]
        public string RENAPOA { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Catalogos.CiudadesEstado>> PA__Catalogos___CiudadesEstado___estadoPaisId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.CiudadesEstado>("WHERE estadoPaisId = @estadoPaisId", this).ToListAsync();
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
