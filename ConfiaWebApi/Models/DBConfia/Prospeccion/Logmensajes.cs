using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.LogMensajes")]
    [ExplicitColumns]
    [PrimaryKey("LogMensajeID")]
    public class LogMensajes
    {
              
        
        [Column("LogMensajeID")]
        public int LogMensajeID { get; set; }
      
        
        [Column("Mensaje")]
        public string Mensaje { get; set; }
      
        
        [Column("Fecha_hora")]
        public DateTime Fecha_hora { get; set; }
      
        
        [Column("ValidacionMesaID")]
        public int? ValidacionMesaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64? StatusProcesoID { get; set; }
      
        
        [Column("Leido")]
        public bool? Leido { get; set; }
      
        
        [Column("EnviadoDesdeMesa")]
        public bool EnviadoDesdeMesa { get; set; }
      
        
        [Column("ValidacionBuroMesaID")]
        public int? ValidacionBuroMesaID { get; set; }
      
        
        [Column("ValidacionLlamadasMesaID")]
        public int? ValidacionLlamadasMesaID { get; set; }


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

        public async Task<List<DBContext.DBConfia.Prospeccion.ValidacionLlamadasMesa>> CH__VALIDACION_LLAMADAS(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ValidacionLlamadasMesa>("WHERE ValidacionLlamadasMesaID = @ValidacionLlamadasMesaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.ValidacionBuroMesa>> CH__VALIDACION_BURO_MESA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ValidacionBuroMesa>("WHERE ValidacionBuroMesaID = @ValidacionBuroMesaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__USUARIO(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Prospeccion.ValidacionMesa>> CH__VALIDACION_MESA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ValidacionMesa>("WHERE ValidacionMesaID = @ValidacionMesaID", this).ToListAsync();
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
}
