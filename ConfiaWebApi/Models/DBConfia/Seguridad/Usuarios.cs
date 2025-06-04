using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Seguridad
{
    [TableName("Seguridad.Usuarios")]
    [ExplicitColumns]
    [PrimaryKey("UsuarioID")]
    public class Usuarios
    {


        [Column("UsuarioID")]
        public int UsuarioID { get; set; }


        [Column("Usuario")]
        public string Usuario { get; set; }


        [Column("Nombre")]
        public string Nombre { get; set; }


        [Column("Correo")]
        public string Correo { get; set; }


        [Column("Contrasena")]
        public string Contrasena { get; set; }


        [Column("Bloqueado")]
        public bool Bloqueado { get; set; }


        [Column("BloqueadoPermanente")]
        public bool BloqueadoPermanente { get; set; }


        [Column("MasterUser")]
        public bool MasterUser { get; set; }


        [Column("SystemUser")]
        public bool SystemUser { get; set; }


        [Column("SupportUser")]
        public bool SupportUser { get; set; }


        [Column("TodosLosCoordinadores")]
        public bool TodosLosCoordinadores { get; set; }


        [Column("fhAlta")]
        public DateTime fhAlta { get; set; }


        [Column("fhUltimoAcceso")]
        public DateTime? fhUltimoAcceso { get; set; }


        [Column("fhBloqueo")]
        public DateTime? fhBloqueo { get; set; }


        [Column("fhUltimoCambioContrasena")]
        public DateTime? fhUltimoCambioContrasena { get; set; }


        [Column("usuarioIdBloquea")]
        public int? usuarioIdBloquea { get; set; }


        [Column("comentarioBloqueo")]
        public string comentarioBloqueo { get; set; }


        [Column("Validacion")]
        public bool Validacion { get; set; }


        [Column("ValidacionCodigo")]
        public string ValidacionCodigo { get; set; }


        [Column("ValidacionFecha")]
        public DateTime? ValidacionFecha { get; set; }


        [Column("ContratantePagos")]
        public int? ContratantePagos { get; set; }


        [Column("MasterPagos")]
        public bool? MasterPagos { get; set; }


        [Column("ContrasenaRestablecida")]
        public bool ContrasenaRestablecida { get; set; }


        [Column("UUID")]
        public string UUID { get; set; }


        [Column("empresaId")]
        public int? empresaId { get; set; }


        [Column("AccesoAppValesPS")]
        public bool? AccesoAppValesPS { get; set; }


        [Column("AccesoAppCobranzaPS")]
        public bool? AccesoAppCobranzaPS { get; set; }


        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }


        [Column("CambiarContrasena")]
        public bool CambiarContrasena { get; set; }


        [Column("Acceso")]
        public bool? Acceso { get; set; }


        [Column("AccesoAppPromotor")]
        public bool? AccesoAppPromotor { get; set; }


        [Column("AccesoAppPromotoria")]
        public bool? AccesoAppPromotoria { get; set; }

        [Column("UsuarioRapido")]
        public bool? UsuarioRapido { get; set; }

        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__USUARIO_BLOQUEO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE usuarioIdBloquea = @UsuarioID", this).ToListAsync();
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

        public async Task<List<DBContext.DBConfia.General.Empresas>> CH__EMPRESAS(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Empresas>("WHERE empresaId = @empresaId", this).ToListAsync();
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

        public async Task<List<DBContext.DBConfia.Auditoria.auditoriaSesiones>> PA__Auditoria___auditoriaSesiones___usuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Auditoria.auditoriaSesiones>("WHERE UsuarioID = @usuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Balances.Balance2>> PA__Balances___Balance2___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Balances.Balance2>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Balances.SaldosCierreCuentasBalance>> PA__Balances___SaldosCierreCuentasBalance___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Balances.SaldosCierreCuentasBalance>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.Movimientos>> PA__Bancos___Movimientos___UsuarioIDRegistra(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE UsuarioID = @UsuarioIDRegistra", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.MovimientosBancarios>> PA__Bancos___MovimientosBancarios___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosBancarios>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.MovimientosTraspasos>> PA__Bancos___MovimientosTraspasos___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosTraspasos>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.TiposDesembolsoSucursal>> PA__Bancos___TiposDesembolsoSucursal___RegistroUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.TiposDesembolsoSucursal>("WHERE UsuarioID = @RegistroUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.TiposDesembolsoSucursal>> PA__Bancos___TiposDesembolsoSucursal___ModificaUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.TiposDesembolsoSucursal>("WHERE UsuarioID = @ModificaUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.EstadosCoordinador>> PA__Catalogos___EstadosCoordinador___ModificacionUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.EstadosCoordinador>("WHERE UsuarioID = @ModificacionUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.EstadosCoordinador>> PA__Catalogos___EstadosCoordinador___CreacionUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.EstadosCoordinador>("WHERE UsuarioID = @CreacionUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Aplicaciones>> PA__Creditos___Aplicaciones___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Aplicaciones>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Clientes>> PA__Creditos___Clientes___CreacionUsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes>("WHERE UsuarioID = @CreacionUsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Comisiones>> PA__Creditos___Comisiones___ModificaUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Comisiones>("WHERE UsuarioID = @ModificaUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Comisiones>> PA__Creditos___Comisiones___RegistroUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Comisiones>("WHERE UsuarioID = @RegistroUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ComisionesConvenios>> PA__Creditos___ComisionesConvenios___ModificaUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ComisionesConvenios>("WHERE UsuarioID = @ModificaUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ComisionesConvenios>> PA__Creditos___ComisionesConvenios___RegistroUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ComisionesConvenios>("WHERE UsuarioID = @RegistroUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ComisionesDetalle>> PA__Creditos___ComisionesDetalle___RegistroUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ComisionesDetalle>("WHERE UsuarioID = @RegistroUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ComisionesDetalle>> PA__Creditos___ComisionesDetalle___ModificaUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ComisionesDetalle>("WHERE UsuarioID = @ModificaUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ComisionesSucursal>> PA__Creditos___ComisionesSucursal___RegistroUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ComisionesSucursal>("WHERE UsuarioID = @RegistroUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ComisionesSucursal>> PA__Creditos___ComisionesSucursal___ModificaUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ComisionesSucursal>("WHERE UsuarioID = @ModificaUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Condiciones>> PA__Creditos___Condiciones___ModificoUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Condiciones>("WHERE UsuarioID = @ModificoUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Condiciones>> PA__Creditos___Condiciones___RegistroUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Condiciones>("WHERE UsuarioID = @RegistroUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CondicionesDetalle>> PA__Creditos___CondicionesDetalle___UsuarioModifico(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CondicionesDetalle>("WHERE UsuarioID = @UsuarioModifico", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CondicionesDetalle>> PA__Creditos___CondicionesDetalle___UsuarioRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CondicionesDetalle>("WHERE UsuarioID = @UsuarioRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CondicionesSucursal>> PA__Creditos___CondicionesSucursal___RegistroUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CondicionesSucursal>("WHERE UsuarioID = @RegistroUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CondicionesSucursal>> PA__Creditos___CondicionesSucursal___ModificaUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CondicionesSucursal>("WHERE UsuarioID = @ModificaUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Contratos>> PA__Creditos___Contratos___usuarioIdValidaContrato(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE UsuarioID = @usuarioIdValidaContrato", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Contratos>> PA__Creditos___Contratos___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionales>> PA__Creditos___ContratosLineasAdicionales___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionales>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesHistorico>> PA__Creditos___ContratosLineasAdicionalesHistorico___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesHistorico>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>> PA__Creditos___ContratosLineasAdicionalesLogCambios___UsuarioIDCambio(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>("WHERE UsuarioID = @UsuarioIDCambio", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>> PA__Creditos___ContratosLineasAdicionalesLogCambios___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosLineasAdicionalesLogCambios>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosNotas>> PA__Creditos___ContratosNotas___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosNotas>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Coordinadores>> PA__Creditos___Coordinadores___CreacionUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores>("WHERE UsuarioID = @CreacionUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Coordinadores>> PA__Creditos___Coordinadores___ModificacionUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores>("WHERE UsuarioID = @ModificacionUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Creditos>> PA__Creditos___Creditos___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Notas>> PA__Creditos___Notas___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Notas>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Promotores>> PA__Creditos___Promotores___usuarioIdRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Promotores>("WHERE UsuarioID = @usuarioIdRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Promotores>> PA__Creditos___Promotores___UsuarioModifico(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Promotores>("WHERE UsuarioID = @UsuarioModifico", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Reestructura>> PA__Creditos___Reestructura___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Reestructura>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ReestructuraDetalle>> PA__Creditos___ReestructuraDetalle___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ReestructuraDetalle>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___AltaUsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE UsuarioID = @AltaUsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___AnalistaUsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE UsuarioID = @AnalistaUsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Ventas>> PA__Creditos___Ventas___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Ventas>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Avales>> PA__Distribuidores___Avales___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Avales>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Distribuidores>> PA__Distribuidores___Distribuidores___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Experiencia>> PA__Distribuidores___Experiencia___UsuarioIDValido(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Experiencia>("WHERE UsuarioID = @UsuarioIDValido", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Experiencia>> PA__Distribuidores___Experiencia___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Experiencia>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.LogCambios>> PA__Distribuidores___LogCambios___usuarioIdValidaContrato(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.LogCambios>("WHERE UsuarioID = @usuarioIdValidaContrato", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.LogCambios>> PA__Distribuidores___LogCambios___UsuarioIDValida(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.LogCambios>("WHERE UsuarioID = @UsuarioIDValida", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.LogCambios>> PA__Distribuidores___LogCambios___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.LogCambios>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Referencia>> PA__Distribuidores___Referencia___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Referencia>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.SolicitudFallecida>> PA__Distribuidores___SolicitudFallecida___UsuarioRegistraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudFallecida>("WHERE UsuarioID = @UsuarioRegistraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.SolicitudFallecida>> PA__Distribuidores___SolicitudFallecida___UsuarioAutorizaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudFallecida>("WHERE UsuarioID = @UsuarioAutorizaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___SubidaArchivoUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE UsuarioID = @SubidaArchivoUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___RegistroUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE UsuarioID = @RegistroUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___AsignaDistribudiorUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE UsuarioID = @AsignaDistribudiorUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___AsignaSucursalUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE UsuarioID = @AsignaSucursalUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___EnvioSucursalUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE UsuarioID = @EnvioSucursalUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___CanceladoUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE UsuarioID = @CanceladoUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___ReciboSucursalUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE UsuarioID = @ReciboSucursalUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___SurtidoUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE UsuarioID = @SurtidoUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___PedidoUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE UsuarioID = @PedidoUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___RegistroUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE UsuarioID = @RegistroUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> PA__Distribuidores___ValeraCabecera___CanceladoUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE UsuarioID = @CanceladoUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraDetalle>> PA__Distribuidores___ValeraDetalle___CanceladoUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraDetalle>("WHERE UsuarioID = @CanceladoUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraDetalle>> PA__Distribuidores___ValeraDetalle___CanjeUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraDetalle>("WHERE UsuarioID = @CanjeUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.ConsultaBuro>> PA__General___ConsultaBuro___UsuarioRegistraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.ConsultaBuro>("WHERE UsuarioID = @UsuarioRegistraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Direcciones>> PA__General___Direcciones___CreacionUsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Direcciones>("WHERE UsuarioID = @CreacionUsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Directores>> PA__General___Directores___CreacionUsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE UsuarioID = @CreacionUsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Empleos>> PA__General___Empleos___CreacionUsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Empleos>("WHERE UsuarioID = @CreacionUsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.LogCambioDatos>> PA__General___LogCambioDatos___UsuarioModificaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.LogCambioDatos>("WHERE UsuarioID = @UsuarioModificaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.LogImpresionDocumentos>> PA__General___LogImpresionDocumentos___UsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.LogImpresionDocumentos>("WHERE UsuarioID = @UsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> PA__General___Personas___ModificacionUsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE UsuarioID = @ModificacionUsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.PersonasDoc>> PA__General___PersonasDoc___UsuarioIDRegistro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.PersonasDoc>("WHERE UsuarioID = @UsuarioIDRegistro", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Gestoria.Gestores>> PA__Gestoria___Gestores___ModificacionUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Gestoria.Gestores>("WHERE UsuarioID = @ModificacionUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Gestoria.Gestores>> PA__Gestoria___Gestores___CreacionUsuarioId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Gestoria.Gestores>("WHERE UsuarioID = @CreacionUsuarioId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.AsignaAnalista>> PA__MesaCredito___AsignaAnalista___UsuarioAsignaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.AsignaAnalista>("WHERE UsuarioID = @UsuarioAsignaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.AsignaAnalista>> PA__MesaCredito___AsignaAnalista___UsuarioAnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.AsignaAnalista>("WHERE UsuarioID = @UsuarioAnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.DirectorMesa>> PA__MesaCredito___DirectorMesa___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.DirectorMesa>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.EstatusAsignacion>> PA__MesaCredito___EstatusAsignacion___UsuarioRegistraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.EstatusAsignacion>("WHERE UsuarioID = @UsuarioRegistraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.EstatusValidacion>> PA__MesaCredito___EstatusValidacion___UsuarioRegistraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.EstatusValidacion>("WHERE UsuarioID = @UsuarioRegistraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.LogMensajes>> PA__MesaCredito___LogMensajes___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.LogMensajes>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.SolicitudesCredito>> PA__MesaCredito___SolicitudesCredito___UsuarioRegistraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.SolicitudesCredito>("WHERE UsuarioID = @UsuarioRegistraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.SolicitudesCreditoHistorial>> PA__MesaCredito___SolicitudesCreditoHistorial___UsuarioRegistraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.SolicitudesCreditoHistorial>("WHERE UsuarioID = @UsuarioRegistraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.SolicitudMesaCredito>> PA__MesaCredito___SolicitudMesaCredito___UsuarioRegistraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.SolicitudMesaCredito>("WHERE UsuarioID = @UsuarioRegistraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.MesaCredito.UsuarioAnalistaMesa>> PA__MesaCredito___UsuarioAnalistaMesa___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.MesaCredito.UsuarioAnalistaMesa>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Pagos.CodigosAutorizacion>> PA__Pagos___CodigosAutorizacion___USUGenera(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Pagos.CodigosAutorizacion>("WHERE UsuarioID = @USUGenera", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Pagos.CodigosAutorizacion>> PA__Pagos___CodigosAutorizacion___UsuarioIDUtiliza(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Pagos.CodigosAutorizacion>("WHERE UsuarioID = @UsuarioIDUtiliza", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.AsignaAnalista>> PA__Prospeccion___AsignaAnalista___UsuarioAsignaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.AsignaAnalista>("WHERE UsuarioID = @UsuarioAsignaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.AsignaAnalista>> PA__Prospeccion___AsignaAnalista___UsuarioAnalistaID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.AsignaAnalista>("WHERE UsuarioID = @UsuarioAnalistaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Interesados>> PA__Prospeccion___Interesados___CreacionUsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Interesados>("WHERE UsuarioID = @CreacionUsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.LogMensajes>> PA__Prospeccion___LogMensajes___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.LogMensajes>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Prospectos>> PA__Prospeccion___Prospectos___PromotorUsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE UsuarioID = @PromotorUsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.AccesosCoordinadores>> PA__Seguridad___AccesosCoordinadores___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.AccesosCoordinadores>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Roles_Permisos>> PA__Seguridad___Roles_Permisos___CreacionUsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Roles_Permisos>("WHERE UsuarioID = @CreacionUsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> PA__Seguridad___Usuarios___usuarioIdBloquea(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE UsuarioID = @usuarioIdBloquea", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios_Personas>> PA__Seguridad___Usuarios_Personas___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Personas>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios_Roles>> PA__Seguridad___Usuarios_Roles___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Roles>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Sistema.FuncionesUsuario>> PA__Sistema___FuncionesUsuario___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Sistema.FuncionesUsuario>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Sistema.Logs>> PA__Sistema___Logs___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Sistema.Logs>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.ArchivoDispersion2>> PA__Tesoreria___ArchivoDispersion2___UsuarioRealiza(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.ArchivoDispersion2>("WHERE UsuarioID = @UsuarioRealiza", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>> PA__Tesoreria___BalanceTempDetalle___UsuarioIDRegistra(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>("WHERE UsuarioID = @UsuarioIDRegistra", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.CatalogoBoveda>> PA__Tesoreria___CatalogoBoveda___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoBoveda>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.Periodo>> PA__Tesoreria___Periodo___UsuarioIDCierre(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.Periodo>("WHERE UsuarioID = @UsuarioIDCierre", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.Periodo>> PA__Tesoreria___Periodo___UsuarioIDApertura(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.Periodo>("WHERE UsuarioID = @UsuarioIDApertura", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.Periodo2>> PA__Tesoreria___Periodo2___UsuarioIDCierre(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.Periodo2>("WHERE UsuarioID = @UsuarioIDCierre", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.Polizas>> PA__Tesoreria___Polizas___UsuarioID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.Polizas>("WHERE UsuarioID = @UsuarioID", this).ToListAsync();
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
