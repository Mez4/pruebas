using System;
using NPoco;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class AplicaPagoRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("SucursalId")]
        public int SucursalId { get; set; }

        [Column("DistribuidorId")]
        public int DistribuidorId { get; set; }

        [Column("saldoPlazo")]
        public decimal saldoPlazo { get; set; }

        [Column("PorcComision")]
        public decimal PorcComision { get; set; }

        [Column("PagoTotal")]
        public decimal PagoTotal { get; set; }

        [Column("PagoComision")]
        public decimal PagoComision { get; set; }

        [Column("Abono")]
        public decimal Abono { get; set; }

        [Column("Dif_Pago")]
        public decimal Dif_Pago { get; set; }

        [Column("MovimientoID")]
        public int MovimientoID { get; set; }

        [Column("MovimientoID_COM")]
        public int MovimientoID_COM { get; set; }

        [Column("MovimientoID_DNI")]
        public int MovimientoID_DNI { get; set; }

        [Column("sw_continuar")]
        public bool sw_continuar { get; set; }

        [Column("FechaPago")]
        public DateTime FechaPago { get; set; }

        [Column("FechaCorte")]
        public DateTime? FechaCorte { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("AbonoAcumulado")]
        public decimal AbonoAcumulado { get; set; }

        [Column("SldCredPersonal")]
        public decimal SldCredPersonal { get; set; }

        [Column("CargoAdic")]
        public decimal CargoAdic { get; set; }

        [Column("BonDia")]
        public decimal BonDia { get; set; }

        [Column("SldDia")]
        public decimal SldDia { get; set; }

        [Column("PagoMinComision")]
        public decimal PagoMinComision { get; set; }

        [Column("CodigoAut")]
        public string CodigoAut { get; set; }

        [Column("PagoPPI")]
        public decimal PagoPPI { get; set; }

        [Column("GenPPI")]
        public bool GenPPI { get; set; }

        [Column("EsPagoAtrasado")]
        public bool EsPagoAtrasado { get; set; }
    }

    public class AplicaPagosDNIRes
    {

        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("AplicacionID")]
        public string AplicacionID { get; set; }

        [Column("MovimientoID")]
        public int MovimientoID { get; set; }
    }

    public class AplicaPagosCanalesPagRes
    {
        [Column("Sucursal")]
        public string Sucursal { get; set; }

        [Column("DistribuidorID")]
        public int DistribuidorID { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }

        [Column("FechaAplicacion")]
        public DateTime FechaAplicacion { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("AplicacionID")]
        public int AplicacionID { get; set; }
    }
    public class ValidaBoletosEstelares
    {
        public string RangoAsignado { get; set; }
    }

    public class VerificaBoletosEstelares
    {
        public decimal MontoGanado { get; set; }
    }

    public class CanjeaBoletosEstelares
    {
        public string msj { get; set; }
    }

    public class UltimasAplicaciones
    {
        [Column("AplicacionID")]
        public Int64 AplicacionID { get; set; }

        [Column("Pago")]
        public decimal Pago { get; set; }

        [Column("FechaAplicacion")]
        public DateTime FechaAplicacion { get; set; }

        [Column("PersonaAplica")]
        public string PersonaAplica { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }

        [Column("SistemaOrigen")]
        public string SistemaOrigen { get; set; }

        [Column("PagoAtrasado")]
        public bool PagoAtrasado { get; set; }
    }

    public class AplicaPagoAclaracionRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("SucursalId")]
        public int SucursalId { get; set; }

        [Column("DistribuidorId")]
        public int DistribuidorId { get; set; }

        [Column("saldoPlazo")]
        public decimal saldoPlazo { get; set; }

        [Column("PorcComision")]
        public decimal PorcComision { get; set; }

        [Column("PagoTotal")]
        public decimal PagoTotal { get; set; }

        [Column("PagoComision")]
        public decimal PagoComision { get; set; }

        [Column("Abono")]
        public decimal Abono { get; set; }

        [Column("Dif_Pago")]
        public decimal Dif_Pago { get; set; }

        [Column("MovimientoID")]
        public int MovimientoID { get; set; }

        [Column("MovimientoID_COM")]
        public int MovimientoID_COM { get; set; }

        [Column("MovimientoID_DNI")]
        public int MovimientoID_DNI { get; set; }

        [Column("sw_continuar")]
        public bool sw_continuar { get; set; }

        [Column("FechaPago")]
        public DateTime FechaPago { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("AbonoAcumulado")]
        public decimal AbonoAcumulado { get; set; }

        [Column("SldCredPersonal")]
        public decimal SldCredPersonal { get; set; }

        [Column("CargoAdic")]
        public decimal CargoAdic { get; set; }

        [Column("BonDia")]
        public decimal BonDia { get; set; }

        [Column("SldDia")]
        public decimal SldDia { get; set; }

        [Column("PagoMinComision")]
        public decimal PagoMinComision { get; set; }

        [Column("CodigoAut")]
        public string CodigoAut { get; set; }

        [Column("PagoPPI")]
        public decimal PagoPPI { get; set; }

        [Column("GenPPI")]
        public bool GenPPI { get; set; }

        [Column("EsPagoAtrasado")]
        public bool EsPagoAtrasado { get; set; }

        [Column("BonificacionID")]
        public int BonificacionID { get; set; }

        [Column("FechaCorte")]
        public DateTime FechaCorte { get; set; }
    }
    
    public class AplicaPagosTicketRes
    {

        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("AplicacionID")]
        public string AplicacionID { get; set; }

        [Column("MovimientoID")]
        public int MovimientoID { get; set; }
    }
    
    public class TicketsUsuarios
    {

        [Column("UsuarioID")]
        public Int64 UsuarioID { get; set; }

        [Column("UsuarioRegistra")]
        public string UsuarioRegistra { get; set; }

        [Column("TicketsPendientes")]
        public int TicketsPendientes { get; set; }

        [Column("ImporteTickets")]
        public decimal ImporteTickets { get; set; }
    }

    public class Tickets
    {
        [Column("ID")]
        public Int64 ID { get; set; }

        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }

        [Column("Distribuidor")]
        public string Distribuidor { get; set; }

        [Column("ClienteID")]
        public string ClienteID { get; set; }

        [Column("Cliente")]
        public string Cliente { get; set; }

        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }

        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }
    }
}
