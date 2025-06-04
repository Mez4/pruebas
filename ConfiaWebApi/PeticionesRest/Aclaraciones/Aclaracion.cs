using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.Aclaracion
{
    public class BusquedaCreditos
    {
        [Required]
        public int CreditoID { get; set; }
    }
    public class obtenerCreditos
    {
        [Required]
        public int CreditoID { get; set; }
    }
    public class BusquedaSucursal
    {
        [Required]
        public string Nombre { get; set; }
    }
    public class obtenerSucursal
    {
        [Required]
        public int SucursalID { get; set; }
    }
    public class BusquedaPersona
    {
        [Required]
        public string Nombre { get; set; }
    }
    public class obtenerPersona
    {
        [Required]
        public int PersonaID { get; set; }
    }

    public class AsignarAnalista
    {
        [Required]
        public int AclaracionID { get; set; }

        [Required]
        public int AnalistaID { get; set; }

    }
    public class LeerMensajes
    {
        [Required]
        public int AclaracionID { get; set; }
        [Required]
        public int AnalistaID { get; set; }
        [Required]
        public bool EnviadoDesdePantalla { get; set; }
    }

    public class Filtros
    {
        [Required]
        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public int TipoMovimientoID { get; set; }
    }

    public class ObtenerMensajes
    {
        [Required]
        public int AclaracionID { get; set; }
    }

    public class EnviarMensajes
    {
        [Required]
        public int AclaracionID { get; set; }

        [Required]
        public bool EnviadoDesdePantalla { get; set; }

        [Required]
        public string Mensaje { get; set; }
    }
    public class ActualizarEstatus
    {
        [Required]
        public int AclaracionID { get; set; }

        [Required]
        public int EstatusID { get; set; }
    }
    public class ActualizarAclaracion
    {
        [Required]
        public int AclaracionID { get; set; }
        //    [Required]
        public int SucursalID { get; set; }
        // [Required]
        public int DistribuidorID { get; set; }
        public int CreditoID { get; set; }
        public string DescripcionAclaracion { get; set; }
        // [Required]
        public int EstatusID { get; set; }
        public string NotasTesoreria { get; set; }
        public string Observaciones { get; set; }
        public int DocumentoID { get; set; }
        // [Required]
        public int MesaAclaracionID { get; set; }
        // [Required]
        public int BonificacionID { get; set; } //Bonificacion
        // [Required]
        public int ConceptoID { get; set; }
        // [Required]
        public int SolicitaID { get; set; }
        // [Required]
        public int AnalistaID { get; set; }
        // [Required]
        public int GerenteID { get; set; }
        public bool Asignada { get; set; }

    }
    public class AltaAclaracion
    {
        // [Required]
        public int SucursalID { get; set; }
        // [Required]
        public int DistribuidorID { get; set; }
        public int CreditoID { get; set; }
        //TipoSolicitudID
        public int TipoSolicitudID { get; set; }
        public string DescripcionAclaracion { get; set; }
        // [Required]
        public int EstatusID { get; set; }
        public string NotasTesoreria { get; set; }
        public string Observaciones { get; set; }
        public int DocumentoID { get; set; }
        // [Required]
        public int MesaAclaracionID { get; set; }
        // [Required]
        public int BonificacionID { get; set; } //Bonificacion
        // [Required]
        public int ConceptoID { get; set; }
        // [Required]
        public int SolicitaID { get; set; }
        // [Required]
        public Int64 AnalistaID { get; set; }
        // [Required]
        public int GerenteID { get; set; }
        public bool Asignada { get; set; }
        public int ProductoID { get; set; }
    }
    public class UploadFiles
    {
        public int AclaracionID { set; get; }
        public string ImageSrc { get; set; }
        public int DocumentoID { get; set; }
        public IFormFile doc { get; set; }
    }
    public class GetEvidencia
    {
        // public int FirmaDocID { get; set; }
        public int AclaracionID { set; get; }
        public int DocumentoID { get; set; }
        public string ImageSrc { get; set; }
    }
}