using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.Sucursales")]
    [ExplicitColumns]
    [PrimaryKey("SucursalID")]
    public class Sucursales
    {
              
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("distribuidorIdMin")]
        public Int64 distribuidorIdMin { get; set; }
      
        
        [Column("distribuidorIdMax")]
        public Int64 distribuidorIdMax { get; set; }
      
        
        [Column("importeLimiteCreditoDefault")]
        public decimal importeLimiteCreditoDefault { get; set; }
      
        
        [Column("tabuladorTipoID")]
        public int tabuladorTipoID { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("SucursalFisicaID")]
        public int SucursalFisicaID { get; set; }
      
        
        [Column("DiasDeEntregaAprox")]
        public int? DiasDeEntregaAprox { get; set; }
      
        
        [Column("PersonaResponsableID")]
        public int? PersonaResponsableID { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime? CreacionFecha { get; set; }
      
        
        [Column("PermisoRangoFechas")]
        public bool? PermisoRangoFechas { get; set; }
      
        
        [Column("ConvenioID")]
        public int? ConvenioID { get; set; }
      
        
        [Column("id_sucursal")]
        public int? id_sucursal { get; set; }
      
        
        [Column("id_origen")]
        public string id_origen { get; set; }
      
        
        [Column("id_empresa")]
        public int? id_empresa { get; set; }
      
        
        [Column("sistema")]
        public string sistema { get; set; }
      
        
        [Column("CostoPagoCanalesdePago ")]
        public decimal? CostoPagoCanalesdePago  { get; set; }
      
        
        [Column("IDEXterno")]
        public Int64? IDEXterno { get; set; }
      
        
        [Column("Eslogan")]
        public string Eslogan { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.General.Zonas>> CH__ZONA(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.General.Zonas>("WHERE ZonaID = @ZonaID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.TabuladoresTipos>> CH__TABULADOR_TIPO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.TabuladoresTipos>("WHERE tabuladorTipoID = @tabuladorTipoId", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Bancos.Movimientos>> PA__Bancos___Movimientos___gastoSucursal(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE SucursalID = @gastoSucursal", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.Movimientos>> PA__Bancos___Movimientos___SucursalId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE SucursalID = @SucursalId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortes>> PA__Cortes___RelacionCortes___SucursalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortes>("WHERE SucursalID = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cortes.RelacionCortesHistorico>> PA__Cortes___RelacionCortesHistorico___SucursalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortesHistorico>("WHERE SucursalID = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.CanjesValeApp>> PA__Creditos___CanjesValeApp___SucursalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.CanjesValeApp>("WHERE SucursalID = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Coordinadores>> PA__Creditos___Coordinadores___SucursalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores>("WHERE SucursalID = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Promotores>> PA__Creditos___Promotores___SucursalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Promotores>("WHERE SucursalID = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.SolicitudReestructura>> PA__Creditos___SolicitudReestructura___SucursalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudReestructura>("WHERE SucursalID = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___AsignaSucursalId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE SucursalID = @AsignaSucursalId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Distribuidores.Valera>> PA__Distribuidores___Valera___SucursalEnviaValera(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Valera>("WHERE SucursalID = @SucursalEnviaValera", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Dictamen>> PA__Prospeccion___Dictamen___SucursalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Dictamen>("WHERE SucursalID = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Prospeccion.Prospectos>> PA__Prospeccion___Prospectos___SucursalID(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE SucursalID = @SucursalID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>> PA__Tesoreria___BalanceTempDetalle___gastoSucursal(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>("WHERE SucursalID = @gastoSucursal", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>> PA__Tesoreria___BalanceTempDetalle___SucursalId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.BalanceTempDetalle>("WHERE SucursalID = @SucursalId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Tesoreria.RentaLocalDetalle>> PA__Tesoreria___RentaLocalDetalle___SucursalId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.RentaLocalDetalle>("WHERE SucursalID = @SucursalId", this).ToListAsync();
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
