using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.Valera")]
    [ExplicitColumns]
    [PrimaryKey("ValeraID")]
    public class Valera
    {
              
        
        [Column("ValeraID")]
        public Int64 ValeraID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("serieId")]
        public Int64 serieId { get; set; }
      
        
        [Column("FolioInicial")]
        public Int64 FolioInicial { get; set; }
      
        
        [Column("FolioFinal")]
        public Int64 FolioFinal { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("RegistroFecha")]
        public DateTime RegistroFecha { get; set; }
      
        
        [Column("AsignaSucursalId")]
        public int? AsignaSucursalId { get; set; }
      
        
        [Column("AsignaSucursalFecha")]
        public DateTime? AsignaSucursalFecha { get; set; }
      
        
        [Column("ReciboSucursalFecha")]
        public DateTime? ReciboSucursalFecha { get; set; }
      
        
        [Column("AsignaDistribudiorFecha")]
        public DateTime? AsignaDistribudiorFecha { get; set; }
      
        
        [Column("CanceladoFecha")]
        public DateTime? CanceladoFecha { get; set; }
      
        
        [Column("ValeraTrackingEstatusID")]
        public int ValeraTrackingEstatusID { get; set; }
      
        
        [Column("RegistroPersonaID")]
        public Int64 RegistroPersonaID { get; set; }
      
        
        [Column("ValeraCabeceraID")]
        public Int64 ValeraCabeceraID { get; set; }
      
        
        [Column("AsignaSucursalPersonaID")]
        public Int64? AsignaSucursalPersonaID { get; set; }
      
        
        [Column("ReciboSucursalPersonaID")]
        public Int64? ReciboSucursalPersonaID { get; set; }
      
        
        [Column("AsignaDistribudiorPersonaID")]
        public Int64? AsignaDistribudiorPersonaID { get; set; }
      
        
        [Column("CanceladoUsuarioIdPersonaID")]
        public Int64? CanceladoUsuarioIdPersonaID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("EnvioSucursalPersonaID")]
        public Int64? EnvioSucursalPersonaID { get; set; }
      
        
        [Column("EnvioSucursalFecha")]
        public DateTime? EnvioSucursalFecha { get; set; }
      
        
        [Column("EnvioSucursalNota")]
        public string EnvioSucursalNota { get; set; }
      
        
        [Column("ReciboSucursalNota")]
        public string ReciboSucursalNota { get; set; }
      
        
        [Column("CodigoBarras")]
        public string CodigoBarras { get; set; }
      
        
        [Column("SubidaArchivoPersonaID")]
        public Int64? SubidaArchivoPersonaID { get; set; }
      
        
        [Column("SubidaArchivoFecha")]
        public DateTime? SubidaArchivoFecha { get; set; }
      
        
        [Column("SucursalEnviaValera")]
        public int? SucursalEnviaValera { get; set; }
      
        
        [Column("SubidaArchivoPath")]
        public string SubidaArchivoPath { get; set; }
      
        
        [Column("AsignaDistribudiorUsuarioId")]
        public int? AsignaDistribudiorUsuarioId { get; set; }
      
        
        [Column("AsignaSucursalUsuarioId")]
        public int? AsignaSucursalUsuarioId { get; set; }
      
        
        [Column("CanceladoUsuarioId")]
        public int? CanceladoUsuarioId { get; set; }
      
        
        [Column("EnvioSucursalUsuarioId")]
        public int? EnvioSucursalUsuarioId { get; set; }
      
        
        [Column("ReciboSucursalUsuarioId")]
        public int? ReciboSucursalUsuarioId { get; set; }
      
        
        [Column("RegistroUsuarioId")]
        public int RegistroUsuarioId { get; set; }
      
        
        [Column("SubidaArchivoUsuarioId")]
        public int? SubidaArchivoUsuarioId { get; set; }
      
        
        [Column("ValeraDigital")]
        public bool ValeraDigital { get; set; }
      
        
        [Column("SubidaEntregaPath")]
        public string SubidaEntregaPath { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
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

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_ASIGNA_DISTRIBUIDOR(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE AsignaDistribudiorPersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_CANCELADO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE CanceladoUsuarioIdPersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_ENVIO_SUCURSAL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE EnvioSucursalPersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_RECIBO_SUCURSAL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE ReciboSucursalPersonaID = @PersonaID", this).ToListAsync();
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
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE RegistroPersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_SUBIDA_ARCHIVO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE SubidaArchivoPersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Personas>> CH__PERSONA_ASIGNA_SUCURSAL(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE AsignaSucursalPersonaID = @PersonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Productos>> CH__PRODUCTOS(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraCabecera>> CH__CABECERA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraCabecera>("WHERE ValeraCabeceraID = @ValeraCabeceraID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValerasCabeceraEstatus>> CH__ESTATUS(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValerasCabeceraEstatus>("WHERE Estatus = @ValerasCabeceraEstatusID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraSeries>> CH__VALERA_SERIE(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraSeries>("WHERE serieId = @serieId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraTrackingEstatus>> CH__TRACKING(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraTrackingEstatus>("WHERE ValeraTrackingEstatusID = @ValeraTrackingEstatusID", this).ToListAsync();
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
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE AsignaSucursalId = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Sucursales>> CH__SUCURSAL_ENVIA_VALERA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalEnviaValera = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS149A5528(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE SubidaArchivoUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOSABF548A5(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE RegistroUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS14623F23(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE AsignaDistribudiorUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS50457E74(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE AsignaSucursalUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS5A2271C9(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE EnvioSucursalUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS684FD407(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE CanceladoUsuarioId = @UsuarioID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Seguridad.Usuarios>> CH__SEGURIDAD_USUARIOS696D540D(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE ReciboSucursalUsuarioId = @UsuarioID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraEvidenciaDocs>> PA__Distribuidores___ValeraEvidenciaDocs___ValeraID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraEvidenciaDocs>("WHERE ValeraID = @ValeraID", this).ToListAsync();
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
