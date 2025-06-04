using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using ConfiaWebApi.PeticionesRest.Catalogos.Sexos;
namespace DBContext.DBConfia.Custom.Balances3
{
    [ExplicitColumns]
    public class CobranzaCuentas
    {

        [Column("CuentaID")]
        public int CuentaID { get; set; }

        [Column("ImporteCliente")]
        public decimal ImporteCliente { get; set; }

        [Column("ImporteVales")]
        public decimal ImporteVales { get; set; }

        [Column("TieneImporteCliente")]
        public bool TieneImporteCliente { get; set; }

        [Column("TieneImporteVales")]
        public bool TieneImporteVales { get; set; }

    }

    public class CuentasBalance : DBContext.DBConfia.Custom.Balances.BancoBalance
    {
        [Column("SucursalID")]
        public int SucursalID { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }


        [Column("TipoCuenta")]
        public string TipoCuenta { get; set; }
    }

    public abstract class GeneralImporte
    {
        [Column("CuentaID")]
        public int CuentaID { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("Capital")]
        public decimal Capital { get; set; }


        [Column("Plazos")]
        public int Plazos { get; set; }




    }

    public class GeneralCuentas : GeneralImporte
    {
        [Column("Descripcion")]
        public string Descripcion { get; set; }

        [Column("FechaAfectacion")]
        public DateTime? FechaAfectacion { get; set; }

        [Column("Observacion")]
        public string Observacion { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }
        [Column("DistribuidorID")]
        public string DistribuidorID { get; set; }


    }

    public class DniCuentas : GeneralCuentas
    {
        [Column("Sucursal")]
        public string Sucursal { get; set; }
    }

    public class DepositosCuentas : GeneralCuentas { }

    public class RetirosCuentas : GeneralCuentas
    {
        [Column("Sucursal")]
        public string Sucursal { get; set; }
    }

    public class CancelacionesBalance : GeneralCuentas
    {
        [Column("Motivo")]
        public string Motivo { get; set; }


    }

    public class DesembolsoCuentas : GeneralCuentas
    {
        [Column("SaldoCapitalInteres")]
        public decimal SaldoCapitalInteres { get; set; }

        [Column("TipoCreditoID")]
        public int TipoCreditoID { get; set; }

        [Column("TipoCredito")]
        public string TipoCredito { get; set; }
    }

    public class SumaTotalCuentas : GeneralImporte { }

    public class NuevosPrestamos : GeneralCuentas { }

    public class Tiendita : GeneralImporte
    {
        [Column("Sucursal")]
        public string Sucursal { get; set; }

        [Column("Tipo")]
        public string Tipo { get; set; }

        [Column("Aprovechamiento")]
        public decimal Aprovechamiento { get; set; }
    }
    public class Protecciones
    {

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("FechaAfectacion")]
        public DateTime? FechaAfectacion { get; set; }

        [Column("TotalValera")]
        public decimal TotalValera { get; set; }
    }

    public class SucursalComisiones
    {
        [Column("MaxComision")]
        public decimal MaxComision { get; set; }

        [Column("MinComision")]
        public decimal MinComision { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }
    }

    public class TasasSeguros
    {
        [Column("MaxTasa")]
        public decimal MaxTasa { get; set; }

        [Column("MinTasa")]
        public decimal MinTasa { get; set; }

        [Column("MaxSeguro")]
        public decimal MaxSeguro { get; set; }

        [Column("MinSeguro")]
        public decimal MinSeguro { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }
    }

    public class CobranzaCF
    {
        [Column("CuentaID")]
        public string CuentaID { get; set; }

        [Column("Gestoria")]
        public decimal Gestoria { get; set; }

        [Column("Ordinaria")]
        public decimal Ordinaria { get; set; }

        [Column("Total")]
        public decimal Total { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }
    }

    public class DnisDesglosados
    {
        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }

        [Column("CuentaID")]
        public Int64 CuentaID { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("AplicacionAfecta")]
        public Int64 AplicacionAfecta { get; set; }

        [Column("BalanceMovimiento")]
        public Int64 BalanceMovimiento { get; set; }

        [Column("BalanceAplicacion")]
        public Int64 BalanceAplicacion { get; set; }

        [Column("Balance")]
        public string Balance { get; set; }
    }
    public class ClasifCartera
    {

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("Tipo")]
        public string Tipo { get; set; }
    }

    public class TasasComisiones
    {
        [Column("SucursalID")]
        public int SucursalID { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }

        [Column("Principiante")]
        public decimal Principiante { get; set; }

        [Column("Bronce")]
        public decimal Bronce { get; set; }

        [Column("Plata")]
        public decimal Plata { get; set; }

        [Column("Oro")]
        public decimal Oro { get; set; }

        [Column("Diamante")]
        public decimal Diamante { get; set; }

        // Propiedades mínimas para cada nivel
        [Column("PrincipianteMin")]
        public decimal PrincipianteMin { get; set; }

        [Column("BronceMin")]
        public decimal BronceMin { get; set; }

        [Column("PlataMin")]
        public decimal PlataMin { get; set; }

        [Column("OroMin")]
        public decimal OroMin { get; set; }

        [Column("DiamanteMin")]
        public decimal DiamanteMin { get; set; }


        [Column("Platino")]
        public decimal Platino { get; set; }

        [Column("PlatinoMin")]
        public decimal PlatinoMin { get; set; }

        [Column("MaxLimiteCanje")]
        public decimal MaxLimiteCanje { get; set; }

        [Column("MaxPorcTasa")]
        public decimal MaxPorcTasa { get; set; }

        [Column("MinPorcTasa")]
        public decimal MinPorcTasa { get; set; }

         [Column("ProtMin")]
        public decimal ProtMin { get; set; }

         [Column("ProtMax")]
        public decimal ProtMax { get; set; }


        [Column("ProtMaxValeOk")]
        public int ProtMaxValeOk { get; set; }

        [Column("ProtMinValeOk")]
        public int ProtMinValeOk { get; set; }


    }

    public class Multisaldos
    {
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("ImporteBalAnterior")]
        public decimal ImporteBalAnterior { get; set; }

        [Column("ImporteBalActual")]
        public decimal ImporteBalActual { get; set; }

        [Column("SaldoFinalCuenta")]
        public decimal SaldoFinalCuenta { get; set; }
    }

    
    public class Multisaldos2
    {
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("SaldoAntesAntepenultimo")]
        public decimal SaldoAntesAntepenultimo { get; set; }

        [Column("SaldoAntepenultimo")]
        public decimal SaldoAntepenultimo { get; set; }

    }


    public class Multisaldosefec
    {
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("ImporteBalAnterior")]
        public decimal ImporteBalAnterior { get; set; }

        [Column("ImporteBalActual")]
        public decimal ImporteBalActual { get; set; }

        [Column("SaldoFinalCuenta")]
        public decimal SaldoFinalCuenta { get; set; }
    }


    public class MultisaldosCorres
    {
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("ImporteBalAnterior")]
        public decimal ImporteBalAnterior { get; set; }

        [Column("ImporteBalActual")]
        public decimal ImporteBalActual { get; set; }

        [Column("SaldoFinalCuenta")]
        public decimal SaldoFinalCuenta { get; set; }
    }


