using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.Credito
{
    public class Get
    {
        public bool top { get; set; } = false;

        public int? CreditoID { get; set; }

        public string Credito { get; set; }

        [Range(0, 9999999999)]
        public int? ProductoID { get; set; }

        [Range(0, 9999999999)]
        public int? ClienteID { get; set; }

        [Range(0, 9999999999)]
        public int? SucursalID { get; set; }

        [Range(0, 9999999999)]
        public int? ZonaID { get; set; }

        [Range(0, 9999999999)]
        public int? EmpresaId { get; set; }

        [Range(0, 9999999999)]
        public int? DistribuidorID { get; set; }

        [Range(0, 9999999999)]
        public int? CoordinadorID { get; set; }

        [Range(0, 9999999999)]
        public int? ContratoID { get; set; }

        [MinLength(0)]
        [MaxLength(1)]
        public string EstatusID { get; set; }

        [Range(0, 9999999999)]
        public int? DistribuidorNivelID { get; set; }

        [Range(0, 9999999999)]
        public int? CajaID { get; set; }

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public int UsuarioID { get; set; }

        public string NombreBeneficiario { get; set; }

        public string ApellidoPaternoBeneficiario { get; set; }

        public string ApellidoMaternoBeneficiario { get; set; }

        // public string ParentescoBeneficiario { get; set; }
    }
    public class GetCreditosCliente
    {
        [Range(0, 999999999900)]
        public int? ProductoID { get; set; }

        [Range(0, 999999999900)]
        public int? ClienteID { get; set; }

        [Range(0, 999999999900)]
        public int? DistribuidorID { get; set; }

        public bool Todos { get; set; } = false;
    }

    public class GetDetallesCliente
    {
        [Range(0, 999999999900)]
        public int? ProductoID { get; set; }

        [Range(0, 999999999900)]
        public int? ClienteID { get; set; }

        [Range(0, 999999999900)]
        public int? DistribuidorID { get; set; }

        public bool Todos { get; set; } = false;
    }

    public class Cancel
    {
        public int CreditoID { get; set; }

        public string MvCancelacion { get; set; }

        public int TipoCancelacionID { get; set; }

    }
    public class CambioTipoDesembolso
    {
        public int CreditoID { get; set; }

        public int CajaID { get; set; }

    }

    public class Modificar
    {
        [Required]
        [Range(minimum: 1, maximum: 9999999999999)]
        public int CreditoID { get; set; }

        [Required]
        [Range(1, 9999999999999)]
        public int SucursalID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999999999999)]
        public int CajaID { get; set; }
    }

    public class Desembolso
    {
        [Required]
        [Range(minimum: 1, maximum: 9999999999999)]
        public int CreditoID { get; set; }

        //[Required]
        //[Range(minimum: 1, maximum: 9999999)]
        public int CajaID { get; set; }
    }

    public class GetArticulos
    {
        public string SucursalID { get; set; }

    }

    public class PDFRelacionPago
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999999999999)]
        public int CreditoID { get; set; }
        public int SucursalID { get; set; }

    }

    public class PDFFichaPagoCF
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999999999999)]
        public int CreditoID { get; set; }
        public int SucursalID { get; set; }
    }

    public class FiltroPrestamoP
    {
        public int SucursalID { get; set; }
        public int DistribuidorID { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public int EstatusID { get; set; }
    }

    public class CancelRes
    {
        public int regresa { get; set; }

        public string msj { get; set; }

    }
    public class CambioTipoDesembolsoRes
    {
        public Int64 CreditoID { get; set; }
        public string mensaje { get; set; }
        public int res { get; set; }

    }


    public class GetCreditosSpei
    {
        public Int64 SucursalID { get; set; }

        [Required]
        public DateTime FechaInicio { get; set; }

        [Required]
        public DateTime FechaFin { get; set; }

        public Int64 UsuarioID { get; set; }
    }

    public class ImpresionSpei
    {
        [Required]
        public string Creditos { get; set; }
        public Int64 UsuarioID { get; set; }
    }

    public class CrediConfiaHome
    {
        public int DistribuidorId { get; set; }
        public decimal Capital { get; set; }
        // public int Plazos { get; set; }
        // public int CreditoID { get; set; }


    }

    public class CreditosTiendita
    {
        public Int64 ContratoID { get; set; }
        public Int64 CreditoID { get; set; }
        public string EstatusID { get; set; }
        public Int64 ClienteID { get; set; }
        public int Plazos { get; set; }
        public int ProductoID { get; set; }
        public int SucursalID { get; set; }
        public string SucursalNombre { get; set; }
        public string SucursalOrigen { get; set; }
        public int SucursalOrigenID { get; set; }
        public int ZonaID { get; set; }
        public string ZonaNombre { get; set; }
        public int DistribuidorNivelID { get; set; }
        public decimal Capital { get; set; }
        public decimal Interes { get; set; }
        public decimal ManejoCuenta { get; set; }
        public decimal Cargo { get; set; }
        public decimal Seguro { get; set; }
        public decimal IVA { get; set; }
        public decimal ImporteTotal { get; set; }
        public decimal Abonos { get; set; }
        public decimal SaldoActual { get; set; }
        public int DiasAtraso { get; set; }
        public int DiasAtrasoMaximo { get; set; }
        public decimal SaldoAtrasado { get; set; }
        public DateTime FechaHoraRegistro { get; set; }
        public DateTime FechaHoraDesembolso { get; set; }
        public DateTime FechaHoraUltimoPago { get; set; }
        public Int64 ValeCanje { get; set; }
        public decimal CapitalPagado { get; set; }
        public decimal CapitalPendientes { get; set; }
        public int UsuarioIDRegistro { get; set; }
        public Int64 MovimientoID { get; set; }
        public int PagosAtrasados { get; set; }
        public int TipoDesembolsoID { get; set; }
        public string TipoDesembolso { get; set; }
        public int MotivoCancelacionID { get; set; }
        public decimal TasaInteres { get; set; }
        public decimal TasaIVA { get; set; }
        public decimal CostoSeguroPlazo { get; set; }
        public Int64 DispersionID { get; set; }
        public DateTime PrimerVencimiento { get; set; }
        public DateTime UltimoVencimiento { get; set; }
        public int PlazosAdicionales { get; set; }
        public DateTime FHGeneracionPlazosAdicionales { get; set; }
        public DateTime fechaHoraActicacion { get; set; }
        public decimal pagoModa { get; set; }
        public string Producto { get; set; }
        public bool Activo { get; set; }
        public string TasaTipoId { get; set; }
        public string TasaTipo { get; set; }
        public string Descripcion { get; set; }
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public Int64 PersonaID { get; set; }
        public string NombreCompleto { get; set; }
        public int NoCreditosActivos { get; set; }
        public string EstatusNombre { get; set; }
        public string Distribuidor { get; set; }
        public int TipoMovimientoID { get; set; }
        public Int64 VentaId { get; set; }
        public Int64 DistribuidorID { get; set; }
        public decimal Comision { get; set; }
        public Int64 SerieId { get; set; }
        public Int64 PersonaIDRegistro { get; set; }
        public string Color { get; set; }
        public int CajaID { get; set; }
        public bool PrestamoPersonal { get; set; }
        public string NombreCompletoRegistra { get; set; }
        public decimal Tiendita { get; set; }
    }
}
