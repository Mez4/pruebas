using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.SqlTypes;
using System.Numerics;
using ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudIncrementos;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace ConfiaWebApi.PeticionesRest.Creditos.Reportes
{
    public class Reporte1549
    {
        public int DirectorID { get; set; }
        [Range(minimum: 0, maximum: 99999)]
        public int ZonaID { get; set; }

        public string Zona { get; set; }

        public int GrupoID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int SucursalID { get; set; }

        public string Sucursal { get; set; }

        public int CoordinadorID { get; set; }

        public string Coordinador { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorID { get; set; }

        public string Distribuidor { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public decimal PFinal { get; set; }

        public int DiasAtraso { get; set; }

        public int ProductoID { get; set; }

        public decimal SaldoActual { get; set; }

        public decimal SaldoAtrasado { get; set; }

        public decimal VencidoCorte { get; set; }

        public decimal Bonificacion { get; set; }

        public decimal saldoVencidoTotal { get; set; }

        public decimal UltRelacionImporte { get; set; }

        public int CortesAtrasados { get; set; }


        public decimal Pagos { get; set; }

        public decimal D_01 { get; set; }

        public decimal D_02 { get; set; }

        public decimal D_03 { get; set; }

        public decimal D_04 { get; set; }

        public decimal D_05 { get; set; }

        public decimal D_06 { get; set; }

        public decimal D_07 { get; set; }

        public decimal D_08 { get; set; }

        public decimal D_09 { get; set; }

        public decimal D_10 { get; set; }

        public decimal D_11 { get; set; }

        public decimal D_12 { get; set; }

        public decimal D_13 { get; set; }

        public decimal D_14 { get; set; }

        public decimal D_15 { get; set; }

        public decimal D_16 { get; set; }

        public decimal D_17 { get; set; }

        public decimal D_18 { get; set; }

        public decimal D_19 { get; set; }

        public decimal D_20 { get; set; }

        public decimal D_21 { get; set; }

        public decimal D_22 { get; set; }

        public decimal D_23 { get; set; }

        public decimal D_24 { get; set; }

        public decimal D_25 { get; set; }

        public decimal D_26 { get; set; }

        public decimal D_27 { get; set; }

        public decimal D_28 { get; set; }

        public decimal D_29 { get; set; }

        public decimal D_30 { get; set; }

        public decimal D_31 { get; set; }

        public decimal PagosAntes { get; set; }

        public decimal PagosDespues { get; set; }

        public decimal Anticipada { get; set; }

        public decimal Pura { get; set; }

        public decimal Normal { get; set; }

        public decimal Tardia { get; set; }

        public DateTime fechaCorte { get; set; }

        public bool isGerente { get; set; }

        public int SociasPendientes { get; set; }

        public decimal Pactado { get; set; }
        public int? tipoDias { get; set; }

    }

    public class Reporte1600
    {
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalID { get; set; }
        public string SucursalVale { get; set; }
        public Int64 DistribuidorID { get; set; }
        public string NombreCom { get; set; }
        public DateTime FechaRegistro { get; set; }
        public decimal SaldoLiquidar { get; set; }
        public decimal PIntencion { get; set; }
        public decimal ImportePIntencion { get; set; }
        public decimal PorcentajeQuita { get; set; }
        public decimal ImporteQuita { get; set; }
        public decimal ImporteXPlazo { get; set; }
        public decimal TotalAPagar { get; set; }

    }

    public class Reporte1625
    {
        public int ProductoID { get; set; }
        public int GrupoID { get; set; }
        public int tipoDias { get; set; }
        public DateTime fechaCorte { get; set; }
        public int DirectorID { get; set; }
        public int ZonaID { get; set; }
        public string ZonaNombre { get; set; }
        public int SucursalID { get; set; }
        public string Sucursal { get; set; }
        public int CoordinadorID { get; set; }
        public string Coordinador { get; set; }
        public int DistribuidorID { get; set; }
        public string PersonaNombre { get; set; }
        public decimal SaldoActual { get; set; }
        public decimal ImporteTotal { get; set; }
        public decimal SaldoAtrasado { get; set; }
        public int DiasAtraso { get; set; }
        public string Nivel_DistribuidorNivel { get; set; }
        public int CortesAtrasados { get; set; }
        public string DistribuidoresEstatusID { get; set; }
        public string DistribuidoresEstatus { get; set; }
    }
    public class Reporte1549_2
    {
        public DateTime FechaVencimiento { get; set; }
    }

    public class GlobalExe
    {
        public DateTime FechaVencimiento { get; set; }
    }
    public class FNReporte1625_3
    {
        public DateTime FechaVencimiento { get; set; }
    }

    public class ReporteLineasCreditoDistribuidorasResp
    {
        public int CONTRATOID { get; set; }
        public string PRODUCTONOMBRE { get; set; }
        public int DISTRIBUIDORID { get; set; }
        public string NOMBRECOMPLETO { get; set; }
        public decimal LINEACREDITO { get; set; }
        public decimal LINEACREDITODISPONIBLE { get; set; }
        public decimal SALDOACTUAL { get; set; }
        public decimal CAPITALCOLOCADO { get; set; }
        public decimal CAPITALPENDIENTE { get; set; }
        public decimal CAPITALPENDIENTEDISPONIBLE { get; set; }
    }
    public class ReporteDetalle
    {
        public int? IdReporte { get; set; }
        public int? ProductoID { get; set; }
        public string EmpresaNombre { get; set; }
        public long? DistribuidorID { get; set; }
        public string NombreSocia { get; set; }
        public string DistribuidoresEstatusID { get; set; }
        public string DistribuidoresEstatus { get; set; }
        public decimal? LCD_Efectivo { get; set; }
        public decimal? LCD_Tiendita { get; set; }
        public decimal? LCD_PrePersonal { get; set; }
        public decimal? Productividad { get; set; }
        public byte? DistribuidorNivelID { get; set; }
        public string Nivel { get; set; }
        public byte? DistribuidorNivelOrigenID { get; set; }
        public string Origen { get; set; }
        public int? SucursalID { get; set; }
        public string SucursalNombre { get; set; }
        public long? CoordinadorID { get; set; }
        public string CoordinadorNombre { get; set; }
        public decimal? SaldoActual { get; set; }
        public decimal? SaldoAtrasado { get; set; }
        public int? DiasAtraso { get; set; }
        public int? PagosAtrasados { get; set; }
        public decimal? SaldoPendCorte { get; set; }
        public int? Calidad { get; set; }
        public string NoCreditosActivos { get; set; }
        public DateTime? FHUltPago { get; set; }
        public DateTime? FHUltVale { get; set; }
        public DateTime? FHPrimerVale { get; set; }
        public long? GestorID { get; set; }
        public string ResponsableNombre { get; set; }
        public long? PromotorID { get; set; }
        public string NombrePromotor { get; set; }

        // Constructor (opcional)
        public ReporteDetalle()
        {
            // Inicializar con valores predeterminados si es necesario
        }
    }


    public class Reporte1549_RespuestaQuincena1
    {
        public DateTime fechaCorte { get; set; }
        public int zonaValesId { get; set; }
        public string zonaVales { get; set; }
        public int sucursalValeId { get; set; }
        public string sucursalVale { get; set; }
        public int coordinadorValeId { get; set; }
        public string CoordinadorVale { get; set; }
        public int distribuidorId { get; set; }
        public string nombreDistribuidor { get; set; }
        public decimal salAtrAlInicioCorte { get; set; }
        public int Dias_de_Atraso { get; set; }
        public decimal pagAtrAlInicioCorte { get; set; }
        public decimal vencidoCorte { get; set; }
        public decimal aplicado { get; set; }
        public decimal bonificacion { get; set; }
        public decimal pagos { get; set; }
        public decimal D_24 { get; set; }
        public decimal D_25 { get; set; }
        public decimal D_26 { get; set; }
        public decimal D_27 { get; set; }
        public decimal D_28 { get; set; }
        public decimal D_29 { get; set; }
        public decimal D_30 { get; set; }
        public decimal D_31 { get; set; }
        public decimal D_01 { get; set; }
        public decimal D_02 { get; set; }
        public decimal D_03 { get; set; }
        public decimal D_04 { get; set; }
        public decimal D_05 { get; set; }
        public decimal D_06 { get; set; }
        public decimal D_07 { get; set; }
        public decimal D_08 { get; set; }
        public decimal pagosAntes { get; set; }
        public decimal pagosAntesLiqCliFinal { get; set; }
        public decimal pagosDespues { get; set; }
        public decimal PACTADO { get; set; }
        public decimal ANTICIPADA { get; set; }
        public decimal PURA { get; set; }
        public decimal NORMAL { get; set; }
        public decimal TARDÍA { get; set; }
        public decimal FINAL { get; set; }
    }
    public class Reporte1549_RespuestaQuincena2
    {
        public DateTime fechaCorte { get; set; }
        public int zonaValesId { get; set; }
        public string zonaVales { get; set; }
        public int sucursalValeId { get; set; }
        public string sucursalVale { get; set; }
        public int coordinadorValeId { get; set; }
        public string CoordinadorVale { get; set; }
        public int distribuidorId { get; set; }
        public string nombreDistribuidor { get; set; }
        public decimal salAtrAlInicioCorte { get; set; }
        public int Dias_de_Atraso { get; set; }
        public decimal pagAtrAlInicioCorte { get; set; }
        public decimal vencidoCorte { get; set; }
        public decimal aplicado { get; set; }
        public decimal bonificacion { get; set; }
        public decimal pagos { get; set; }
        public decimal D_08 { get; set; }
        public decimal D_09 { get; set; }
        public decimal D_10 { get; set; }
        public decimal D_11 { get; set; }
        public decimal D_12 { get; set; }
        public decimal D_13 { get; set; }
        public decimal D_14 { get; set; }
        public decimal D_15 { get; set; }
        public decimal D_16 { get; set; }
        public decimal D_17 { get; set; }
        public decimal D_18 { get; set; }
        public decimal D_19 { get; set; }
        public decimal D_20 { get; set; }
        public decimal D_21 { get; set; }
        public decimal D_22 { get; set; }
        public decimal D_23 { get; set; }
        public decimal pagosAntes { get; set; }
        public decimal pagosAntesLiqCliFinal { get; set; }
        public decimal pagosDespues { get; set; }
        public decimal PACTADO { get; set; }
        public decimal ANTICIPADA { get; set; }
        public decimal PURA { get; set; }
        public decimal NORMAL { get; set; }
        public decimal TARDÍA { get; set; }
        public decimal FINAL { get; set; }
    }

    public class Reporte1625_RespuestaQuincena1
    {
        public DateTime fechaCorte { get; set; }
        public int zonaValesId { get; set; }
        public string zonaVales { get; set; }
        public int sucursalValeId { get; set; }
        public string sucursalVale { get; set; }
        public int coordinadorValeId { get; set; }
        public string CoordinadorVale { get; set; }
        public int distribuidorId { get; set; }
        public string nombreDistribuidor { get; set; }
        public string Estatus { get; set; }
        public DateTime? FechaConvenio { get; set; }
        public decimal salAtrAlInicioCorte { get; set; }
        public int Dias_de_Atraso { get; set; }
        public decimal pagAtrAlInicioCorte { get; set; }
        public decimal vencidoCorte { get; set; }
        public decimal aplicado { get; set; }
        public decimal bonificacion { get; set; }
        public decimal pagos { get; set; }
        public decimal D_24 { get; set; }
        public decimal D_25 { get; set; }
        public decimal D_26 { get; set; }
        public decimal D_27 { get; set; }
        public decimal D_28 { get; set; }
        public decimal D_29 { get; set; }
        public decimal D_30 { get; set; }
        public decimal D_31 { get; set; }
        public decimal D_01 { get; set; }
        public decimal D_02 { get; set; }
        public decimal D_03 { get; set; }
        public decimal D_04 { get; set; }
        public decimal D_05 { get; set; }
        public decimal D_06 { get; set; }
        public decimal D_07 { get; set; }
        public decimal D_08 { get; set; }
        public decimal pagosAntes { get; set; }
        public decimal pagosAntesLiqCliFinal { get; set; }
        public decimal pagosDespues { get; set; }
        public decimal PACTADO { get; set; }
        public decimal ANTICIPADA { get; set; }
        public decimal PURA { get; set; }
        public decimal NORMAL { get; set; }
        public decimal TARDÍA { get; set; }
        public decimal FINAL { get; set; }
    }
    public class Reporte1625_RespuestaQuincena2
    {
        public DateTime fechaCorte { get; set; }
        public int zonaValesId { get; set; }
        public string zonaVales { get; set; }
        public int sucursalValeId { get; set; }
        public string sucursalVale { get; set; }
        public int coordinadorValeId { get; set; }
        public string CoordinadorVale { get; set; }
        public int distribuidorId { get; set; }
        public string nombreDistribuidor { get; set; }
        public string Estatus { get; set; }
        public DateTime? FechaConvenio { get; set; }
        public decimal salAtrAlInicioCorte { get; set; }
        public int Dias_de_Atraso { get; set; }
        public decimal pagAtrAlInicioCorte { get; set; }
        public decimal vencidoCorte { get; set; }
        public decimal aplicado { get; set; }
        public decimal bonificacion { get; set; }
        public decimal pagos { get; set; }
        public decimal D_08 { get; set; }
        public decimal D_09 { get; set; }
        public decimal D_10 { get; set; }
        public decimal D_11 { get; set; }
        public decimal D_12 { get; set; }
        public decimal D_13 { get; set; }
        public decimal D_14 { get; set; }
        public decimal D_15 { get; set; }
        public decimal D_16 { get; set; }
        public decimal D_17 { get; set; }
        public decimal D_18 { get; set; }
        public decimal D_19 { get; set; }
        public decimal D_20 { get; set; }
        public decimal D_21 { get; set; }
        public decimal D_22 { get; set; }
        public decimal D_23 { get; set; }
        public decimal pagosAntes { get; set; }
        public decimal pagosAntesLiqCliFinal { get; set; }
        public decimal pagosDespues { get; set; }
        public decimal PACTADO { get; set; }
        public decimal ANTICIPADA { get; set; }
        public decimal PURA { get; set; }
        public decimal NORMAL { get; set; }
        public decimal TARDÍA { get; set; }
        public decimal FINAL { get; set; }
    }

    public class IndicadoresGerente_parte1ParData
    {
        public int GrupoID { get; set; }

        public int SucursalID { get; set; }
        public int ProductoID { get; set; }
    }

    public class IndicadoresGerente_parte2ParData
    {
        public int GrupoID { get; set; }

        public int SucursalID { get; set; }
        public int ProductoID { get; set; }
    }

    public class IndicadoresGerente_parte3ParData
    {
        public int GrupoID { get; set; }

        public int SucursalID { get; set; }
        public int ProductoID { get; set; }
    }

    public class IndicadoresSociasPendientes
    {
        public int DistribuidorID { get; set; }
        public string Distribuidor { get; set; }
        public string Estatus { get; set; }
        public decimal Pendiente { get; set; }
        public decimal Peso { get; set; }
    }
    public class Reporte1549parte1
    {
        public string msj { get; set; }
        public decimal Pactado { get; set; }
        public decimal Final { get; set; }
        public decimal Tardia { get; set; }
        public decimal Puntual { get; set; }
        public decimal Anticipada { get; set; }
        public decimal Acumulada { get; set; }
        public decimal Total { get; set; }
        public decimal Pendiente { get; set; }
    }

    public class IndicadoresGerente_parte1
    {
        public int CoordinadorID { get; set; }
        public string Coordinador { get; set; }
        public int SucursalID { get; set; }
        public decimal Pactado { get; set; }
        public decimal Anticipada { get; set; }
        public decimal Puntual { get; set; }
        public decimal Tardia { get; set; }
        public decimal Final { get; set; }
    }

    public class IndicadoresGerente_parte2
    {
        public int GrupoID { get; set; }
        public int CoordinadorID { get; set; }
        public string Coordinador { get; set; }
        public int SociasPendientes { get; set; }
        public decimal Pendiente { get; set; }
        public decimal Porcentaje { get; set; }
    }

    public class IndicadoresGerente_parte3
    {
        public int GrupoID { get; set; }
        public int CoordinadorID { get; set; }
        public string Coordinador { get; set; }
        public int DistribuidorID { get; set; }
        public string Distribuidor { get; set; }
        public decimal Saldo { get; set; }
    }

    public class IndicadoresSemaforo
    {
        public int DistribuidorID { get; set; }
        public string Distribuidor { get; set; }
        public decimal Monto { get; set; }
        public decimal RelacionImporte { get; set; }
        public int DiasAtraso { get; set; }
    }
    public class IndicadoresMora
    {
        public int DistribuidorID { get; set; }
        public string Distribuidor { get; set; }
        public decimal Monto { get; set; }
        public int DiasAtraso { get; set; }
    }

    public class IndicadoresCumpleSocias
    {
        public int DistribuidorID { get; set; }
        public string Distribuidor { get; set; }
        public DateTime FechaCumple { get; set; }
    }

    public class IndicadoresComparativaContraQuincenaVigente
    {
        public decimal Dia01 { get; set; }
        public decimal Dia02 { get; set; }
        public decimal Dia03 { get; set; }
        public decimal Dia04 { get; set; }
        public decimal Dia05 { get; set; }
        public decimal Dia06 { get; set; }
        public decimal Dia07 { get; set; }
        public decimal Dia08 { get; set; }
        public decimal Dia09 { get; set; }
        public decimal Dia10 { get; set; }
        public decimal Dia11 { get; set; }
        public decimal Dia12 { get; set; }
        public decimal Dia13 { get; set; }
        public decimal Dia14 { get; set; }
        public decimal Dia15 { get; set; }
        public decimal SumaCorteVigente { get; set; }
        public DateTime fechaCorte { get; set; }
    }
    public class IndicadoresComparativaContraQuincenaPasado
    {
        public decimal Dia01 { get; set; }
        public decimal Dia02 { get; set; }
        public decimal Dia03 { get; set; }
        public decimal Dia04 { get; set; }
        public decimal Dia05 { get; set; }
        public decimal Dia06 { get; set; }
        public decimal Dia07 { get; set; }
        public decimal Dia08 { get; set; }
        public decimal Dia09 { get; set; }
        public decimal Dia10 { get; set; }
        public decimal Dia11 { get; set; }
        public decimal Dia12 { get; set; }
        public decimal Dia13 { get; set; }
        public decimal Dia14 { get; set; }
        public decimal Dia15 { get; set; }
        public decimal SumaCortePasado { get; set; }
        public DateTime fechaCorte { get; set; }
    }

    public class InidicadoresGerenteComparativaVigente
    {
        public decimal TotalAnticipada { get; set; }
        public decimal TotalPuntual { get; set; }
        public decimal TotalTardia { get; set; }
        public decimal TotalFinal { get; set; }
        public decimal TotalPendiente { get; set; }
        public decimal TotalAcumulado { get; set; }
        public decimal Total { get; set; }
        public DateTime FechaCorte { get; set; }
    }

    public class InidicadoresGerenteComparativaPasada
    {
        public decimal TotalAnticipada { get; set; }
        public decimal TotalPuntual { get; set; }
        public decimal TotalTardia { get; set; }
        public decimal TotalFinal { get; set; }
        public decimal TotalPendiente { get; set; }
        public decimal TotalAcumulado { get; set; }
        public decimal Total { get; set; }
        public DateTime FechaCorte { get; set; }
    }
    public class Reporte1506
    {
        public int ZonaID { get; set; }
        public string ZonaNombre { get; set; }
        public int SucursalID { get; set; }
        public string Sucursal { get; set; }
        public int CoordinadorID { get; set; }
        public string Coordinador { get; set; }
        public int DistribuidorID { get; set; }
        public string personaNombre { get; set; }
        public string Nivel_DistribuidorNivel { get; set; }
        public decimal ImporteTotal { get; set; }
        public int CortesAtrasados { get; set; }
        public decimal SaldoActual { get; set; }
        public decimal SaldoAtrasado { get; set; }
        public int DiasAtraso { get; set; }

        // VARIABLES DE ENTRADA DEL SP
        public int DirectorID { get; set; }
        public int ProductoID { get; set; }
        public int GrupoID { get; set; }
        public int Fecha { get; set; }
        public int TipoDias { get; set; }
        public int JOB { get; set; }
    }

    public class TipoUsuario
    {
        public int usuarioID { get; set; }
        public int tipoUsuario { get; set; }
    }

    public class TipoUsuarioRelaciones
    {
        public int usuarioID { get; set; }
        public int tipoUsuario { get; set; }
    }

    public class Reporte191
    {
        [Range(minimum: 0, maximum: 99999)]
        public int ZonaID { get; set; }

        public string Zona { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int SucursalID { get; set; }

        public string Sucursal { get; set; }

        public int CoordinadorID { get; set; }

        public string Coordinador { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorID { get; set; }

        public string Distribuidor { get; set; }

        public int ProductoID { get; set; }

        public int Mes_NacimientoID { get; set; }

        public string Mes_Nacimiento { get; set; }

        public int GrupoID { get; set; }


    }

    public class Reporte221
    {
        [Range(minimum: 0, maximum: 99999)]
        public int ZonaID { get; set; }

        public string Zona { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int SucursalID { get; set; }

        public string Sucursal { get; set; }

        public int CoordinadorID { get; set; }

       public int UsuarioID { get; set; }

        public string Coordinador { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorID { get; set; }

        public string Distribuidor { get; set; }

        public int ProductoID { get; set; }

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }
        public int GrupoID { get; set; }


    }

    public class Reporte314
    {
        public int DistribuidorID { get; set; }
        public string PersonaNombre { get; set; }
        public DateTime fechaCorte { get; set; }
        public int ClienteID { get; set; }
        public int movCli { get; set; }
        public int CreditoID { get; set; }
        public int NoPago { get; set; }
        public decimal saldoCredito { get; set; }
        public decimal CapitalPlazo { get; set; }
        public decimal InteresPlazo { get; set; }
        public decimal SeguroPlazo { get; set; }
        public decimal IvaPlazo { get; set; }
        public decimal ManejoCuentaPlazo { get; set; }
        public int PrestamoPersonal { get; set; }
        public decimal SaldoComisionPlazo { get; set; }
        public int SegundosAnticipado { get; set; }
        public decimal ProductoTotalPlazo { get; set; }
        public decimal saldoPlazo { get; set; }
        public decimal SaldoUltimoCorte { get; set; }
        public decimal AbonosPlazo { get; set; }
        public decimal ImporteBonificacion { get; set; }
        public int DiaID { get; set; }
        public int MesID { get; set; }
        public int AID { get; set; }
        public int ProductoID { get; set; }
        public int EmpresaId { get; set; }
        public decimal PagosAntes { get; set; }

    }

    public class GlobalNuevo
    {
        public int Id_Reporte { get; set; }
        public int ProductoID { get; set; }
        public int ZonaID { get; set; }
        public string empresaNombre { get; set; }
        public long DistribuidorID { get; set; }
        public string NombreSocia { get; set; }
        public string DistribuidoresEstatusID { get; set; }
        public string DistribuidoresEstatus { get; set; }
        public decimal LC_Efectivo { get; set; }
        public decimal LC_Tiendita { get; set; }
        public decimal LC_PrePersonal { get; set; }
        public decimal LCD_Efectivo { get; set; }
        public decimal LCD_Tiendita { get; set; }
        public decimal LCD_PrePersonal { get; set; }
        public decimal Productividad { get; set; }
        public byte DistribuidorNivelID { get; set; }
        public string Nivel { get; set; }
        public byte DistribuidorNivelOrigenID { get; set; }
        public string Origen { get; set; }
        public int SucursalID { get; set; }
        public string SucursalNombre { get; set; }
        public long CoordinadorID { get; set; }
        public string CoordinadorNombre { get; set; }
        public decimal SaldoActual { get; set; }
        public decimal SaldoActual_Tiendita { get; set; }
        public decimal SaldoActual_PrePersonal { get; set; }
        public decimal SaldoAtrasado { get; set; }
        public int DiasAtraso { get; set; }
        public int PagosAtrasados { get; set; }
        public decimal SaldoPendCorte { get; set; }
        public int Calidad { get; set; }
        public string NoCreditosActivos { get; set; }
        public string NoCreditosActivosPP { get; set; }
        public DateTime? FHUltPago { get; set; }
        public DateTime? FHUltVale { get; set; }
        public DateTime? FHPrimerVale { get; set; }
        public long GestorID { get; set; }
        public string ResponsableNombre { get; set; }
        public long PromotorID { get; set; }
        public string NombrePromotor { get; set; }
        public decimal PorcColocacionLimite { get; set; }
        public int CreditosAtrasados { get; set; }
        public decimal Capital { get; set; }
        public decimal Interes { get; set; }
        public decimal Seguro { get; set; }
        public decimal CapitalLiquidado { get; set; }
        public decimal CarteraEnRiesgo { get; set; }
        public DateTime UltimaRelacionFecha { get; set; }
        public decimal SaldoAtrasado_Tiendita { get; set; }
        public decimal Recuperado { get; set; }
        public decimal UltRelacionImporte { get; set; }
        public decimal TienditaCF { get; set; }
    }


    public class Dia
    {
        public int? ProductoID { get; set; }

        public int? EmpresaId { get; set; }
        public int? DistribuidorID { get; set; }

        public int? DiaID { get; set; }
    }

    public class Reporte1495
    {
        public int ProductoID { get; set; }
        public int SucursalID { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
    }

    public class ResReporte1495
    {
        public int SucursalID { get; set; }
        public string Sucursal { get; set; }
        public int ZonaID { get; set; }
        public string Zona { get; set; }
        public string Empresa { get; set; }
        public string Estatus { get; set; }
        public int SociaID { get; set; }
        public string Socia { get; set; }
        public decimal Linea { get; set; }
        public decimal LineaCS { get; set; }
        public string UsuarioConsolida { get; set; }
        public DateTime FechaConsolida { get; set; }
        public string UsuarioValida { get; set; }
        public DateTime FechaValida { get; set; }
        public DateTime FechaAlta { get; set; }
        public int OrigenIngresoID { get; set; }
        public string OrigenIngreso { get; set; }
        public string EstatusBuro { get; set; }
        public string Coordinador { get; set; }
        public string Promotor { get; set; }
        public decimal LimiteDisponible { get; set; }
        public decimal SaldoActual { get; set; }
        public int DiasAtraso { get; set; }
        public DateTime FechaPrimerCanje { get; set; }
        public int DistribuidorTipoID { get; set; }
        public string DistribuidorTipo { get; set; }
        public DateTime FechaSolicitudValidacion { get; set; }
        public string EstatusID { get; set; }
    }

    public class CreditosColocacion
    {
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }

        public int ZonaID { get; set; }
        public string Zona { get; set; }
        public string Sucursal_Nombre { get; set; }
        public int SucursalID { get; set; }

        public int CoordinadorID { get; set; }

        public string CoordinadorNombre { get; set; }

        public int ValesColocados { get; set; }

        public int Distribuidores { get; set; }

        public int TotalColocado { get; set; }

        public int SaldoActual { get; set; }

        public int Capital { get; set; }

        public int interes { get; set; }

        public int Seguro { get; set; }

        public int TotalPrestado { get; set; }

    }

    public class CreditosColocacionSocia
    {
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }

        public int ZonaID { get; set; }
        public string Zona { get; set; }
        public string Sucursal_Nombre { get; set; }
        public int SucursalID { get; set; }

        public int CoordinadorID { get; set; }

        public string CoordinadorNombre { get; set; }

        public int DistribuidorID { get; set; }

        public string PersonaNombre { get; set; }

        public int ValesColocados { get; set; }

        public int Distribuidores { get; set; }

        public int TotalColocado { get; set; }

        public int SaldoActual { get; set; }

        public int Capital { get; set; }

        public int interes { get; set; }

        public int Seguro { get; set; }

        public int TotalPrestado { get; set; }
        public string NombrePromotor { get; set; }

    }
    public class CreditosReporteActivaciones
    {

        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public DateTime FechaPrimerCanje { get; set; }
        public DateTime FechaHoraRegistro { get; set; }

        public int DistribuidorID { get; set; }
        public int SucursalID { get; set; }
        public string Sucursal { get; set; }
        public string NombrePromotor { get; set; }

        public int PromotorID { get; set; }

        public int DistribuidorNivelID { get; set; }

        public string DistribuidorNivel { get; set; }

        public int DistribuidorNivelOrigenID { get; set; }

        public string NivelOrigen { get; set; }

        public int CoordinadorID { get; set; }

        public string NombreCoordinador { get; set; }


    }

    public class resReporte194
    {
        public Int64 CoordinadorID { get; set; }
        public string NombreCompleto { get; set; }
        public Int64 DistribuidorID { get; set; }
        public string PersonaNombre { get; set; }
        public decimal LineaCredito { get; set; }
        public decimal LineaCreditoDisponible { get; set; }
        public Int64 CreditoID { get; set; }
        public Int64 ClienteID { get; set; }
        public string NombreCliente { get; set; }
        public Int64 ValeCanje { get; set; }
        public decimal Capital { get; set; }
        public DateTime FechaHoraRegistro { get; set; }
        public int Contador { get; set; }
        public decimal ImporteTotal { get; set; }
        public decimal Interes { get; set; }
        public decimal Seguro { get; set; }
        public decimal IVA { get; set; }
        public decimal Cargo { get; set; }
        public int Plazos { get; set; }
        public string EstatusID { get; set; }
        public Int64 UsuarioIDRegistro { get; set; }
        public string nombreUsuarioCreacion { get; set; }
        public Int64 UsuarioIDModifico { get; set; }
        public int TipoDesembolsoID { get; set; }
        public string TipoDesembolso { get; set; }
        public int CANJE_FISICO { get; set; }
        public string tipoCreditoNombre { get; set; }
        public int TipoCreditoID { get; set; }
        public string SucursalNombre { get; set; }
        public int SucursalID { get; set; }
    }


    public class Reporte194
    {
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public int SucursalID { get; set; }

    }


    public class Reportependientecapital
    {
        public DateTime FechaCapital { get; set; }
        public int SucursalID { get; set; }
        public string Sucursal { get; set; }
        public Int64 DistribuidorID { get; set; }
        public string Distribuidor { get; set; }
        public int DistribuidorNivelID { get; set; }
        public string Nivel { get; set; }
        public string EstatusID { get; set; }
        public string Estatus { get; set; }
        public string IDExterno { get; set; }
        public int CreditoID { get; set; }
        public decimal CapítalPendientes { get; set; }
        public decimal SaldoActual { get; set; }
        public int DiasAtraso { get; set; }
        public int TipoCreditoID { get; set; }
        public string Clave { get; set; }
        public string Descripcion { get; set; }

    }


    public class ReporteTienditaComisiones
    {
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
    }


    public class ReporteTienditaComisionesRes
    {
        public DateTime FechaHoraRegistro { get; set; }
        public int CreditoID { get; set; }
        public int IdSku { get; set; }
        public string Marca { get; set; }
        public string Estilo { get; set; }
        public string Color { get; set; }
        public int Cantidad { get; set; }
        public decimal CostoNeto { get; set; }
        public decimal Precio { get; set; }
        public decimal Importe { get; set; }
        public decimal Comision { get; set; }
        public decimal ComisionEspecial { get; set; }
        public string Categoria { get; set; }
        public int id_tipo_category { get; set; }
        public string Captura { get; set; }
        public string Vendedor { get; set; }
        public string sucursal { get; set; }
        public string SistemaRegistro { get; set; }
        public string SistemaOrigen { get; set; }
        public string Nota { get; set; }
    }

    public class ReporteCreditosTiendita
    {
        public DateTime FechaVencimiento { get; set; }
    }

    public class resReporteCreditosTiendita
    {
        public Int64 DistribuidorID { get; set; }
        public string NombreDistribuidor { get; set; }
        public Int64 CreditoTienditaID { get; set; }
        public Int64 CreditoID { get; set; }
        public string Descripcion { get; set; }
        public DateTime FechaRegistra { get; set; }
        public int Unidades { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal ImporteTotal { get; set; }
    }

    public class GeneradorReportesRapidos
    {
        public Int64 PantallaID { get; set; }
        public string JsonData { get; set; }
        public int Accion { get; set; }
    }

    public class GetReportesRapidos
    {
        public Int64 ReporteID { get; set; }
        public Int64 PantallaID { get; set; }
        public string Nombre { get; set; }
        public bool Activo { get; set; }
        public string SQL { get; set; }

        public string Tipo { get; set; }
        public string Label { get; set; }
        public string Selector { get; set; }
        public string Inicial { get; set; }
        public string Options { get; set; }
    }

    public class GetReporte191
    {
        public int ZonaID { get; set; }
        public string Nombre_Zona { get; set; }
        public int SucursalID { get; set; }
        public string Sucursal_Nombre { get; set; }
        public Int64 DistribuidorID { get; set; }
        public string Socia { get; set; }
        public int Edad { get; set; }
        public string Fecha_Nacimiento { get; set; }
        public int Mes_NacimientoID { get; set; }
        public string Mes_Nacimiento { get; set; }
        public int CoordinadorID { get; set; }
        public string Coordinador { get; set; }

    }

    public class UltimaActualizacion
    {
        public DateTime FechaHoraRegistro { get; set; }
    }

    public class UltimaActualizacionGlobal
    {
        public DateTime Fecha_Global { get; set; }
    }

}

