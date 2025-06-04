using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.AplicaPagos
{
    public class Add
    {
        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int ProductoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CuentaId { get; set; }

        [Required]
        public DateTime FechaPago { get; set; }

        [Required]
        public decimal Importe { get; set; }

        public int UsuarioId { get; set; }

        [Required]
        public bool GenerarDNI { get; set; }

        [MaxLength(12)]
        public string CodigoAut { get; set; }

        public bool GenerarCOM { get; set; }

        public bool GenPPI { get; set; }

        public bool EsPagoAtrasado { get; set; }

        public int CuentaBancoID { get; set; }

        public string Observacion { get; set; }
    }

    public class Pdf
    {
        [Required]
        [Range(minimum: 1, maximum: 99999999)]
        public long MovimientoID { get; set; }

        public decimal dni { get; set; }
    }
    public class GetAplicacion
    {

        //[Range(0, 9999999999)]
        public int ProductoID { get; set; }

        [Range(0, 9999999999)]
        public int ClienteID { get; set; }

        [Range(0, 9999999999)]
        public int SucursalID { get; set; }

        [Range(0, 9999999999)]
        public int DistribuidorID { get; set; }

        public bool Activo { get; set; }

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

    }
    public class GetUltimasAplicaciones
    {

        //[Range(0, 9999999999)]
        public int ProductoID { get; set; }

        [Range(0, 9999999999)]
        public int SucursalID { get; set; }

        [Range(0, 9999999999)]
        public int DistribuidorID { get; set; }
    }

    public class GetAplicacionDNI
    {
        public int ProductoID { get; set; }

        [Range(0, 9999999999)]
        public int SucursalID { get; set; }

        [Range(0, 9999999999)]
        public int DistribuidorID { get; set; }

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public int EstatusMovimiento { get; set; }

    }

    public class GetAdministraTickets
    {
        public int ProductoID { get; set; }

        public int GestorID { get; set; }

    }

    public class GetAplicacionCanalesPago
    {
        public int ProductoID { get; set; }

        [Range(0, 9999999999)]
        public int SucursalID { get; set; }

        [Range(0, 9999999999)]
        public int DistribuidorID { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime FechaFin { get; set; }

        public int CanalPago { get; set; }

    }


    public class GetAbonos
    {
        [Required]
        [Range(1, 9999999999)]
        public int AplicacionID { get; set; }
    }

    public class Desaplica
    {
        [Required]
        [Range(minimum: 1, maximum: 99999999)]
        public long AplicacionID { get; set; }

        public int UsuarioId { get; set; }

        [Required]
        public string MotivoCancelacion { get; set; }
    }

    public class DesaplicaDNI
    {
        [Required]
        [Range(minimum: 1, maximum: 99999999)]
        public long MovimientoID { get; set; }

        public int UsuarioId { get; set; }

        [Required]
        public string MotivoCancelacion { get; set; }
    }

    public class ModificarTicket
    {
        public long MovimientoID { get; set; }

        public int UsuarioId { get; set; }
        public string MotivoCancelacion { get; set; }
        public bool Cancelacion { get; set; }
    }

    public class GetDNI
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int DistribuidorId { get; set; }

        public int TipoMovimientoID { get; set; }
    }

    public class GetClienteDNI
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int ClienteID { get; set; }

        public int TipoMovimientoID { get; set; }
    }

    public class AddDNI
    {
        //[Required]
        //[Range(minimum: 1, maximum: 999999)]
        public int ProductoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CuentaId { get; set; }

        [Required]
        public DateTime FechaPago { get; set; }

        [Required]
        public decimal Importe { get; set; }

        public int UsuarioId { get; set; }

        [Required]
        public bool GenerarDNI { get; set; }

        public bool GenerarCOM { get; set; }

        public bool EsPagoAtrasado { get; set; }

        public bool GenPPI { get; set; }

        [Required]
        public int CuentaBancoID { get; set; }

        public string Observacion { get; set; }

        public int PagoOrigen { get; set; }

        public string DnisJSON { get; set; }

        [Required]
        public List<int> MovimientoIDs { get; set; }

    }

    public class Valida
    {
        public int DistribuidorID { get; set; }

    }

    public class Verifica
    {
        public int DistribuidorID { get; set; }

        public Int64 Folio { get; set; }

    }

    public class Canjea
    {
        public int DistribuidorID { get; set; }

        public Int64 Folio { get; set; }

        public decimal Monto { get; set; }

    }

    public class AddAclaracion
    {
        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int ProductoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CuentaId { get; set; }

        [Required]
        public DateTime FechaPago { get; set; }

        [Required]
        public decimal Importe { get; set; }

        public int UsuarioId { get; set; }

        [Required]
        public bool GenerarDNI { get; set; }

        [MaxLength(12)]
        public string CodigoAut { get; set; }

        public bool GenerarCOM { get; set; }

        public bool GenPPI { get; set; }

        public bool EsPagoAtrasado { get; set; }

        public int CuentaBancoID { get; set; }
        public int BonificacionID { get; set; }

        public string Observacion { get; set; }
        public int TipoCodigoID { get; set; }
        // public DateTime FechaCorte { get; set; }
    }

    public class AddAclaracion2
    {
        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int ProductoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CuentaId { get; set; }

        [Required]
        public DateTime FechaPago { get; set; }

        [Required]
        public decimal Importe { get; set; }

        public int UsuarioId { get; set; }

        [Required]
        public bool GenerarDNI { get; set; }

        [MaxLength(12)]
        public string CodigoAut { get; set; }

        public bool GenerarCOM { get; set; }

        public bool GenPPI { get; set; }

        public bool EsPagoAtrasado { get; set; }

        public int CuentaBancoID { get; set; }
        public int BonificacionID { get; set; }

        public string Observacion { get; set; }
        public int TipoCodigoID { get; set; }
        public DateTime FechaCorte { get; set; }
    }


    public class AddTicket
    {
        //[Required]
        //[Range(minimum: 1, maximum: 999999)]
        public int ProductoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CuentaId { get; set; }

        [Required]
        public DateTime FechaPago { get; set; }

        [Required]
        public decimal Importe { get; set; }

        public int UsuarioId { get; set; }

        [Required]
        public bool GenerarDNI { get; set; }

        public bool GenerarCOM { get; set; }

        public bool EsPagoAtrasado { get; set; }

        public bool GenPPI { get; set; }

        [Required]
        public int CuentaBancoID { get; set; }

        public string Observacion { get; set; }

        public int PagoOrigen { get; set; }

        public string TicketsJSON { get; set; }

        [Required]
        public List<int> MovimientoIDs { get; set; }

    }

    public class GetTickets
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int DistribuidorId { get; set; }
    }
    
    public class GetClienteTicket
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int ClienteID { get; set; }
    }

    public class GetTicketsUsuarios
    {
        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int CajaID { get; set; }

        // [Required]
        // [Range(minimum: 0, maximum: 99999999)]
        public int UsuarioID { get; set; }
    }

    public class GetTicketsPorUsuario
    {
        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int CajaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int UsuarioID { get; set; }
    }

    public class AplicaTicketsMasivos
    {
        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int CajaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int SucursalId { get; set; }

        [Required]
        public string Observacion { get; set; }

        [Required]
        public string TicketsJSON { get; set; }

        public int UsuarioId { get; set; }
        public int ProductoId { get; set; }

        public int CuentaBancoID { get; set; }

        [Required]
        public DateTime FechaPago  { get; set; }

    }

}
