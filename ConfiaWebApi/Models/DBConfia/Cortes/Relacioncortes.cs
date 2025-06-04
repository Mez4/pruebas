using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cortes
{
    [TableName("Cortes.RelacionCortes")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidorID,fechaCorte,SucursalID", AutoIncrement=false)]
    public class RelacionCortes
    {
              
        
        [Column("fechaCorte")]
        public DateTime fechaCorte { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("creditosEnRelacion")]
        public int? creditosEnRelacion { get; set; }
      
        
        [Column("LineaCredito")]
        public decimal? LineaCredito { get; set; }
      
        
        [Column("LineaCreditoDisponible")]
        public decimal? LineaCreditoDisponible { get; set; }
      
        
        [Column("FechaVencimiento")]
        public DateTime? FechaVencimiento { get; set; }
      
        
        [Column("saldoVencidoTotal")]
        public decimal? saldoVencidoTotal { get; set; }
      
        
        [Column("saldoAtrasado")]
        public decimal? saldoAtrasado { get; set; }
      
        
        [Column("importePlazo")]
        public decimal? importePlazo { get; set; }
      
        
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
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("TipoPago")]
        public string TipoPago { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("DiasAtrasoHistorico")]
        public int? DiasAtrasoHistorico { get; set; }
      
        
        [Column("SaldoAtrasadoHistorico")]
        public int? SaldoAtrasadoHistorico { get; set; }
      
        
        [Column("DistribuidorNivelIDOrigen")]
        public int? DistribuidorNivelIDOrigen { get; set; }
      
        
        [Column("SaldoComisionPlazo")]
        public decimal? SaldoComisionPlazo { get; set; }
      
        
        [Column("Colocado")]
        public decimal? Colocado { get; set; }
      
        
        [Column("Convenio")]
        public bool? Convenio { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
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
