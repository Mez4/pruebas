using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.SOMA.Rubros
{
    public class CancelarSolicitud
    {
        [Required]
        public int SolicitudGastoID { get; set; }

    }
    public class SolicitudesCaja
    {
        [Required]
        public string FechaInicial { get; set; }
        [Required]
        public string FechaFinal { get; set; }

        public string? EstatusClave { get; set; }

        [Required]
        public int SucursalCajaID { get; set; }

        public int? EstatusSolicitudID { get; set; }


    }
    public class GuardarRubro
    {
        [Required]
        public string Clave { get; set; }

        [Required]
        public string Descripcion { get; set; }

        [Required]
        public Boolean Activo { get; set; }

        [Required]
        public int RegistraID { get; set; }

        [Required]
        public Boolean AfectaUtilidad { get; set; }

        [Required]
        public Boolean GastoCorporativo { get; set; }

        [Required]
        public Boolean Cargo { get; set; }

    }

    public class ActualizarRubro : GuardarRubro
    {
        [Required]
        public int RubroGastosID { get; set; }
    }

    public class AplicarSolicitud
    {
        [Required]
        public int SolicitudGastoID { get; set; }
        public List<DetalleSolicitud> DetalleSolicitud { set; get; }

        [Required]
        public string ObservacionesTesoreria { get; set; }


    }

    public class RechazarSolicitud
    {
        [Required]
        public int SolicitudGastoID { get; set; }
        public List<DetalleSolicitud> DetalleSolicitud { set; get; }


    }
    public class AutorizarSolicitud
    {
        [Required]
        public int SolicitudGastoID { get; set; }
        public List<DetalleSolicitud> DetalleSolicitud { set; get; }

        [Required]
        public string ObservacionesTesoreria { get; set; }


    }
    public class DetalleSolicitud
    {
        [Required]
        public string Clave { set; get; }
        [Required]
        public string Descripcion { set; get; }
        [Required]
        public int SolicitudDetalleID { set; get; }
        [Required]
        public int SolicitudGastoID { set; get; }
        [Required]
        public decimal Total { set; get; }
        [Required]
        public int RubroGastosID { set; get; }
        [Required]
        public bool Aceptado { set; get; }


    }

    public class GenerarSolicitud
    {
        [Required]
        public int CajaID { set; get; }
        [Required]
        public int CuentaBancoID { set; get; }
        [Required]
        public decimal MontoSolicitado { set; get; }
        [Required]
        public string Observaciones { set; get; }
        [Required]
        public bool GeneraGastoSucursal { set; get; }
        public int SucursalID { set; get; }
        [Required]
        public bool Util { set; get; }

        public int OrigenSucursalID { set; get; }
        public List<Rubros> Rubros { set; get; }

    }

    public class ConfirmarDocumentos
    {
        [Required]
        public int SolicitudGastoID { set; get; }


    }

    public class Rubros
    {
        [Required]
        public int RubroID { set; get; }

        [Required]
        public decimal Total { set; get; }

    }

    public class ImprimirSolicitud
    {
        [Required]
        public int SolicitudGastoID { set; get; }
    }
    public class UploadFile
    {

        [Required]
        public int SolicitudGastoID { set; get; }

        [Required]
        public int SolicitudDetalleID { get; set; }

        [Required]
        public int DocumentoID { get; set; }

        [Required]
        public IFormFile doc { get; set; }
    }
    public class GetDoc
    {

        [Required]
        public int DocumentoID { get; set; }

    }
    public class update
    {

        [Required]
        public int Total { get; set; }
        public int SolicitudGastoID { get; set; }

    }
    public class UpdateTotal
    {

        public int Total { get; set; }
        public int SolicitudDetalleID { get; set; }

        public int SolicitudGastoID { get; set; }


        public int RubroGastosID { get; set; }

        public int SucursalID { get; set; }


    }
    public class UpdateProrrateo
    {

        public int Meses { get; set; }
        public int SolicitudDetalleID { get; set; }

        public int SolicitudGastoID { get; set; }


    }
}

