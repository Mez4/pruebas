using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using ConfiaWebApi.PeticionesRest.Catalogos.Sexos;
namespace DBContext.DBConfia.Custom.Balances
{
    [ExplicitColumns]
    public class Balances
    {
        [Column("BalanceIDTemp")]
        public int BalanceIDTemp { get; set; }

        [Column("CtaBancoId")]
        public int CtaBancoId { get; set; }

        [Column("CtaBanco")]
        public string CtaBanco { get; set; }

        [Column("CtaContable")]
        public string CtaContable { get; set; }

        [Column("SaldoSistema")]
        public decimal SaldoSistema { get; set; }

        [Column("SaldoEdoCuenta")]
        public decimal SaldoEdoCuenta { get; set; }

        [Column("SaldoCierreAnterior")]
        public decimal SaldoCierreAnterior { get; set; }

        [Column("Diferencia")]
        public decimal Diferencia { get; set; }

    }

    public class Balances1
    {
        [Column("BalanceIDTemp")]
        public int BalanceIDTemp { get; set; }

        [Column("CtaBancoId")]
        public int CtaBancoId { get; set; }

        [Column("CtaBanco")]
        public string CtaBanco { get; set; }

        [Column("CtaContable")]
        public string CtaContable { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }

        [Column("SaldoSistema")]
        public decimal SaldoSistema { get; set; }



    }
    public class Balances2
    {
        [Column("BalanceIDTemp")]
        public int BalanceIDTemp { get; set; }
        [Column("Id")]
        public int CobranzaId { get; set; }

        [Column("CtaBanco")]
        public string CtaBanco { get; set; }

        [Column("CtaBancoId")]
        public int CtaBancoId { get; set; }

        [Column("CtaContable")]
        public string CtaContable { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }

