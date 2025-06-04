using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.CanjesValeApp")]
    [ExplicitColumns]
    [PrimaryKey("CanjeAppId")]
    public class CanjesValeApp
    {
              
        
        [Column("CanjeAppId")]
        public Int64 CanjeAppId { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }
      
        
        [Column("SerieId")]
        public Int64? SerieId { get; set; }
      
        
        [Column("Folio")]
        public Int64? Folio { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("Plazos")]
        public int Plazos { get; set; }
      
        
        [Column("TipoDesembolsoID")]
        public int TipoDesembolsoID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("MovimientoID")]
        public Int64? MovimientoID { get; set; }
      
        
        [Column("personasDatosBancariosID")]
        public Int64? personasDatosBancariosID { get; set; }
      
        
        [Column("VentaId")]
        public Int64 VentaId { get; set; }
      
        
        [Column("token")]
        public string token { get; set; }
      
        
        [Column("valeTipoId")]
        public int? valeTipoId { get; set; }
      
        
        [Column("telefono")]
        public string telefono { get; set; }
      
        
        [Column("valeDigital")]
        public bool valeDigital { get; set; }
      
        
        [Column("codigoValeDig")]
        public string codigoValeDig { get; set; }
      
        
        [Column("consecutivoDia")]
        public Int64 consecutivoDia { get; set; }
      
        
        [Column("estatus")]
        public string estatus { get; set; }
      
        
        [Column("codigoValidacion")]
        public string codigoValidacion { get; set; }
      
        
        [Column("validado")]
        public bool? validado { get; set; }
      
        
        [Column("destinoCreditoId")]
        public int? destinoCreditoId { get; set; }
      
        
        [Column("tipoUsuario")]
        public string tipoUsuario { get; set; }
      
        
        [Column("fecha")]
        public DateTime fecha { get; set; }
      
        
        [Column("fechaRegistro")]
        public DateTime? fechaRegistro { get; set; }
      
        
        [Column("fhValidacion")]
        public DateTime? fhValidacion { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("CajaID")]
        public int? CajaID { get; set; }
      
        
        [Column("fechaCancelacion")]
        public DateTime fechaCancelacion { get; set; }
      
        
        [Column("idUsuarioCancelacion")]
        public int idUsuarioCancelacion { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Creditos.Creditos>> CH__Credi(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Bancos.TiposDesembolso>> CH__TipoD(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Bancos.TiposDesembolso>("WHERE TipoDesembolsoID = @TipoDesembolsoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.General.Sucursales>> CH__Sucur(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Distribuidores.ValeraSeries>> CH__Serie(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraSeries>("WHERE SerieId = @serieId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Clientes>> CH__Cliente(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes>("WHERE ClienteID = @ClienteID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Productos>> CH__Produ(DBConfiaContext parContext)
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

        public async Task<List<DBContext.DBConfia.Distribuidores.Distribuidores>> CH__Distr(DBConfiaContext parContext)
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
