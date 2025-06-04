using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.PorCobrar")]
    [ExplicitColumns]
    [PrimaryKey("porCobrarId")]
    public class PorCobrar
    {
              
        
        [Column("porCobrarId")]
        public Int64 porCobrarId { get; set; }
      
        
        [Column("creditoId")]
        public Int64 creditoId { get; set; }
      
        
        [Column("productoId")]
        public int productoId { get; set; }
      
        
        [Column("sucursalId")]
        public int sucursalId { get; set; }
      
        
        [Column("cobradorAsignado")]
        public string cobradorAsignado { get; set; }
      
        
        [Column("nombreCompleto")]
        public string nombreCompleto { get; set; }
      
        
        [Column("celular")]
        public string celular { get; set; }
      
        
        [Column("domicilio")]
        public string domicilio { get; set; }
      
        
        [Column("tipoCredito")]
        public string tipoCredito { get; set; }
      
        
        [Column("montoCobrar")]
        public decimal montoCobrar { get; set; }
      
        
        [Column("montoAbonado")]
        public decimal montoAbonado { get; set; }
      
        
        [Column("fechaUltimoPago")]
        public DateTime fechaUltimoPago { get; set; }
      
        
        [Column("estatus")]
        public string estatus { get; set; }
      
        
        [Column("puedeRealizarQuita")]
        public bool puedeRealizarQuita { get; set; }
      
        
        [Column("quitaPorcRangoMin")]
        public decimal quitaPorcRangoMin { get; set; }
      
        
        [Column("quitaPorcRangoMax")]
        public decimal quitaPorcRangoMax { get; set; }
      
        
        [Column("creacionFecha")]
        public DateTime creacionFecha { get; set; }
      
        
        [Column("conciliado")]
        public bool conciliado { get; set; }
      
        
        [Column("TipoSistema")]
        public string TipoSistema { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Creditos.Creditos>> CH__Cobranza(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE creditoId = @CreditoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Productos>> CH__PorCobrar(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE productoId = @ProductoID", this).ToListAsync();
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
        
        public async Task<List<DBContext.DBConfia.Cobranza.Abonos>> PA__Cobranza___Abonos___porCobrarId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.Abonos>("WHERE porCobrarId = @porCobrarId", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Cobranza.FoliosCancelacion>> PA__Cobranza___FoliosCancelacion___porCobrarId(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Cobranza.FoliosCancelacion>("WHERE porCobrarId = @porCobrarId", this).ToListAsync();
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
