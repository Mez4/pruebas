using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ContratosHistorico")]
    [ExplicitColumns]
    [PrimaryKey("ContratoID,Fecha", AutoIncrement=false)]
    public class ContratosHistorico
    {
              
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int UsuarioIDRegistro { get; set; }
      
        
        [Column("LineaCredito")]
        public decimal LineaCredito { get; set; }
      
        
        [Column("LineaCreditoDisponible")]
        public decimal LineaCreditoDisponible { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("Interes")]
        public decimal Interes { get; set; }
      
        
        [Column("Comision")]
        public decimal Comision { get; set; }
      
        
        [Column("Seguro")]
        public decimal Seguro { get; set; }
      
        
        [Column("Cargo")]
        public decimal Cargo { get; set; }
      
        
        [Column("IVA")]
        public decimal IVA { get; set; }
      
        
        [Column("Abonos")]
        public decimal Abonos { get; set; }
      
        
        [Column("ImporteTotal")]
        public decimal ImporteTotal { get; set; }
      
        
        [Column("DiasAtraso")]
        public int DiasAtraso { get; set; }
      
        
        [Column("DiasAtrasoMaximo")]
        public int DiasAtrasoMaximo { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }
      
        
        [Column("CapitalPagado")]
        public decimal CapitalPagado { get; set; }
      
        
        [Column("NoCreditosActivos")]
        public int NoCreditosActivos { get; set; }
      
        
        [Column("PagosAtrasados")]
        public int PagosAtrasados { get; set; }
      
        
        [Column("InteresPagado")]
        public decimal InteresPagado { get; set; }
      
        
        [Column("IVAPagado")]
        public decimal IVAPagado { get; set; }
      
        
        [Column("ComisionPagado")]
        public decimal ComisionPagado { get; set; }
      
        
        [Column("SeguroPagado")]
        public decimal SeguroPagado { get; set; }
      
        
        [Column("CargoPagado")]
        public decimal CargoPagado { get; set; }
      
        
        [Column("FechaHoraUltimoPago")]
        public DateTime? FechaHoraUltimoPago { get; set; }
      
        
        [Column("CapitalPendiente")]
        public decimal CapitalPendiente { get; set; }
      
        
        [Column("InteresPendiente")]
        public decimal InteresPendiente { get; set; }
      
        
        [Column("IVAPendiente")]
        public decimal IVAPendiente { get; set; }
      
        
        [Column("ComisionPendiente")]
        public decimal ComisionPendiente { get; set; }
      
        
        [Column("SeguroPendiente")]
        public decimal SeguroPendiente { get; set; }
      
        
        [Column("CargoPendiente")]
        public decimal CargoPendiente { get; set; }
      
        
        [Column("Ciclo")]
        public int Ciclo { get; set; }
      
        
        [Column("PersonaId")]
        public Int64 PersonaId { get; set; }
      
        
        [Column("coordinadorID")]
        public int coordinadorID { get; set; }
      
        
        [Column("convenioTipoID")]
        public int convenioTipoID { get; set; }
      
        
        [Column("capitalPendienteDisponible")]
        public decimal capitalPendienteDisponible { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        public async Task<List<DBContext.DBConfia.Distribuidores.Distribuidores>> CH__DISTRIBUIDORES(DBConfiaContext parContext)
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
