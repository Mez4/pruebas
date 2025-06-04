using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.Tuberia")]
    [ExplicitColumns]
    [PrimaryKey("TuberiaID")]
    public class Tuberia
    {
              
        
        [Column("TuberiaID")]
        public Int64 TuberiaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("TipoPersonaID")]
        public int TipoPersonaID { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64 StatusProcesoID { get; set; }
      
        
        [Column("TuberiaResultadoID")]
        public int TuberiaResultadoID { get; set; }
      
        
        [Column("Validado")]
        public bool? Validado { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("FechaValidacion")]
        public DateTime? FechaValidacion { get; set; }
      
        
        [Column("PersonaAnalistaID")]
        public Int64 PersonaAnalistaID { get; set; }
      
        
        [Column("UsuarioAnalistaID")]
        public int UsuarioAnalistaID { get; set; }
      
        
        [Column("Observacion")]
        public string Observacion { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
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

        public async Task<List<DBContext.DBConfia.Prospeccion.TipoPersona>> CH__TIPO_PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.TipoPersona>("WHERE TipoPersonaID = @TipoPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.StatusProceso>> CH__STATUS_PROCESO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.StatusProceso>("WHERE StatusProcesoID = @StatusProcesoID", this).ToListAsync();
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
     public class ReConsulta
    {
        public int ProspectoID { get; set; }
    }
}