        [Column("SaldoSistema")]
        public decimal SaldoSistema { get; set; }

        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }

    }
    public class Balances3
    {
        [Column("BalanceIDTemp")]
        public int BalanceIDTemp { get; set; }

        [Column("CtaBanco")]
        public string CtaBanco { get; set; }

        [Column("CtaContable")]
        public string CtaContable { get; set; }


        [Column("Producto")]
        public string Producto { get; set; }

        [Column("SaldoSistema")]
        public decimal SaldoSistema { get; set; }

        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }

        [Column("Observaciones")]
        public string Observaciones { get; set; }

        [Column("CuentaDestino")]
        public string CuentaDestino { get; set; }

        [Column("FechaAfectacion")]
        public string FechaAfectacion { get; set; }

        [Column("FechaCaptura")]
        public string FechaCaptura { get; set; }

    }

    public class ObtAgrupacion
    {
        /* [Column("Id")]
        public int CobranzaId { get; set; } */

        [Column("AgrupacionID")]
        public int AgrupacionID { get; set; }

    }
    public class Balances4
    {
        [Column("Error")]
        public string Error { get; set; }

        [Column("MensajeID")]
        public string MensajeID { get; set; }


        [Column("Mensaje")]
        public string Mensaje { get; set; }

        [Column("BalanceID")]
        public int BalanceID { get; set; }

        [Column("Diferencia")]
        public bool Diferencia { get; set; }

        [Column("PeriodoID")]
        public int PeriodoID { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }


    }

    public class MoverMovimientos
    {
        [Column("MensajeID")]
        public int MensajeID { get; set; }


        [Column("Mensaje")]
        public string Mensaje { get; set; }
    }

    public class ObtenerBalanceID
    {
        [Column("MensajeID")]
        public int MensajeID { get; set; }


        [Column("Mensaje")]
        public string Mensaje { get; set; }


        [Column("ProductoID")]
        public int ProductoID { get; set; }
    }

    public class BalancesPrincipalAccion1
    {
        [Column("MovimientoID")]
        public int MovimientoID { get; set; }

        [Column("CuentaBancariaPrincipalID")]
        public int CuentaBancariaPrincipalID { get; set; }

        [Column("Observaciones")]
        public string Observaciones { get; set; }

        [Column("TipoCuenta")]
        public string TipoCuenta { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }

        [Column("NumeroCuentaF")]
        public string NumeroCuentaF { get; set; }

        [Column("DescripcionCuentaF")]
        public string DescripcionCuentaF { get; set; }

        [Column("CajaNombre")]
        public string CajaNombre { get; set; }

        //TipoMovimiento
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }

        //Total
        [Column("Importe")]
        public decimal Importe { get; set; }

        //SaldoActual
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }

        //SaldoCierreAnterior
        [Column("SaldoCierreAnterior")]
        public decimal SaldoCierreAnterior { get; set; }

        [Column("MovimientoEntSal")]
        public bool MovimientoEntSal { get; set; }

        [Column("CreditoID")]
        public int CreditoID { get; set; }


    }

    public class BalancesPrincipalAccion2
    {

        [Column("Producto")]
        public string Producto { get; set; }

        [Column("ClienteID")]
        public int ClienteID { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("Plazos")]
        public int Plazos { get; set; }

        [Column("ImporteTotal")]
        public decimal ImporteTotal { get; set; }

        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
        [Column("ID")]
        public int ID { get; set; }

        [Column("NombreSucursal")]
        public string SucursalNombre { get; set; }

        [Column("Periodo")]
        public int Periodo { get; set; }

    }

    public class BalancesPrincipalAccion3
    {
        [Column("CuentaBancariaPrincipalID")]
        public int CuentaBancariaPrincipalID { get; set; }

        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("Id")]
        public int Id { get; set; }

        [Column("TipoCuenta")]
        public string TipoCuenta { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }

        [Column("NumeroCuentaF")]
        public string NumeroCuentaF { get; set; }

        [Column("DescripcionCuentaF")]
        public string DescripcionCuentaF { get; set; }

        [Column("CajaNombre")]
        public string CajaNombre { get; set; }

        //TipoMovimiento
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }

        //Total
        [Column("Total")]
        public decimal Total { get; set; }

        //SaldoActual
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }

        //SaldoCierreAnterior
        [Column("SaldoCierreAnterior")]
        public decimal SaldoCierreAnterior { get; set; }
        [Column("MovimientoEntSal")]
        public bool MovimientoEntSal { get; set; }

    }
    public class BalancesPrincipalAccion4
    {
        [Column("Error")]
        public string Error { get; set; }

        [Column("MensajeID")]
        public string MensajeID { get; set; }


        [Column("Mensaje")]
        public string Mensaje { get; set; }

        [Column("BalanceID")]
        public int BalanceID { get; set; }

        [Column("Diferencia")]
        public bool Diferencia { get; set; }

        [Column("PeriodoID")]
        public int PeriodoID { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("MovimientoEntSal")]
        public bool MovimientoEntSal { get; set; }

    }

    public class BalanceCreditosCancelados
    {
        //MvCancelacion string
        [Column("MvCancelacion")]
        public string MvCancelacion { get; set; }
        //UsrCancela
        [Column("UsrCancela")]
        public string UsrCancela { get; set; }

        [Column("CuentaID")]
        public int? CuentaID { get; set; }

        [Column("DistribuidorID")]
        public int? DistribuidorID { get; set; }

        [Column("NombreCompleto")]
        public string? NombreCompleto { get; set; }

        [Column("cancelacionFhRegistro")]
        public DateTime? cancelacionFhRegistro { get; set; }

        [Column("ImporteTotal")]
        public decimal ImporteTotal { get; set; }

        [Column("CancelacionImporte")]
        public decimal CancelacionImporte { get; set; }

        [Column("UsuarioCanceloID")]
        public int? UsuarioCanceloID { get; set; }

        [Column("CancelacionObservacion")]
        public string? CancelacionObservacion { get; set; }

        [Column("TipoMovimiento")]
        public string? TipoMovimiento { get; set; }

        [Column("Nombre")]
        public string? Nombre { get; set; }

        [Column("MovimientoID")]
        public int? MovimientoID { get; set; }

        [Column("FechaAfectacion")]
        public DateTime? FechaAfectacion { get; set; }

        [Column("TipoCancelacion")]
        public string? TipoCancelacion { get; set; }

        [Column("Capital")]
        public decimal Capital { get; set; }

        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
        [Column("Observaciones")]
        public string? Observaciones { get; set; }
        //creditoid
        [Column("CreditoID")]
        public int? CreditoID { get; set; }

        [Column("Plazos")]
        public string? Plazos { get; set; }

    }

    public class BalancePolizasContratistas
    {


        [Column("ContratistaID")]
        public int ContratistaID { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; }

        [Column("ApellidoPaterno")]
        public string ApellidoPaterno { get; set; }

        [Column("ApellidoMaterno")]
        public string ApellidoMaterno { get; set; }

        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }


        [Column("DeudaID")]
        public int DeudaID { get; set; }

        [Column("DeudaInicial")]
        public int DeudaInicial { get; set; }

        [Column("DeudaActual")]
        public int DeudaActual { get; set; }

        [Column("DescrpcionRubro")]
        public string DescripcionRubro { get; set; }

        [Column("FechaAlta")]
        public DateTime FechaAlta { get; set; }

        [Column("MontoAPagar")]
        public int MontoAPagar { get; set; }

        [Column("CargoAgregado")]
        public int CargoAgregado { get; set; }
    }

    public class BalanceDesgloseGastos
    {

        //ObservacionesSolicitudes
        [Column("ObservacionesSolicitudes")]
        public string ObservacionesSolicitudes { get; set; }

        //Desc9
        [Column("Desc9")]
        public string Desc9 { get; set; }


        //column Descripcion1
        [Column("Descripcion1")]
        public string Descripcion1 { get; set; }

        [Column("CajaID")]
        public int CajaID { get; set; }

        [Column("SolicitudGastoID")]
        public int SolicitudGastoID { get; set; }

        [Column("FechaAfectacion")]
        public DateTime FechaAfectacion { get; set; }

        [Column("MovimientoID")]
        public int MovimientoID { get; set; }

        [Column("SucursalId")]
        public int SucursalId { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; }

        [Column("OrigenSucursalID")]
        public int OrigenSucursalID { get; set; }

        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("Observaciones")]
        public string Observaciones { get; set; }

        [Column("MontoAutorizado")]
        public int MontoAutorizado { get; set; }

        [Column("RubroGastosID")]
        public int RubroGastosID { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }
        [Column("Util")]
        public bool Util { get; set; }
        //CuentaID INT
        [Column("CuentaID")]
        public int CuentaID { get; set; }
    }


    public class BancoBalance
    {
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
        //DescripcionCuenta
        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }

        [Column("CajaID")]
        public int CajaID { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }

        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }

        [Column("SaldoTotal")]
        public decimal SaldoTotal { get; set; }

        [Column("Id")]
        public int Id { get; set; }


        [Column("SumaPorCaja")]
        public decimal SumaPorCaja { get; set; }

        [Column("NombreCaja")]
        public string NombreCaja { get; set; }

        [Column("SumaSaldoActualReal")]
        public decimal SumaSaldoActualReal { get; set; }

        [Column("PeriodoID")]
        public int PeriodoID { get; set; }

        [Column("FechaApertura")]
        public DateTime FechaApertura { get; set; }

        [Column("FechaCierre")]
        public DateTime FechaCierre { get; set; }

        [Column("SaldoActualReal")]
        public decimal SaldoActualReal { get; set; }

        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }

        [Column("SaldoInicial")]
        public decimal SaldoInicial { get; set; }
        //CuentaID INT
        [Column("CuentaID")]
        public int CuentaID { get; set; }
    }

    public class DepositosCuentas
    {
        [Column("CajaID")]
        public int CajaID { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }

        [Column("FechaAfectacion")]
        public DateTime FechaAfectacion { get; set; }

        [Column("Observaciones")]
        public string Observaciones { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }


        [Column("CuentaID")]
        public int CuentaID { get; set; }


    }

    public class Depositos
    {
        [Column("CuentaOrigenID")]
        public int CuentaOrigenID { get; set; }

        [Column("NumeroCuentaOrigen")]
        public string NumeroCuentaOrigen { get; set; }

        [Column("NumeroCuentaDestino")]
        public string NumeroCuentaDestino { get; set; }

        [Column("FechaTraspaso")]
        public DateTime FechaTraspaso { get; set; }

        [Column("Concepto")]
        public string Concepto { get; set; }

        [Column("Monto")]
        public decimal Monto { get; set; }

        [Column("CuentaDestinoID")]
        public int CuentaDestinoID { get; set; }

        [Column("CajaID")]
        public int CajaID { get; set; }

        [Column("SucursalID")]
        public int SucursalID { get; set; }

        //CuentaID INT
        [Column("CuentaID")]
        public int CuentaID { get; set; }
    }

    public class DepositosDNI
    {
        //FechaCaptura
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
        [Column("CajaID")]
        public int CajaID { get; set; }

        [Column("CuentaID")]
        public int CuentaID { get; set; }

        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }

        [Column("Observaciones")]
        public string Observaciones { get; set; }

        [Column("FechaAfectacion")]
        public DateTime FechaAfectacion { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }
        [Column("Descripcion")]
        public string Descripcion { get; set; }
    }

    public class CobranzaCuentas
    {
        //bit ClienteFinal
        [Column("ClienteFinal")]
        public bool ClienteFinal { get; set; }

        [Column("CajaID")]
        public int CajaID { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }

        [Column("FechaAfectacion")]
        public DateTime FechaAfectacion { get; set; }

        [Column("Observaciones")]
        public string Observaciones { get; set; }

        [Column("ClienteID")]
        public int ClienteID { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("Cliente")]
        public string Cliente { get; set; }

        //CuentaID INT
        [Column("CuentaID")]
        public int CuentaID { get; set; }

        //Descripcion string
        [Column("TipoCredito")]
        public string TipoCredito { get; set; }
    }

    public class Tiendita
    {
        [Column("CreditoID")]
        public int CreditoID { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }

        [Column("ImporteTotal")]
        public decimal ImporteTotal { get; set; }

        [Column("TipoCredito")]
        public string TipoCredito { get; set; }
    }

    public class DesembolsoVales
    {
        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }

        //SaldoCapInt
        [Column("SaldoCapInt")]
        public decimal SaldoCapInt { get; set; }

        [Column("Capital")]
        public decimal Capital { get; set; }

        [Column("PeriodoID")]
        public int PeriodoID { get; set; }

        [Column("SucursalID")]
        public int SucursalID { get; set; }

        [Column("CajaID")]
        public int CajaID { get; set; }

        [Column("FechaAfectacion")]
        public DateTime FechaAfectacion { get; set; }

        [Column("Observaciones")]
        public string Observaciones { get; set; }
        //CuentaID INT
        [Column("CuentaID")]
        public int CuentaID { get; set; }
    }

    public class NuevasVentas
    {
        [Column("CreditoID")]
        public int CreditoID { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("ImporteTotal")]
        public decimal ImporteTotal { get; set; }

        [Column("Capital")]
        public decimal Capital { get; set; }
    }

    public class USV
    {
        [Column("CreditoID")]
        public int CreditoID { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }

        [Column("Seguro")]
        public decimal Seguro { get; set; }
    }

    public class Totales
    {
        [Column("TotalSaldoActual")]
        public decimal TotalSaldoActual { get; set; }
    }

    public class JoinBP
    {
        // Propiedades de Balances.Balance2
        public int BalanceID { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int PeriodoID { get; set; }
        public int BalanceTempID { get; set; }
        public decimal SaldoTotalBalance { get; set; }

        // Propiedades de Creditos.Productos
        public string Producto { get; set; }
    }

    public class BalanceDesgloseGastos2
    {

        [Column("Util")]
        public bool Util { get; set; }

        [Column("CuentaBancoID")]
        public Int64 CuentaBancoID { get; set; }

        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }

        [Column("RubroGastosID")]
        public int RubroGastosID { get; set; }

        [Column("Rubro")]
        public string Rubro { get; set; }

        [Column("FechaAfectacion")]
        public DateTime FechaAfectacion { get; set; }

        [Column("Cuenta")]
        public string Cuenta { get; set; }

        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }

        [Column("Observaciones")]
        public string Observaciones { get; set; }

        [Column("MontoAutorizado")]
        public decimal MontoAutorizado { get; set; }

        [Column("Solicitante")]
        public string Solicitante { get; set; }

        [Column("Autoriza")]
        public string Autoriza { get; set; }

        [Column("Aplica")]
        public string Aplica { get; set; }
    }

    public class BalanceDesgloseGastosTotal
    {

        [Column("RubroGastosID")]
        public int RubroGastosID { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }

        [Column("TotalRegistros")]
        public int TotalRegistros { get; set; }

        [Column("MontoTotal")]
        public decimal MontoTotal { get; set; }

    }

}