public class GastosNuevo
{
    [Column("Descripcion")]
    public string Descripcion { get; set; }

    [Column("NombreSucursal")]
    public string NombreSucursal { get; set; }

    [Column("NombreEmpresa")]
    public string NombreEmpresa { get; set; }

    [Column("FechaAplicado")]
    public DateTime FechaAplicado { get; set; }

    [Column("Observaciones")]
    public string Observaciones { get; set; }

    [Column("Total")]
    public decimal Total { get; set; }

    [Column("NumeroCuenta")]
    public string NumeroCuenta { get; set; }

    [Column("SucursalID")]
    public int SucursalID { get; set; }

    [Column("MovimientoID")]
    public int MovimientoID { get; set; }
}



    public class DepositosDNICuentas
    {
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("DniAplicados")]
        public decimal DniAplicados { get; set; }

        [Column("DniPendientes")]
        public decimal DniPendientes { get; set; }

        [Column("TotalDni")]
        public decimal TotalDni { get; set; }
    }

    public class DepositosBalance
    {
        // Fecha del balance inicial
        [Column("FechaSaldoInicial")]
        public DateTime FechaSaldoInicial { get; set; }

        // Numero de la cuenta bancaria
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        // Saldo DNI inicial (antes del balance total)
        [Column("SaldoInicialDNI")]
        public decimal SaldoInicialDNI { get; set; }

        // Total DNI balance actual (movimientos desde el último balance hasta la fecha actual)
        [Column("TotalDNIBalanceActual")]
        public decimal TotalDNIBalanceActual { get; set; }

        // DNIs aplicados en el balance actual (solo los utilizados después del último balance)
        [Column("DNIsAplicadosBalanceActual")]
        public decimal DNIsAplicadosBalanceActual { get; set; }

        // Saldo pendiente de aplicar (saldo DNI + DNIs generados después del último balance - DNIs aplicados después del último balance)
        [Column("SaldoPendienteAplicar")]
        public decimal SaldoPendienteAplicar { get; set; }
    }


    public class CanjesDigitales
    {
        [Column("empresaNombre")]
        public string EmpresaNombre { get; set; }

        [Column("ZonaID")]
        public int ZonaID { get; set; }

        [Column("Zona")]
        public string Zona { get; set; }

        [Column("SucursalID")]
        public int SucursalID { get; set; }

        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }

        [Column("SociasNuevas")]
        public int SociasNuevas { get; set; }

        [Column("TotalSocias")]
        public int TotalSocias { get; set; }

        [Column("SociasConApp")]
        public int SociasConApp { get; set; }

        [Column("PorcentajeSociasApp")]
        public decimal PorcentajeSociasApp { get; set; }

        [Column("CanjeNuevo")]
        public int CanjeNuevo { get; set; }

        [Column("CapitalCanjeNuevo")]
        public decimal CapitalCanjeNuevo { get; set; }

        [Column("CanjeRenova")]
        public int CanjeRenova { get; set; }

        [Column("CapitalRenovacion")]
        public decimal CapitalRenovacion { get; set; }

        [Column("TotalCanjes")]
        public int TotalCanjes { get; set; }

        [Column("TotalColocado")]
        public decimal TotalColocado { get; set; }


        [Column("Total")]
        public decimal Total { get; set; }
    }

}