using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Coordinadores")]
    [ExplicitColumns]
    [PrimaryKey("CoordinadorID", AutoIncrement=false)]
    public class Coordinadores
    {
              
        
        [Column("CoordinadorID")]
        public Int64 CoordinadorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        
        [Column("CarteraVencida")]
        public bool CarteraVencida { get; set; }
      
        
        [Column("ImprimirRelacionesMasivas")]
        public bool ImprimirRelacionesMasivas { get; set; }
      
        
        [Column("EstadoCoordinadorId")]
        public string EstadoCoordinadorId { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("CreacionPersonaId")]
        public Int64? CreacionPersonaId { get; set; }
      
        
        [Column("ModificacionFecha")]
        public DateTime? ModificacionFecha { get; set; }
      
        
        [Column("ModificacionPersonaId")]
        public Int64? ModificacionPersonaId { get; set; }
      
        
        [Column("CreacionUsuarioId")]
        public int? CreacionUsuarioId { get; set; }
      
        
        [Column("ModificacionUsuarioId")]
        public int? ModificacionUsuarioId { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS279E685D(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE CreacionUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS5C38C37F(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE ModificacionUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Sucursales>> CH__SUCURSAL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__CREACION_PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE CreacionPersonaId = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__MODIFICACION_PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE ModificacionPersonaId = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONAS(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE CoordinadorID = @PersonaID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Creditos.Coordinadores_Distribuidores>> PA__Creditos___Coordinadores_Distribuidores___CoordinadorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores_Distribuidores>("WHERE CoordinadorID = @CoordinadorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.LogCambios>> PA__Distribuidores___LogCambios___CoordinadorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.LogCambios>("WHERE CoordinadorID = @CoordinadorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.AccesosCoordinadores>> PA__Seguridad___AccesosCoordinadores___CoordinadorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.AccesosCoordinadores>("WHERE CoordinadorID = @CoordinadorID", this).ToListAsync();
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
