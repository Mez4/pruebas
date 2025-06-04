using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.AppValePeticiones.AppCreditos
{

    public class Get
    {
        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID { get; set; }

        //[Range(minimum: 0, maximum: 99999999)]
        //[Required]
        public int ProductoID { get; set; }

    }

    public class GetDetalle
    {
        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long CreditoID { get; set; }

        public String folioPrimerCanje { get; set; }

        public int ProductoID { get; set; }
        [Required]
        public int? isCanje { get; set; } = 0;

    }


    public class Add
    {

        //[Required]
        //[Range(minimum: 1, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public long DistribuidorID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public long ClienteID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int SucursalID { get; set; }

        //[Required]
        // [Range(minimum: 0, maximum: 9223372036854775807)]
        public long SerieId { get; set; }

        public string Serie { get; set; }

        //[Required]
        [Range(minimum: 0, maximum: 9223372036854775807)]
        public long Folio { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int Capital { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Plazos { get; set; }

        public int UsuarioID { get; set; }

        public long PersonaID { get; set; }

        [Range(minimum: 0, maximum: 9223372036854775807)]
        public long personasDatosBancariosID { get; set; }

        //[Required]
        //[MinLength(0)]
        // [MaxLength(30)]
        // public string Cuenta { get; set; }

        // public int CuentaId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        public long? MovimientoID { get; set; }

        // public List<int> articles { get; set; }

        public string JsonTda { get; set; }

        public long VentaId { get; set; }

        public int TipoCanje { get; set; }

        public String latitud { get; set; } = "";

        public String longitud { get; set; } = "";
        public bool PrestamoNomina { get; set; } = false;

        public bool? RequiereDatosBancarios { get; set; } = false;

        public bool ValidacionCanje { get; set; }

    }

    public class GetDatos
    {
        public int ProductoID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public int SucursalID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public int CajaID { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(6)]
        public string Codigo { get; set; }

        public int UsuarioID { get; set; }
    }

    public class Canje
    {
        //[Range(minimum: 1, maximum: 99999999)]
        //[Required]
        public int ProductoID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public int SucursalID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public int CajaID { get; set; }

        public int UsuarioID { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(6)]
        public string Codigo { get; set; }

        // [Range(minimum: 1, maximum: 999999999999)]
        // [Required]
        // public long Folio { get; set; }

    }

    public class EnviarCodigo
    {
        [Required]
        [Range(minimum: 1, maximum: 999999999)]
        public long CanjeAppId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999999)]
        public long PersonaID { get; set; }

        [Required]
        [MinLength(10)]
        // [MaxLength(17)]
        public string Telefono { get; set; }

        [Required]
        public string src { get; set; }
    }

    public class VerificarCodigo
    {
        public int Id { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999999)]
        public long CanjeAppId { get; set; }


        public bool isPrimerCanje { get; set; } = false;

        [Required]
        [MinLength(6)]
        [MaxLength(8)]
        public string Codigo { get; set; }

        public DateTime FechaCaduca { get; set; }

        //[Required]
        //[Range(minimum: 1, maximum: 999999999)]
        public long PersonaID { get; set; }


    }

    public class PresDistApp
    {

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }

        // [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int Capital { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int Plazos { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoDesembolsoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public long personasDatosBancariosID { get; set; }

        public long VentaId { get; set; }

    }

    //CancelarOrden -> CancelarVale

    public class CancelarVale
    {

        [Required]
        [Range(minimum: 1, maximum: 99999999)]
        public int DistribuidorID { get; set; }
        [Required]
        public int CanjeAppId { get; set; }
    }

}
