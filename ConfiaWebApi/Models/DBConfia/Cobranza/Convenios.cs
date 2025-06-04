using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.Convenios")]
    [ExplicitColumns]
    [PrimaryKey("ConvenioID")]
    public class Convenios
    {
              
        
        [Column("ConvenioID")]
        public Int64 ConvenioID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("SaldoConveniado")]
        public decimal SaldoConveniado { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("Saldo_Deposito")]
        public decimal Saldo_Deposito { get; set; }
      
        
        [Column("ImporteBonificar")]
        public decimal? ImporteBonificar { get; set; }
      
        
        [Column("PorcBon")]
        public decimal PorcBon { get; set; }
      
        
        [Column("PagoIntencion")]
        public decimal? PagoIntencion { get; set; }
      
        
        [Column("PorcPagInt")]
        public decimal PorcPagInt { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("ImporteConvenio")]
        public decimal? ImporteConvenio { get; set; }
      
        
        [Column("Plazos")]
        public int Plazos { get; set; }
      
        
        [Column("PlazosTotales")]
        public int PlazosTotales { get; set; }
      
        
        [Column("EstatusId")]
        public int EstatusId { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("Liquidado")]
        public bool Liquidado { get; set; }
      
        
        [Column("FechaUltimoPago")]
        public DateTime? FechaUltimoPago { get; set; }
      
        
        [Column("FechaVencimientoActual")]
        public DateTime? FechaVencimientoActual { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("UsuarioPreAutoriza")]
        public int? UsuarioPreAutoriza { get; set; }
      
        
        [Column("FechaPreAutorizacion")]
        public DateTime? FechaPreAutorizacion { get; set; }
      
        
        [Column("UsuarioAutoriza")]
        public int? UsuarioAutoriza { get; set; }
      
        
        [Column("FechaAutorizacion")]
        public DateTime? FechaAutorizacion { get; set; }
      
        
        [Column("UsuarioCancela")]
        public int? UsuarioCancela { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("ConvenioIDAnterior")]
        public Int64? ConvenioIDAnterior { get; set; }
      
        
        [Column("DocumentoConvenioID")]
        public Int64? DocumentoConvenioID { get; set; }


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
