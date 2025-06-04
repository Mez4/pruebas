using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Contratos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Contratos_VW
    {
              
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("ProductoNombre")]
        public string ProductoNombre { get; set; }
      
        
        [Column("productoActivo")]
        public bool? productoActivo { get; set; }
      
        
        [Column("LineaCredito")]
        public decimal LineaCredito { get; set; }
      
        
        [Column("LineaCreditoDisponible")]
        public decimal? LineaCreditoDisponible { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("Interes")]
        public decimal Interes { get; set; }
      
        
        [Column("ManejoCuenta")]
        public decimal ManejoCuenta { get; set; }
      
        
        [Column("Seguro")]
        public decimal Seguro { get; set; }
      
        
        [Column("Cargo")]
        public decimal Cargo { get; set; }
      
        
        [Column("IVA")]
        public decimal IVA { get; set; }
      
        
        [Column("Abonos")]
        public decimal Abonos { get; set; }
      
        
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
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
      
        
        [Column("ManejoCuentaPagado")]
        public decimal ManejoCuentaPagado { get; set; }
      
        
        [Column("SeguroPagado")]
        public decimal SeguroPagado { get; set; }
      
        
        [Column("CargoPagado")]
        public decimal CargoPagado { get; set; }
      
        
        [Column("FechaHoraUltimoPago")]
        public DateTime? FechaHoraUltimoPago { get; set; }
      
        
        [Column("PagoPuntualUltmoPago")]
        public bool? PagoPuntualUltmoPago { get; set; }
      
        
        [Column("Reestructura")]
        public decimal? Reestructura { get; set; }
      
        
        [Column("CapitalPendiente")]
        public decimal? CapitalPendiente { get; set; }
      
        
        [Column("InteresPendiente")]
        public decimal? InteresPendiente { get; set; }
      
        
        [Column("IVAPendiente")]
        public decimal? IVAPendiente { get; set; }
      
        
        [Column("ManejoCuentaPendiente")]
        public decimal? ManejoCuentaPendiente { get; set; }
      
        
        [Column("SeguroPendiente")]
        public decimal? SeguroPendiente { get; set; }
      
        
        [Column("CargoPendiente")]
        public decimal? CargoPendiente { get; set; }
      
        
        [Column("Ciclo")]
        public int Ciclo { get; set; }
      
        
        [Column("convenioTipoID")]
        public int convenioTipoID { get; set; }
      
        
        [Column("convenioTipoNombre")]
        public string convenioTipoNombre { get; set; }
      
        
        [Column("convenioTipoActivo")]
        public bool? convenioTipoActivo { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("DistribuidorNombre")]
        public string DistribuidorNombre { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64 PersonaIDRegistro { get; set; }
      
        
        [Column("CapitalColocadoMinimo")]
        public decimal? CapitalColocadoMinimo { get; set; }
      
        
        [Column("CapitalColocadoMaximo")]
        public decimal? CapitalColocadoMaximo { get; set; }
      
        
        [Column("IncrementoQuincena")]
        public decimal? IncrementoQuincena { get; set; }
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }
      
        
        [Column("Principal")]
        public bool? Principal { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
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
