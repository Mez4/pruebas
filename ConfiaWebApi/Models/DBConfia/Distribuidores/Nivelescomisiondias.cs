using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.NivelesComisionDias")]
    [ExplicitColumns]
    [PrimaryKey("DiasMax,DiasMin,DistribuidorNivelID,tabuladorTipoID", AutoIncrement=false)]
    public class NivelesComisionDias
    {
              
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("DiasMin")]
        public int DiasMin { get; set; }
      
        
        [Column("DiasMax")]
        public int DiasMax { get; set; }
      
        
        [Column("Ajuste")]
        public decimal Ajuste { get; set; }
      
        
        [Column("DiasTabla")]
        public int DiasTabla { get; set; }
      
        
        [Column("mostrarEnTabla")]
        public bool mostrarEnTabla { get; set; }
      
        
        [Column("tabuladorTipoID")]
        public int tabuladorTipoID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Distribuidores.Niveles>> CH__NIVEL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Niveles>("WHERE DistribuidorNivelID = @DistribuidorNivelID", this).ToListAsync();
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
