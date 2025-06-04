using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.ConveniosContratos")]
    [ExplicitColumns]
    [PrimaryKey("ContratoID,ConvenioID", AutoIncrement=false)]
    public class ConveniosContratos
    {
              
        
        [Column("ConvenioID")]
        public Int64 ConvenioID { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("SaldoConveniado")]
        public decimal SaldoConveniado { get; set; }
      
        
        [Column("DiasAtrasoAtrAlCorte")]
        public int DiasAtrasoAtrAlCorte { get; set; }
      
        
        [Column("PagosAtrAlCorte")]
        public int PagosAtrAlCorte { get; set; }
      
        
        [Column("SaldoAtrAlCorte")]
        public decimal SaldoAtrAlCorte { get; set; }
      
        
        [Column("FechaHoraUltimoPago")]
        public DateTime? FechaHoraUltimoPago { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("Saldo_Deposito")]
        public decimal? Saldo_Deposito { get; set; }
      
        
        [Column("ImporteBonificar")]
        public decimal? ImporteBonificar { get; set; }
      
        
        [Column("PorcBon")]
        public decimal PorcBon { get; set; }
      
        
        [Column("PagoIntencion")]
        public decimal? PagoIntencion { get; set; }
      
        
        [Column("PorcPagInt")]
        public decimal? PorcPagInt { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("ImporteConvenio")]
        public decimal? ImporteConvenio { get; set; }
      
        
        [Column("Plazos")]
        public int Plazos { get; set; }
      
        
        [Column("PlazosTotales")]
        public int? PlazosTotales { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("Liquidado")]
        public bool Liquidado { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("UsuarioCancela")]
        public int? UsuarioCancela { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("FechaUltimoPago")]
        public DateTime? FechaUltimoPago { get; set; }
      
        
        [Column("FechaVencimientoActual")]
        public DateTime? FechaVencimientoActual { get; set; }
      
        
        [Column("PorcAbono")]
        public decimal? PorcAbono { get; set; }


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
