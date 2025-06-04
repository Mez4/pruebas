using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Sistema
{
    [TableName("Sistema.Logs")]
    [ExplicitColumns]
    [PrimaryKey("SistemaLogID")]
    public class Logs
    {
              
        
        [Column("SistemaLogID")]
        public Int64 SistemaLogID { get; set; }
      
        
        [Column("eventoTipoId")]
        public int eventoTipoId { get; set; }
      
        
        [Column("FHRegistro")]
        public DateTime FHRegistro { get; set; }
      
        
        [Column("Referencia")]
        public Int64 Referencia { get; set; }
      
        
        [Column("observaciones")]
        public string observaciones { get; set; }
      
        
        [Column("valorAnterior")]
        public string valorAnterior { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSD9D7E992(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.EventosTipos>> CH__EVENTO_TIPO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.EventosTipos>("WHERE eventoTipoId = @eventoTipoId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
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
