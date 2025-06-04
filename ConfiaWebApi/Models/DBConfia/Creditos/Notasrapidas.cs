using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.NotasRapidas")]
    [ExplicitColumns]
    [PrimaryKey("NotaRapidaID")]
    public class NotasRapidas
    {
              
        
        [Column("NotaRapidaID")]
        public int NotaRapidaID { get; set; }
      
        
        [Column("TipoNotaID")]
        public int? TipoNotaID { get; set; }
      
        
        [Column("DistribuidorID")]
        public int? DistribuidorID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }
      
        
        [Column("UsuarioRegistra")]
        public int? UsuarioRegistra { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Creditos.TiposNotas>> CH__NotasRapi(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.TiposNotas>("WHERE TipoNotaID = @TipoNotaID", this).ToListAsync();
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
