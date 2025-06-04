using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.CanjeaVale
{
    public class Get
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int ProductoID { get; set; }

        public int CreditoID { get; set; }

        public int CreditoID_2 { get; set; }

    }

    public class GetPlanDePago
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int CreditoID { get; set; }

    }

    public class Articulos
    {
        internal bool name;

        public long id { get; set; }

        public int qty { get; set; }

        public decimal price { get; set; }

        public string desc { get; set; }

        public int estructura { get; set; }

        public decimal? precioOrg { get; set; }

        public string? code { get; set; }

        public decimal? descuento { get; set; }

        public decimal? descuentoOriginal { get; set; }
    }

    public class Sucursal
    {
        public int id_empresa { get; set; }
        public int id_sucursal { get; set; }
        public string id_origen { get; set; }
        public string sistema { get; set; }

    }

    public class Add
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int ProductoID { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoTiendita { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int ClienteId { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Range(minimum: 0, maximum: 99999)]/* 
        public int Monto { get; set; }

        [Range(minimum: 0, maximum: 99999)] */
        public int SucursalDistID { get; set; }

        //[Required]
        [Range(minimum: 0, maximum: 9223372036854775807)]
        public long SerieId { get; set; }



        //[Required]
        [Range(minimum: 0, maximum: 9223372036854775807)]
        public long Folio { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int Capital { get; set; }

        public decimal Compra { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int Plazos { get; set; }

        public int UsuarioId { get; set; }

        public long PersonaID { get; set; }

        //[Required]
        //[MinLength(0)]
        [MaxLength(30)]
        public string Cuenta { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        public int CuentaId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        public long? MovimientoID { get; set; }

        public List<Articulos> articles { get; set; }
        public Sucursal Sucursal { get; set; }

        public string JsonTda { get; set; }

        public long VentaId { get; set; }

        public int TipoCanje { get; set; }

        public bool PrestamoNomina { get; set; } = false;

        public long personasDatosBancariosID { get; set; }

        public DateTime? FechaExpedicion { get; set; }

        public string NombreBeneficiario { get; set; }

        public string ApellidoPaternoBeneficiario { get; set; }

        public string ApellidoMaternoBeneficiario { get; set; }

        public string ParentescoBeneficiario { get; set; }

        public DateTime FechaNacimientoBeneficiario { get; set; }

        public decimal Monto { get; set; }
        public string Json { get; set; }

        public string LetraSistema { get; set; }
        public bool Validado { get; set; }
        public int ProductoTienditaID { get; set; }
    }

    public class AddZonal
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int ProductoID { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoTiendita { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int ClienteId { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Range(minimum: 0, maximum: 99999)]/* 
        public int Monto { get; set; }

        [Range(minimum: 0, maximum: 99999)] */
        public int SucursalDistID { get; set; }

        //[Required]
        [Range(minimum: 0, maximum: 9223372036854775807)]
        public long SerieId { get; set; }



        //[Required]
        [Range(minimum: 0, maximum: 9223372036854775807)]
        public long Folio { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int Capital { get; set; }

        public decimal Compra { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int Plazos { get; set; }

        public int UsuarioId { get; set; }

        public long PersonaID { get; set; }

        //[Required]
        //[MinLength(0)]
        [MaxLength(30)]
        public string Cuenta { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        public int CuentaId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        public long? MovimientoID { get; set; }

        public List<Articulos> articles { get; set; }

        public Sucursal Sucursal { get; set; }

        public string JsonTda { get; set; }

        public long VentaId { get; set; }

        public int TipoCanje { get; set; }

        public bool PrestamoNomina { get; set; } = false;

        public long personasDatosBancariosID { get; set; }

        public DateTime? FechaExpedicion { get; set; }

        public string NombreBeneficiario { get; set; }

        public string ApellidoPaternoBeneficiario { get; set; }

        public string ApellidoMaternoBeneficiario { get; set; }

        public string ParentescoBeneficiario { get; set; }

        public DateTime FechaNacimientoBeneficiario { get; set; }

        public decimal Monto { get; set; }
        public string Json { get; set; }

        public string LetraSistema { get; set; }
        public bool Validado { get; set; }
        public int ProductoTienditaID { get; set; }
    }

    public class AddProductoTiendita
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int ClienteId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }
        public Sucursal Sucursal { get; set; }
        public int CreditoID { get; set; }
        public int UsuarioId { get; set; }
        public long PersonaID { get; set; }
        public string LetraSistema { get; set; }
        public bool Validado { get; set; }
        public List<Articulos> articles { get; set; }
        public decimal Monto { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }
        public string Json { get; set; }
        public int TipoCanje { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public int CreditoId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int ProductoID { get; set; }

        //[Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoTiendita { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ClienteId { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        //[Required]
        [Range(minimum: 0, maximum: 9223372036854775807)]
        public long SerieId { get; set; }

        //[Required]
        [Range(minimum: 0, maximum: 9223372036854775807)]
        public long Folio { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int Capital { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int Plazos { get; set; }

        public int UsuarioId { get; set; }

        public long PersonaID { get; set; }

        //[Required]
        //[MinLength(0)]
        [MaxLength(30)]
        public string Cuenta { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        public int CuentaId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        public long? MovimientoID { get; set; }

        public List<int> articles { get; set; }

        public string JsonTda { get; set; }

        public long VentaId { get; set; }

        public int TipoCanje { get; set; }

        public bool PrestamoNomina { get; set; } = false;

        public long personasDatosBancariosID { get; set; }

        public DateTime? FechaExpedicion { get; set; }

        public string NombreBeneficiario { get; set; }

        public string ParentescoBeneficiario { get; set; }

        public DateTime? FechaNacimientoBeneficiario { get; set; }
    }

    public class PDF
    {
        //[Required]
        //[Range(minimum: 1, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999999999999)]
        public int CreditoID { get; set; }

        //[Required]
        public int CreditoID_2 { get; set; }

        public bool SoloFormatoExtra { get; set; } = false;

        public bool Reimpresion { get; set; } = false;
    }

    public class ArticulosExistentes
    {
        public int id_empresa { get; set; }
        public int id_sucursal { get; set; }
        public string sucursal { get; set; }
        public int id_sku { get; set; }
        public string codigo_barras { get; set; }
        public int id_estructura { get; set; }
        public string marca { get; set; }
        public string estilo { get; set; }
        public string color { get; set; }
        public string talla { get; set; }
        public string jerarquia01 { get; set; }
        public string jerarquia02 { get; set; }
        public string jerarquia03 { get; set; }
        public string jerarquia04 { get; set; }
        public int existencia { get; set; }
        public decimal precio { get; set; }
        public string imagen { get; set; }
    }

    public class addTienditaSocia
    {
        public int ProductoID { get; set; }

        public int ProductoTienditaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ClienteId { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public decimal Capital { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int Plazos { get; set; }

        public int UsuarioId { get; set; }

        public long PersonaID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        public long? MovimientoID { get; set; }

        public List<Articulos> articles { get; set; }
        public Sucursal Sucursal { get; set; }

        public string Json { get; set; }

        public string LetraSistema { get; set; }
    }

    public class addVentaContado
    {
        public int ProductoID { get; set; }

        public int ProductoTienditaID { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public decimal Capital { get; set; }

        public int UsuarioId { get; set; }

        public long PersonaID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        public List<Articulos> articles { get; set; }
        public Sucursal Sucursal { get; set; }

        public string Json { get; set; }

        public string LetraSistema { get; set; }
    }

    public class addVentaContadoMonedero
    {
        public int ProductoID { get; set; }

        public int ProductoTienditaID { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public decimal Capital { get; set; }

        public int UsuarioId { get; set; }

        public long DistribuidorID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int CajaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        public List<Articulos> articles { get; set; }
        public Sucursal Sucursal { get; set; }

        public string Json { get; set; }

        public string LetraSistema { get; set; }
    }
}
