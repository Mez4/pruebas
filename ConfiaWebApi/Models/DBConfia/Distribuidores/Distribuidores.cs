using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.Distribuidores")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidorID", AutoIncrement = false)]
    public class Distribuidores
    {


        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }


        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }


        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }


        [Column("DistribuidoresEstatusID2")]
        public string DistribuidoresEstatusID2 { get; set; }


        [Column("DistribuidorNivelID2")]
        public int? DistribuidorNivelID2 { get; set; }


        [Column("NoCreditosActivos")]
        public int NoCreditosActivos { get; set; }


        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }


        [Column("NumeroDist")]
        public string NumeroDist { get; set; }


        [Column("DistAntNumero")]
        public int? DistAntNumero { get; set; }


        [Column("DistAntSistema")]
        public string DistAntSistema { get; set; }


        [Column("DistAntNumero2")]
        public int? DistAntNumero2 { get; set; }


        [Column("DistAntSistema2")]
        public string DistAntSistema2 { get; set; }


        [Column("GestorID")]
        public Int64? GestorID { get; set; }


        [Column("ValidaContrato")]
        public bool ValidaContrato { get; set; }


        [Column("tipoRelacionID")]
        public int tipoRelacionID { get; set; }


        [Column("ReferenciaContable")]
        public int ReferenciaContable { get; set; }


        [Column("numCreditosPersonales")]
        public int numCreditosPersonales { get; set; }


        [Column("PersonaIDRegistro")]
        public Int64 PersonaIDRegistro { get; set; }


        [Column("UsuarioIDRegistro")]
        public int UsuarioIDRegistro { get; set; }


        [Column("AccesoAppVales")]
        public bool? AccesoAppVales { get; set; }


        [Column("AccesoAppVales2")]
        public bool? AccesoAppVales2 { get; set; }


        [Column("fum")]
        public DateTime? fum { get; set; }


        [Column("Monedero")]
        public decimal? Monedero { get; set; }


        [Column("DistribuidorNivelOrigenID")]
        public int DistribuidorNivelOrigenID { get; set; }


        [Column("DistribuidorImagen")]
        public string DistribuidorImagen { get; set; }


        [Column("ConGrupo")]
        public bool? ConGrupo { get; set; }


        [Column("SociaNIP")]
        public string SociaNIP { get; set; }


        [Column("CambioNIP")]
        public bool? CambioNIP { get; set; }


        [Column("ResponsableID")]
        public Int64? ResponsableID { get; set; }

        [Column("FhActivacionApp")]
        public DateTime? FhActivacionApp { get; set; }

        [Column("AppActivada")]
        public bool? AppActivada { get; set; }

           [Column("CanjePlus")]
        public bool? CanjePlus { get; set; }

        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE DistribuidorID = @PersonaID", this).ToListAsync();
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

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSBA33D781(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Distribuidores.Estatus>> CH__ESTATUS(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Distribuidores.Niveles>> CH__NIVEL(DBConfiaContext parContext)
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

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################

        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortes>> PA__Cortes___RelacionCortes___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortes>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortesDetalle>> PA__Cortes___RelacionCortesDetalle___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortesDetalle>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortesDetalleHistorico>> PA__Cortes___RelacionCortesDetalleHistorico___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortesDetalleHistorico>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortesHistorico>> PA__Cortes___RelacionCortesHistorico___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortesHistorico>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortesLineas>> PA__Cortes___RelacionCortesLineas___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortesLineas>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CanjesValeApp>> PA__Creditos___CanjesValeApp___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CanjesValeApp>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Contratos>> PA__Creditos___Contratos___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.ContratosHistorico>> PA__Creditos___ContratosHistorico___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.ContratosHistorico>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Reestructura>> PA__Creditos___Reestructura___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Reestructura>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.AplicacionesAjustesImportacion>> PA__Distribuidores___AplicacionesAjustesImportacion___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.AplicacionesAjustesImportacion>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.BitacoraClienteBloqueado>> PA__Distribuidores___BitacoraClienteBloqueado___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.BitacoraClienteBloqueado>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ClientesV2>> PA__Distribuidores___ClientesV2___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ClientesV2>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Experiencia>> PA__Distribuidores___Experiencia___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Experiencia>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Historico>> PA__Distribuidores___Historico___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Historico>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.LogCambios>> PA__Distribuidores___LogCambios___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.LogCambios>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Referencia>> PA__Distribuidores___Referencia___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Referencia>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.SolicitudFallecida>> PA__Distribuidores___SolicitudFallecida___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudFallecida>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___DistribuidorID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE DistribuidorID = @DistribuidorID", this).ToListAsync();
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
