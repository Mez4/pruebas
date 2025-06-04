using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.Cuentas")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Cuentas
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idConsulta")]
        public int idConsulta { get; set; }
      
        
        [Column("SaldoVencido")]
        public decimal SaldoVencido { get; set; }
      
        
        [Column("SaldoActual")]
        public string SaldoActual { get; set; }
      
        
        [Column("IdentificadorCAN")]
        public string IdentificadorCAN { get; set; }
      
        
        [Column("NumeroCuentaActual")]
        public Int64 NumeroCuentaActual { get; set; }
      
        
        [Column("NumeroPagosVencidos")]
        public Int64 NumeroPagosVencidos { get; set; }
      
        
        [Column("ModoReportar")]
        public string ModoReportar { get; set; }
      
        
        [Column("TipoCuenta")]
        public string TipoCuenta { get; set; }
      
        
        [Column("ClaveUnidadMonetaria")]
        public string ClaveUnidadMonetaria { get; set; }
      
        
        [Column("HistoricoPagos")]
        public string HistoricoPagos { get; set; }
      
        
        [Column("CreditoMaximo")]
        public decimal CreditoMaximo { get; set; }
      
        
        [Column("FechaUltimaCompra")]
        public string FechaUltimaCompra { get; set; }
      
        
        [Column("FormaPagoActual")]
        public string FormaPagoActual { get; set; }
      
        
        [Column("FechaUltimoPago")]
        public string FechaUltimoPago { get; set; }
      
        
        [Column("Garantia")]
        public string Garantia { get; set; }
      
        
        [Column("FechaActualizacion")]
        public Int64 FechaActualizacion { get; set; }
      
        
        [Column("ValorActivoValuacion")]
        public Int64 ValorActivoValuacion { get; set; }
      
        
        [Column("FechaCierreCuenta")]
        public Int64 FechaCierreCuenta { get; set; }
      
        
        [Column("FechaReporte")]
        public string FechaReporte { get; set; }
      
        
        [Column("ClaveObservacion")]
        public string ClaveObservacion { get; set; }
      
        
        [Column("NumeroPagos")]
        public Int64 NumeroPagos { get; set; }
      
        
        [Column("UltimaFechaSaldoCero")]
        public Int64 UltimaFechaSaldoCero { get; set; }
      
        
        [Column("RegistroImpugnado")]
        public Int64 RegistroImpugnado { get; set; }
      
        
        [Column("FechaAperturaCuenta")]
        public string FechaAperturaCuenta { get; set; }
      
        
        [Column("HistoricoCAN")]
        public string HistoricoCAN { get; set; }
      
        
        [Column("FechaMasAntiguaHistoricoCAN")]
        public string FechaMasAntiguaHistoricoCAN { get; set; }
      
        
        [Column("IndicadorTipoResponsabilidad")]
        public string IndicadorTipoResponsabilidad { get; set; }
      
        
        [Column("FechaCancelacionCAN")]
        public string FechaCancelacionCAN { get; set; }
      
        
        [Column("TipoContrato")]
        public string TipoContrato { get; set; }
      
        
        [Column("FechaMasRecienteHistoricoCAN")]
        public string FechaMasRecienteHistoricoCAN { get; set; }
      
        
        [Column("NombreOtorgante")]
        public string NombreOtorgante { get; set; }
      
        
        [Column("LimiteCredito")]
        public decimal LimiteCredito { get; set; }
      
        
        [Column("FechaAperturaCAN")]
        public string FechaAperturaCAN { get; set; }
      
        
        [Column("IdentificadorCredito")]
        public string IdentificadorCredito { get; set; }
      
        
        [Column("ClaveOtorgante")]
        public string ClaveOtorgante { get; set; }
      
        
        [Column("MontoPagar")]
        public Int64 MontoPagar { get; set; }
      
        
        [Column("FechaMasRecienteHistoricoPagos")]
        public Int64 FechaMasRecienteHistoricoPagos { get; set; }
      
        
        [Column("MopHistoricoMorosidadMasGrave")]
        public string MopHistoricoMorosidadMasGrave { get; set; }
      
        
        [Column("FechaHistoricaMorosidadMasGrave")]
        public Int64 FechaHistoricaMorosidadMasGrave { get; set; }
      
        
        [Column("ImporteSaldoMorosidadHistMasGrave")]
        public Int64 ImporteSaldoMorosidadHistMasGrave { get; set; }
      
        
        [Column("FechaMasAntiguaHistoricoPagos")]
        public Int64 FechaMasAntiguaHistoricoPagos { get; set; }
      
        
        [Column("TotalPagosCalificadosMOP3")]
        public Int64 TotalPagosCalificadosMOP3 { get; set; }
      
        
        [Column("TotalPagosCalificadosMOP4")]
        public Int64 TotalPagosCalificadosMOP4 { get; set; }
      
        
        [Column("FechaInicioReestructura")]
        public Int64 FechaInicioReestructura { get; set; }
      
        
        [Column("TotalPagosCalificadosMOP5")]
        public Int64 TotalPagosCalificadosMOP5 { get; set; }
      
        
        [Column("TotalPagosCalificadosMOP2")]
        public Int64 TotalPagosCalificadosMOP2 { get; set; }
      
        
        [Column("NumeroTelefonoOtorgante")]
        public Int64 NumeroTelefonoOtorgante { get; set; }
      
        
        [Column("TotalPagosReportados")]
        public Int64 TotalPagosReportados { get; set; }
      
        
        [Column("IdentificadorSociedadInformacionCrediticia")]
        public Int64 IdentificadorSociedadInformacionCrediticia { get; set; }
      
        
        [Column("MontoUltimoPago")]
        public Int64 MontoUltimoPago { get; set; }
      
        
        [Column("FrecuenciaPagos")]
        public string FrecuenciaPagos { get; set; }


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
