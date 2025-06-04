using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.CiudadesEstado")]
    [ExplicitColumns]
    [PrimaryKey("ciudadEstadoId")]
    public class CiudadesEstado
    {
              
        
        [Column("ciudadEstadoId")]
        public int ciudadEstadoId { get; set; }
      
        
        [Column("ciudadEstadoNombre")]
        public string ciudadEstadoNombre { get; set; }
      
        
        [Column("estadoPaisId")]
        public int estadoPaisId { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Catalogos.EstadosPais>> CH__ESTADO_PAIS(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.EstadosPais>("WHERE estadoPaisId = @estadoPaisId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
