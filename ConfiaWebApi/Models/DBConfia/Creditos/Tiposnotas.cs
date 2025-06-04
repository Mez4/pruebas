using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.TiposNotas")]
    [ExplicitColumns]
    [PrimaryKey("TipoNotaID")]
    public class TiposNotas
    {
              
        
        [Column("TipoNotaID")]
        public int TipoNotaID { get; set; }
      
        
        [Column("ClaveNota")]
        public string ClaveNota { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("UsuarioRegistra")]
        public int UsuarioRegistra { get; set; }
      
        
        [Column("FechaModificacion")]
        public DateTime? FechaModificacion { get; set; }
      
        
        [Column("UsuarioModifica")]
        public int UsuarioModifica { get; set; }


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
        
        public async Task<List<DBContext.DBConfia.Creditos.NotasRapidas>> PA__Creditos___NotasRapidas___TipoNotaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.NotasRapidas>("WHERE TipoNotaID = @TipoNotaID", this).ToListAsync();
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
