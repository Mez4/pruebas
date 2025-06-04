using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.ResumenReporte")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class ResumenReporte
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idConsulta")]
        public int idConsulta { get; set; }
      
        
        [Column("FechaIngresoBD")]
        public string FechaIngresoBD { get; set; }
      
        
        [Column("NumeroMOP7")]
        public string NumeroMOP7 { get; set; }
      
        
        [Column("NumeroMOP6")]
        public Int64 NumeroMOP6 { get; set; }
      
        
        [Column("NumeroMOP5")]
        public string NumeroMOP5 { get; set; }
      
        
        [Column("NumeroMOP4")]
        public string NumeroMOP4 { get; set; }
      
        
        [Column("NumeroMOP3")]
        public string NumeroMOP3 { get; set; }
      
        
        [Column("NumeroMOP2")]
        public string NumeroMOP2 { get; set; }
      
        
        [Column("NumeroMOP1")]
        public string NumeroMOP1 { get; set; }
      
        
        [Column("NumeroMOP0")]
        public string NumeroMOP0 { get; set; }
      
        
        [Column("NumeroMOPUR")]
        public string NumeroMOPUR { get; set; }
      
        
        [Column("NumeroCuentas")]
        public string NumeroCuentas { get; set; }
      
        
        [Column("CuentasPagosFijosHipotecas")]
        public string CuentasPagosFijosHipotecas { get; set; }
      
        
        [Column("CuentasRevolventesAbiertas")]
        public string CuentasRevolventesAbiertas { get; set; }
      
        
        [Column("CuentasCerradas")]
        public string CuentasCerradas { get; set; }
      
        
        [Column("CuentasNegativasActuales")]
        public string CuentasNegativasActuales { get; set; }
      
        
        [Column("CuentasClavesHistoriaNegativa")]
        public string CuentasClavesHistoriaNegativa { get; set; }
      
        
        [Column("CuentasDisputa")]
        public string CuentasDisputa { get; set; }
      
        
        [Column("NumeroSolicitudesUltimos6Meses")]
        public string NumeroSolicitudesUltimos6Meses { get; set; }
      
        
        [Column("NuevaDireccionReportadaUltimos60Dias")]
        public string NuevaDireccionReportadaUltimos60Dias { get; set; }
      
        
        [Column("MensajesAlerta")]
        public string MensajesAlerta { get; set; }
      
        
        [Column("ExistenciaDeclaracionesConsumidor")]
        public string ExistenciaDeclaracionesConsumidor { get; set; }
      
        
        [Column("TipoMoneda")]
        public string TipoMoneda { get; set; }
      
        
        [Column("TotalLimitesCreditoRevolventes")]
        public string TotalLimitesCreditoRevolventes { get; set; }
      
        
        [Column("TotalCreditosMaximosRevolventes")]
        public string TotalCreditosMaximosRevolventes { get; set; }
      
        
        [Column("TotalSaldosActualesRevolventes")]
        public string TotalSaldosActualesRevolventes { get; set; }
      
        
        [Column("TotalSaldosVencidosRevolventes")]
        public string TotalSaldosVencidosRevolventes { get; set; }
      
        
        [Column("TotalPagosRevolventes")]
        public string TotalPagosRevolventes { get; set; }
      
        
        [Column("PctLimiteCreditoUtilizadoRevolventes")]
        public string PctLimiteCreditoUtilizadoRevolventes { get; set; }
      
        
        [Column("TotalCreditosMaximosPagosFijos")]
        public string TotalCreditosMaximosPagosFijos { get; set; }
      
        
        [Column("TotalSaldosActualesPagosFijos")]
        public string TotalSaldosActualesPagosFijos { get; set; }
      
        
        [Column("TotalSaldosVencidosPagosFijos")]
        public string TotalSaldosVencidosPagosFijos { get; set; }
      
        
        [Column("TotalPagosPagosFijos")]
        public string TotalPagosPagosFijos { get; set; }
      
        
        [Column("NumeroMOP96")]
        public string NumeroMOP96 { get; set; }
      
        
        [Column("NumeroMOP97")]
        public string NumeroMOP97 { get; set; }
      
        
        [Column("NumeroMOP99")]
        public string NumeroMOP99 { get; set; }
      
        
        [Column("FechaAperturaCuentaMasAntigua")]
        public string FechaAperturaCuentaMasAntigua { get; set; }
      
        
        [Column("FechaAperturaCuentaMasReciente")]
        public string FechaAperturaCuentaMasReciente { get; set; }
      
        
        [Column("TotalSolicitudesReporte")]
        public string TotalSolicitudesReporte { get; set; }
      
        
        [Column("FechaSolicitudReporteMasReciente")]
        public string FechaSolicitudReporteMasReciente { get; set; }
      
        
        [Column("NumeroTotalCuentasDespachoCobranza")]
        public string NumeroTotalCuentasDespachoCobranza { get; set; }
      
        
        [Column("FechaAperturaCuentaMasRecienteDespachoCobranza")]
        public string FechaAperturaCuentaMasRecienteDespachoCobranza { get; set; }
      
        
        [Column("FechaSolicitudMasRecienteDespachoCobranza")]
        public string FechaSolicitudMasRecienteDespachoCobranza { get; set; }
      
        
        [Column("NumeroTotalSolicitudesDespachosCobranza")]
        public string NumeroTotalSolicitudesDespachosCobranza { get; set; }


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
