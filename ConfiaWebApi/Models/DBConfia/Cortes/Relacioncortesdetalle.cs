using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cortes
{
    [TableName("Cortes.RelacionCortesDetalle")]
    [ExplicitColumns]
    [PrimaryKey("ContratoID,CreditoID,DistribuidorID,fechaCorte,NoPago,ProductoID,SucursalID", AutoIncrement=false)]
    public class RelacionCortesDetalle
    {
              
        
        [Column("fechaCorte")]
        public DateTime fechaCorte { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ComisionesId")]
        public int? ComisionesId { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("NoPago")]
        public int NoPago { get; set; }
      
        
        [Column("TotalPagos")]
        public int? TotalPagos { get; set; }
      
        
        [Column("creditoClasificacionId")]
        public int? creditoClasificacionId { get; set; }
      
        
        [Column("saldoCredito")]
        public decimal? saldoCredito { get; set; }
      
        
        [Column("FechaVencimiento")]
        public DateTime? FechaVencimiento { get; set; }
      
        
        [Column("plazoVencido")]
        public int? plazoVencido { get; set; }
      
        
        [Column("saldoVencidoTotal")]
        public decimal? saldoVencidoTotal { get; set; }
      
        
        [Column("saldoAtrasado")]
        public decimal? saldoAtrasado { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("importePlazo")]
        public decimal? importePlazo { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("saldoPlazo")]
        public decimal? saldoPlazo { get; set; }
      
        
        [Column("CapitalPlazo")]
        public decimal? CapitalPlazo { get; set; }
      
        
        [Column("InteresPlazo")]
        public decimal? InteresPlazo { get; set; }
      
        
        [Column("ManejoCuentaPlazo")]
        public decimal? ManejoCuentaPlazo { get; set; }
      
        
        [Column("SeguroPlazo")]
        public decimal? SeguroPlazo { get; set; }
      
        
        [Column("ComisionPlazo")]
        public decimal? ComisionPlazo { get; set; }
      
        
        [Column("CargoPlazo")]
        public decimal? CargoPlazo { get; set; }
      
        
        [Column("IvaPlazo")]
        public decimal? IvaPlazo { get; set; }
      
        
        [Column("AbonosPlazo")]
        public decimal? AbonosPlazo { get; set; }
      
        
        [Column("baseComision")]
        public decimal? baseComision { get; set; }
      
        
        [Column("CortePart")]
        public decimal? CortePart { get; set; }
      
        
        [Column("SerieId")]
        public int? SerieId { get; set; }
      
        
        [Column("FolioVale")]
        public Int64? FolioVale { get; set; }
      
        
        [Column("FechaCanje")]
        public DateTime? FechaCanje { get; set; }
      
        
        [Column("ClienteID")]
        public Int64? ClienteID { get; set; }
      
        
        [Column("Cliente")]
        public string Cliente { get; set; }
      
        
        [Column("DiasAtrasoHistorico")]
        public int? DiasAtrasoHistorico { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("SaldoAtrasadoHistorico")]
        public decimal? SaldoAtrasadoHistorico { get; set; }
      
        
        [Column("DistribuidorNivelIDOrigen")]
        public int? DistribuidorNivelIDOrigen { get; set; }
      
        
        [Column("SaldoComisionPlazo")]
        public decimal? SaldoComisionPlazo { get; set; }
      
        
        [Column("FechaHoraUltimoPago")]
        public DateTime? FechaHoraUltimoPago { get; set; }
      
        
        [Column("FechaLiquidacion")]
        public DateTime? FechaLiquidacion { get; set; }


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

        public async Task<List<DBContext.DBConfia.Creditos.Contratos>> CH__CONTRATO(DBConfiaContext parContext)
        {
            try
            {
                return await parContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ContratoID = @ContratoID", this).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<DBContext.DBConfia.Creditos.Creditos>> CH__CREDITO(DBConfiaContext parContext)
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
