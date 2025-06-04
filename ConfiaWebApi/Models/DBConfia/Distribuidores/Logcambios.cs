using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.LogCambios")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidorID,fhCambio", AutoIncrement=false)]
    public class LogCambios
    {
              
        
        [Column("fhCambio")]
        public DateTime fhCambio { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime? FechaHoraRegistro { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64? CoordinadorID { get; set; }
      
        
        [Column("NumeroDist")]
        public int? NumeroDist { get; set; }
      
        
        [Column("GestorID")]
        public int? GestorID { get; set; }
      
        
        [Column("Validado")]
        public bool? Validado { get; set; }
      
        
        [Column("FHValidacion")]
        public DateTime? FHValidacion { get; set; }
      
        
        [Column("tipoRelacionID")]
        public int? tipoRelacionID { get; set; }
      
        
        [Column("creditoPromotorId")]
        public Int64? creditoPromotorId { get; set; }
      
        
        [Column("validaContrato")]
        public bool? validaContrato { get; set; }
      
        
        [Column("fhValidaContrato")]
        public DateTime? fhValidaContrato { get; set; }
      
        
        [Column("fechaHoraValidaContrato")]
        public DateTime? fechaHoraValidaContrato { get; set; }
      
        
        [Column("validadoContrato")]
        public bool? validadoContrato { get; set; }
      
        
        [Column("usuarioIdCambio")]
        public int? usuarioIdCambio { get; set; }
      
        
        [Column("dbuser")]
        public string dbuser { get; set; }
      
        
        [Column("sesionId")]
        public Int64? sesionId { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64? PersonaIDRegistro { get; set; }
      
        
        [Column("PersonaIDValida")]
        public Int64? PersonaIDValida { get; set; }
      
        
        [Column("PersonaIDValidaContrato")]
        public Int64? PersonaIDValidaContrato { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int? UsuarioIDRegistro { get; set; }
      
        
        [Column("UsuarioIDValida")]
        public int? UsuarioIDValida { get; set; }
      
        
        [Column("usuarioIdValidaContrato")]
        public int? usuarioIdValidaContrato { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSC90A9293(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE usuarioIdValidaContrato = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSBFD07298(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDValida = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSC1E96F23(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioIDRegistro = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Promotores>> CH__PROMOTOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Promotores>("WHERE creditoPromotorId = @creditoPromotorId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Niveles>> CH__DISTRIBUIDOR_NIVEL(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Distribuidores.Estatus>> CH__DISTRIBUIDOR_ESTATUS(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Estatus>("WHERE DistribuidoresEstatusID = @DistribuidoresEstatusID", this).ToListAsync();
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

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_REGISTRO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaIDRegistro = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_VALIDO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaIDValida = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_VALIDO_CONTRATO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaIDValidaContrato = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Distribuidores>> CH__DISTRIBUIDOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Coordinadores>> CH__COORDINADOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores>("WHERE CoordinadorID = @CoordinadorID", this).ToListAsync();
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
