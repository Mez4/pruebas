using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.Personas")]
    [ExplicitColumns]
    [PrimaryKey("PersonaID")]
    public class Personas
    {
              
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("ApellidoPaterno")]
        public string ApellidoPaterno { get; set; }
      
        
        [Column("ApellidoMaterno")]
        public string ApellidoMaterno { get; set; }
      
        
        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }
      
        
        [Column("LugarNacimiento")]
        public string LugarNacimiento { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("SexoID")]
        public string SexoID { get; set; }
      
        
        [Column("EstadoCivilID")]
        public string EstadoCivilID { get; set; }
      
        
        [Column("EscolaridadID")]
        public int? EscolaridadID { get; set; }
      
        
        [Column("IngresosMensuales")]
        public decimal IngresosMensuales { get; set; }
      
        
        [Column("DependientesEconomicos")]
        public int? DependientesEconomicos { get; set; }
      
        
        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("NombreConyuge")]
        public string NombreConyuge { get; set; }
      
        
        [Column("BuroInternoEstatusID")]
        public int? BuroInternoEstatusID { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("identificacionTipoId")]
        public int? identificacionTipoId { get; set; }
      
        
        [Column("identificacionNumero")]
        public string identificacionNumero { get; set; }
      
        
        [Column("canjeValeSolicitudId")]
        public Int64? canjeValeSolicitudId { get; set; }
      
        
        [Column("GrupoID")]
        public int? GrupoID { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("CreacionPersonaID")]
        public Int64? CreacionPersonaID { get; set; }
      
        
        [Column("CreacionUsuarioID")]
        public int? CreacionUsuarioID { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("SoundexNombre")]
        public string SoundexNombre { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("SoundexAPaterno")]
        public string SoundexAPaterno { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("SoundexAMaterno")]
        public string SoundexAMaterno { get; set; }
      
        
        [Column("SACId")]
        public Int64? SACId { get; set; }
      
        
        [Column("ModificacionFecha")]
        public DateTime? ModificacionFecha { get; set; }
      
        
        [Column("ModificacionPersonaID")]
        public Int64? ModificacionPersonaID { get; set; }
      
        
        [Column("ModificacionUsuarioID")]
        public int? ModificacionUsuarioID { get; set; }
      
        
        [Column("movCli")]
        public int? movCli { get; set; }
      
        
        [Column("CveCli")]
        public string CveCli { get; set; }
      
        
        [Column("PersonaIdExt")]
        public Int64? PersonaIdExt { get; set; }
      
        
        [Column("ArchivoEstatusID")]
        public int? ArchivoEstatusID { get; set; }
      
        
        [Column("FechaPrimerCanje")]
        public DateTime? FechaPrimerCanje { get; set; }
      
        
        [Column("BloqueadoCliente")]
        public bool? BloqueadoCliente { get; set; }
      
        
        [Column("ImagenCliente")]
        public string ImagenCliente { get; set; }
      
        
        [Column("IDExterno")]
        public string IDExterno { get; set; }
      
        
        [Column("IDSisFecha")]
        public string IDSisFecha { get; set; }
      
        
        [Column("TipoExt")]
        public string TipoExt { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("EstatusBuro")]
        public string EstatusBuro { get; set; }
      
        
        [Column("RutaFirma")]
        public string RutaFirma { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSFC61678B(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE ModificacionUsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.Sexos>> CH__SEXO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.Sexos>("WHERE SexoID = @SexoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.EstadosCiviles>> CH__ESTADO_CIVIL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.EstadosCiviles>("WHERE EstadoCivilID = @EstadoCivilID", this).ToListAsync();
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
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE ModificacionPersonaID = @PersonaID", this).ToListAsync();
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
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE CreacionPersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.Grupos>> CH__GRUPO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.Grupos>("WHERE GrupoID = @GrupoID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Aclaraciones.LogMensajes>> PA__Aclaraciones___LogMensajes___AnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.LogMensajes>("WHERE PersonaID = @AnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Auditoria.auditoriaSesiones>> PA__Auditoria___auditoriaSesiones___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Auditoria.auditoriaSesiones>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.MovimientosBancarios>> PA__Bancos___MovimientosBancarios___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosBancarios>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.MovimientosTraspasos>> PA__Bancos___MovimientosTraspasos___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosTraspasos>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.EstadosCoordinador>> PA__Catalogos___EstadosCoordinador___CreacionPersonaId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.EstadosCoordinador>("WHERE PersonaID = @CreacionPersonaId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.EstadosCoordinador>> PA__Catalogos___EstadosCoordinador___ModificacionPersonaId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.EstadosCoordinador>("WHERE PersonaID = @ModificacionPersonaId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.DirectorMesaCobranza>> PA__Cobranza___DirectorMesaCobranza___DirectorMesaCobranzaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.DirectorMesaCobranza>("WHERE PersonaID = @DirectorMesaCobranzaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.GestorCobranza>> PA__Cobranza___GestorCobranza___GestorCobranzaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.GestorCobranza>("WHERE PersonaID = @GestorCobranzaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Aplicaciones>> PA__Creditos___Aplicaciones___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Aplicaciones>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Avales>> PA__Creditos___Avales___PersonaId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Avales>("WHERE PersonaID = @PersonaId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Clientes>> PA__Creditos___Clientes___CreacionPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes>("WHERE PersonaID = @CreacionPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Clientes>> PA__Creditos___Clientes___ClienteID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes>("WHERE PersonaID = @ClienteID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ComisionesSucursal>> PA__Creditos___ComisionesSucursal___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ComisionesSucursal>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Contratos>> PA__Creditos___Contratos___PersonaId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE PersonaID = @PersonaId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Contratos>> PA__Creditos___Contratos___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Contratos>> PA__Creditos___Contratos___PersonaIDValidaContrato(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE PersonaID = @PersonaIDValidaContrato", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionales>> PA__Creditos___ContratosLineasAdicionales___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionales>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesHistorico>> PA__Creditos___ContratosLineasAdicionalesHistorico___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesHistorico>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>> PA__Creditos___ContratosLineasAdicionalesLogCambios___PersonaIDCambio(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>("WHERE PersonaID = @PersonaIDCambio", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>> PA__Creditos___ContratosLineasAdicionalesLogCambios___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosNotas>> PA__Creditos___ContratosNotas___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosNotas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Coordinadores>> PA__Creditos___Coordinadores___CreacionPersonaId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores>("WHERE PersonaID = @CreacionPersonaId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Coordinadores>> PA__Creditos___Coordinadores___ModificacionPersonaId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores>("WHERE PersonaID = @ModificacionPersonaId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Coordinadores>> PA__Creditos___Coordinadores___CoordinadorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores>("WHERE PersonaID = @CoordinadorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Historico>> PA__Creditos___Historico___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Historico>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Notas>> PA__Creditos___Notas___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Notas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Promotores>> PA__Creditos___Promotores___creditoPromotorId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Promotores>("WHERE PersonaID = @creditoPromotorId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Reestructura>> PA__Creditos___Reestructura___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Reestructura>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ReestructuraAnalista>> PA__Creditos___ReestructuraAnalista___AnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ReestructuraAnalista>("WHERE PersonaID = @AnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ReestructuraDetalle>> PA__Creditos___ReestructuraDetalle___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ReestructuraDetalle>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ReestructuraEncargado>> PA__Creditos___ReestructuraEncargado___EncargadoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ReestructuraEncargado>("WHERE PersonaID = @EncargadoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___AltaPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE PersonaID = @AltaPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___AnalistaPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE PersonaID = @AnalistaPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Avales>> PA__Distribuidores___Avales___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Avales>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Avales>> PA__Distribuidores___Avales___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Avales>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.BitacoraClienteBloqueado>> PA__Distribuidores___BitacoraClienteBloqueado___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.BitacoraClienteBloqueado>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ClientesV2>> PA__Distribuidores___ClientesV2___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ClientesV2>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Distribuidores>> PA__Distribuidores___Distribuidores___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE PersonaID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Distribuidores>> PA__Distribuidores___Distribuidores___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Experiencia>> PA__Distribuidores___Experiencia___PersonaIDValido(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Experiencia>("WHERE PersonaID = @PersonaIDValido", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Experiencia>> PA__Distribuidores___Experiencia___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Experiencia>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.LogCambios>> PA__Distribuidores___LogCambios___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.LogCambios>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.LogCambios>> PA__Distribuidores___LogCambios___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.LogCambios>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.LogCambios>> PA__Distribuidores___LogCambios___PersonaIDValida(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.LogCambios>("WHERE PersonaID = @PersonaIDValida", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.LogCambios>> PA__Distribuidores___LogCambios___PersonaIDValidaContrato(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.LogCambios>("WHERE PersonaID = @PersonaIDValidaContrato", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Referencia>> PA__Distribuidores___Referencia___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Referencia>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.SolicitudFallecida>> PA__Distribuidores___SolicitudFallecida___PersonaAutorizaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudFallecida>("WHERE PersonaID = @PersonaAutorizaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.SolicitudFallecida>> PA__Distribuidores___SolicitudFallecida___PersonaRegistraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudFallecida>("WHERE PersonaID = @PersonaRegistraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___AsignaDistribudiorPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE PersonaID = @AsignaDistribudiorPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___CanceladoUsuarioIdPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE PersonaID = @CanceladoUsuarioIdPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___EnvioSucursalPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE PersonaID = @EnvioSucursalPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___ReciboSucursalPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE PersonaID = @ReciboSucursalPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___RegistroPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE PersonaID = @RegistroPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___SubidaArchivoPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE PersonaID = @SubidaArchivoPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___AsignaSucursalPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE PersonaID = @AsignaSucursalPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___CanceladoPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE PersonaID = @CanceladoPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___RegistroPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE PersonaID = @RegistroPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___SurtidoPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE PersonaID = @SurtidoPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___PedidoPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE PersonaID = @PedidoPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraDetalle>> PA__Distribuidores___ValeraDetalle___CanceladoPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraDetalle>("WHERE PersonaID = @CanceladoPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraDetalle>> PA__Distribuidores___ValeraDetalle___CanjePersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraDetalle>("WHERE PersonaID = @CanjePersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.ConsultaBuro>> PA__General___ConsultaBuro___PersonaRegistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.ConsultaBuro>("WHERE PersonaID = @PersonaRegistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.ConsultaBuro>> PA__General___ConsultaBuro___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.ConsultaBuro>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Direcciones>> PA__General___Direcciones___CreacionPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Direcciones>("WHERE PersonaID = @CreacionPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Directores>> PA__General___Directores___CreacionPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE PersonaID = @CreacionPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Directores>> PA__General___Directores___DirectorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE PersonaID = @DirectorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Empleos>> PA__General___Empleos___CreacionPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Empleos>("WHERE PersonaID = @CreacionPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Empleos>> PA__General___Empleos___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Empleos>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.LogCambioDatos>> PA__General___LogCambioDatos___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.LogCambioDatos>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> PA__General___Personas___ModificacionPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @ModificacionPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> PA__General___Personas___CreacionPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @CreacionPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.PersonasDatosBancarios>> PA__General___PersonasDatosBancarios___personaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.PersonasDatosBancarios>("WHERE PersonaID = @personaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.PersonasDirecciones>> PA__General___PersonasDirecciones___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.PersonasDirecciones>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.PersonasDoc>> PA__General___PersonasDoc___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.PersonasDoc>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.PersonasDoc>> PA__General___PersonasDoc___PersonaIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.PersonasDoc>("WHERE PersonaID = @PersonaIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.AsignaAnalista>> PA__MesaCredito___AsignaAnalista___PersonaAnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.AsignaAnalista>("WHERE PersonaID = @PersonaAnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.AsignaAnalista>> PA__MesaCredito___AsignaAnalista___PersonaAsignaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.AsignaAnalista>("WHERE PersonaID = @PersonaAsignaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.DirectorMesa>> PA__MesaCredito___DirectorMesa___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.DirectorMesa>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.LogMensajes>> PA__MesaCredito___LogMensajes___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.LogMensajes>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.SolicitudMesaCredito>> PA__MesaCredito___SolicitudMesaCredito___PersonaRegistraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.SolicitudMesaCredito>("WHERE PersonaID = @PersonaRegistraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.UsuarioAnalistaMesa>> PA__MesaCredito___UsuarioAnalistaMesa___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.UsuarioAnalistaMesa>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Analista>> PA__Prospeccion___Analista___AnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Analista>("WHERE PersonaID = @AnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.AsignaAnalista>> PA__Prospeccion___AsignaAnalista___PersonaAnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.AsignaAnalista>("WHERE PersonaID = @PersonaAnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.AsignaAnalista>> PA__Prospeccion___AsignaAnalista___PersonaAsignaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.AsignaAnalista>("WHERE PersonaID = @PersonaAsignaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Avales>> PA__Prospeccion___Avales___AvalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Avales>("WHERE PersonaID = @AvalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.DirectorMesaCredito>> PA__Prospeccion___DirectorMesaCredito___DirectorMesaCreditoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.DirectorMesaCredito>("WHERE PersonaID = @DirectorMesaCreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Documentos>> PA__Prospeccion___Documentos___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Documentos>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.DocumentosAval>> PA__Prospeccion___DocumentosAval___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.DocumentosAval>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Domicilios>> PA__Prospeccion___Domicilios___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Domicilios>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Egresos>> PA__Prospeccion___Egresos___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Egresos>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.ExperienciaVentas>> PA__Prospeccion___ExperienciaVentas___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ExperienciaVentas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.InformacionLaboral>> PA__Prospeccion___InformacionLaboral___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.InformacionLaboral>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.InformacionOtraVivienda>> PA__Prospeccion___InformacionOtraVivienda___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.InformacionOtraVivienda>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.InformacionVivienda>> PA__Prospeccion___InformacionVivienda___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.InformacionVivienda>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Ingresos>> PA__Prospeccion___Ingresos___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Ingresos>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Interesados>> PA__Prospeccion___Interesados___CreacionPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Interesados>("WHERE PersonaID = @CreacionPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.LogMensajes>> PA__Prospeccion___LogMensajes___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.LogMensajes>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Prospectos>> PA__Prospeccion___Prospectos___ProspectoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE PersonaID = @ProspectoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Prospectos>> PA__Prospeccion___Prospectos___PromotorPersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE PersonaID = @PromotorPersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Referencias>> PA__Prospeccion___Referencias___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Referencias>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.RelacionAutoMoto>> PA__Prospeccion___RelacionAutoMoto___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.RelacionAutoMoto>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Tuberia>> PA__Prospeccion___Tuberia___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Tuberia>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> PA__Seguridad___Usuarios___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios_Personas>> PA__Seguridad___Usuarios_Personas___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Personas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Sistema.Logs>> PA__Sistema___Logs___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Sistema.Logs>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CatalogoBoveda>> PA__Tesoreria___CatalogoBoveda___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoBoveda>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.Polizas>> PA__Tesoreria___Polizas___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.Polizas>("WHERE PersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.ReferenciasPersona>> PA__Tesoreria___ReferenciasPersona___PersonaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.ReferenciasPersona>("WHERE PersonaID = @PersonaID", this).ToListAsync();
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
