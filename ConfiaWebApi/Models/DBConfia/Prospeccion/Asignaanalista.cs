using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.AsignaAnalista")]
    [ExplicitColumns]
    [PrimaryKey("AsignaAnalistaID")]
    public class AsignaAnalista
    {
              
        
        [Column("AsignaAnalistaID")]
        public int AsignaAnalistaID { get; set; }
      
        
        [Column("FechaHoraAsignacion")]
        public DateTime FechaHoraAsignacion { get; set; }
      
        
        [Column("PersonaAsignaID")]
        public Int64 PersonaAsignaID { get; set; }
      
        
        [Column("UsuarioAsignaID")]
        public int UsuarioAsignaID { get; set; }
      
        
        [Column("PersonaAnalistaID")]
        public Int64 PersonaAnalistaID { get; set; }
      
        
        [Column("UsuarioAnalistaID")]
        public int UsuarioAnalistaID { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("Buro")]
        public bool Buro { get; set; }
      
        
        [Column("Llamadas")]
        public bool Llamadas { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__ASIGNA_USUARIO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioAsignaID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__ANALISTA_PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaAnalistaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__ASIGNA_PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaAsignaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Prospectos>> CH__PROSPECTO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE ProspectoID = @ProspectoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__ANALISTA_USUARIO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioAnalistaID = @UsuarioID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Prospeccion.LogTiempos>> PA__Prospeccion___LogTiempos___AsignaAnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.LogTiempos>("WHERE AsignaAnalistaID = @AsignaAnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.ValidacionBuroMesa>> PA__Prospeccion___ValidacionBuroMesa___AsignaAnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ValidacionBuroMesa>("WHERE AsignaAnalistaID = @AsignaAnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.ValidacionLlamadasMesa>> PA__Prospeccion___ValidacionLlamadasMesa___AsignaAnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ValidacionLlamadasMesa>("WHERE AsignaAnalistaID = @AsignaAnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.ValidacionMesa>> PA__Prospeccion___ValidacionMesa___AsignaAnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ValidacionMesa>("WHERE AsignaAnalistaID = @AsignaAnalistaID", this).ToListAsync();
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
