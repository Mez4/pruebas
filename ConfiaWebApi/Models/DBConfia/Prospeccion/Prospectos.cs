using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.Prospectos")]
    [ExplicitColumns]
    [PrimaryKey("ProspectoID", AutoIncrement=false)]
    public class Prospectos
    {
              
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ComoSeEntero")]
        public string ComoSeEntero { get; set; }
      
        
        [Column("tieneAutoMoto")]
        public bool? tieneAutoMoto { get; set; }
      
        
        [Column("tieneDependientes")]
        public bool? tieneDependientes { get; set; }
      
        
        [Column("tieneExperiencia")]
        public bool? tieneExperiencia { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64? StatusProcesoID { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("fechaCreacion")]
        public DateTime fechaCreacion { get; set; }
      
        
        [Column("fechaUltimaActualizacion")]
        public DateTime fechaUltimaActualizacion { get; set; }
      
        
        [Column("PromotorPersonaID")]
        public Int64 PromotorPersonaID { get; set; }
      
        
        [Column("PromotorUsuarioID")]
        public int PromotorUsuarioID { get; set; }
      
        
        [Column("EstatusAsignacionID")]
        public int? EstatusAsignacionID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("MontoDictaminado")]
        public decimal? MontoDictaminado { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("BuroInternoEstatusID")]
        public int BuroInternoEstatusID { get; set; }
      
        
        [Column("EstatusConsultaBuroID")]
        public int EstatusConsultaBuroID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Observacion")]
        public string Observacion { get; set; }
      
        
        [Column("DistribuidorTiposID")]
        public int DistribuidorTiposID { get; set; }
      
        
        [Column("Contrato")]
        public string Contrato { get; set; }
      
        
        [Column("Pagare")]
        public string Pagare { get; set; }
      
        
        [Column("PagareReverso")]
        public string PagareReverso { get; set; }
      
        
        [Column("ObservacionConsultaBuro")]
        public string ObservacionConsultaBuro { get; set; }
      
        
        [Column("DistribuidorNivelInternoID")]
        public int? DistribuidorNivelInternoID { get; set; }
      
        
        [Column("NivelOrigen_BuroID")]
        public int? NivelOrigen_BuroID { get; set; }
      
        
        [Column("PantallaProcesoID")]
        public int? PantallaProcesoID { get; set; }
      
        
        [Column("Reasignar")]
        public bool? Reasignar { get; set; }
      
        
        [Column("Descartado")]
        public bool? Descartado { get; set; }
      
        
        [Column("ObservacionesDescartado")]
        public string ObservacionesDescartado { get; set; }
      
        
        [Column("FechaDescarte")]
        public DateTime? FechaDescarte { get; set; }

        [Column("Archivado")]
        public bool? Archivado { get; set; }

        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Creditos.Productos>> CH__PRODUCTO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID = @ProductoID", this).ToListAsync();
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
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE ProspectoID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_PROMOTOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PromotorPersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.EstatusAsignacion>> CH__ESTATUS_ASIGNACION(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.EstatusAsignacion>("WHERE EstatusAsignacionID = @EstatusAsignacionID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Niveles>> CH__NIVEL_DISTRIBUIDOR(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Distribuidores.Estatus>> CH__ESTATUS_DISTRIBUIDOR(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Catalogos.DistribuidoresTipos>> CH__DISTRIBUIDOR_TIPO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.DistribuidoresTipos>("WHERE DistribuidorTiposID = @DistribuidorTiposID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.EstatusConsultaBuro>> CH__EstatusConsulta_Buro(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.EstatusConsultaBuro>("WHERE EstatusConsultaBuroID = @EstatusConsultaBuroID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Catalogos.BuroInternoEstatus>> CH__BURO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Catalogos.BuroInternoEstatus>("WHERE BuroInternoEstatusID = @BuroInternoEstatusID", this).ToListAsync();
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

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS54B40336(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE PromotorUsuarioID = @UsuarioID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Prospeccion.AsignaAnalista>> PA__Prospeccion___AsignaAnalista___ProspectoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.AsignaAnalista>("WHERE ProspectoID = @ProspectoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Avales>> PA__Prospeccion___Avales___ProspectoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Avales>("WHERE ProspectoID = @ProspectoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Dictamen>> PA__Prospeccion___Dictamen___ProspectoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Dictamen>("WHERE ProspectoID = @ProspectoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.ValidacionBuroMesa>> PA__Prospeccion___ValidacionBuroMesa___ProspectoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ValidacionBuroMesa>("WHERE ProspectoID = @ProspectoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.ValidacionLlamadasMesa>> PA__Prospeccion___ValidacionLlamadasMesa___ProspectoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ValidacionLlamadasMesa>("WHERE ProspectoID = @ProspectoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.ValidacionMesa>> PA__Prospeccion___ValidacionMesa___ProspectoID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.ValidacionMesa>("WHERE ProspectoID = @ProspectoID", this).ToListAsync();
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
