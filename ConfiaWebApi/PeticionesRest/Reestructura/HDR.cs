using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.VisualBasic;
using Newtonsoft.Json;

namespace ConfiaWebApi.PeticionesRest.Reestructura.HDR
{
    public class Add
    {
        public int DistribuidorID { get; set; }
        public int accion { get; set; }
        public decimal saldoActual { get; set; }
        public decimal saldoAtrasado { get; set; }
        public int QuitaID { get; set; }
        public decimal pagoIntencion { get; set; }
        public int PlazoID { get; set; }
        public string observaciones { get; set; }
        public decimal saldoActual2 { get; set; }
        public decimal saldoAtrasado2 { get; set; }
        public int PlazoID2 { get; set; }
        public string observaciones2 { get; set; }
        public decimal saldoActual3 { get; set; }
        public decimal saldoAtrasado3 { get; set; }
        public int QuitaID3 { get; set; }
        public int PlazoID3 { get; set; }
        public string observaciones3 { get; set; }

    }


    public class PlazoSimulacion
    {

        public decimal SaldoActual { get; set; }

        public int QuitaID { get; set; }
        public int PlazoID { get; set; }
        public decimal MontoIntencion { get; set; }
        public int accion { get; set; }
        public int? DistribuidorID { get; set; }

    }

    public class EstatusSolicitud
    {

        public int SolicitudRCID { get; set; }

    }

    public class VerconvenioPP
    {

        public int DistribuidorID { get; set; }

    }

    public class Plazos
    {
        public int NoPago { get; set; }
        public DateTime FechaVencimiento { get; set; }

        public decimal Importe { get; set; }
    }

    public class Solicitud
    {
        public int? SolicitudRCID { get; set; }
        public decimal SaldoActual { get; set; }
        public decimal SaldoAtrasado { get; set; }
        public int QuitaID { get; set; }
        public decimal MontoIntencion { get; set; }
        public int PlazoID { get; set; }
        public string Motivo { get; set; }

        public int DistribuidorID { get; set; }
        public DateTime FechaRegistro { get; set; }
        public int UsuarioID { get; set; }
        public int PersononaRegistradaID { get; set; }
        public int ProductoID { get; set; }
        public int accion { get; set; }
        // Tipo
        public string TipoReestructura { get; set; }
        public string Estatus { get; set; }
        public string DNI { get; set; }
        public List<CreditosSelect> CreditosIDs { set; get; }
        public bool ClienteFinal { get; set; }

    }

    public class CreditosSelect
    {
        public int CreditoID { get; set; }
        public decimal SaldoActual { get; set; }
    }

    public class UploadFile
    {
        [Required]
        public int DocumentoID { get; set; }
        [Required]
        public bool? Autorizado { get; set; }
        [Required]
        public int DistribuidorID { get; set; }
        [Required]
        public int Accion { get; set; }
        [Required]
        public string NombreDocumento { get; set; }
        [Required]
        public string Ruta { get; set; }
        [Required]
        public int SolicitudRCID { get; set; }
        [Required]
        public string Status { get; set; }

        [Required]
        public int TipoDocumentoID { get; set; }
        [Required]
        public IFormFile file { get; set; }
    }

    public class AddHDR
    {
        public int SolicitudRCID { get; set; }
        public int DistribuidorID { get; set; }
        public int ProductoID { get; set; }
        public int Accion { get; set; }
        public decimal SaldoActual { get; set; }
        public decimal SaldoAtrasado { get; set; }
        public int QuitaID { get; set; }
        public decimal PagoIntencion { get; set; }
        public int PlazoID { get; set; }
        public string Observaciones { get; set; }
        public int UsuarioRegistraID { get; set; }
        public int PersonaRegistraID { get; set; }
        public string TipoReestructura { get; set; }
        public string Observaciones_Adicionales { get; set; }
    }

    public class HerramientaID
    {
        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class Notas
    {
        public int SolicitudRCID { get; set; }

        public int DistribuidorID { get; set; }

    }

    public class Cancelacion
    {
        public int SolicitudRCID { get; set; }
        public string ComentariosCancelacion { get; set; }
    }

    public class GetResCF
    {
        public int SolicitudRCID { get; set; }
        public int DistribuidorID { get; set; }
    }


    public class FiltroConveniosReestructurasCartera
    {
        [Required]
        public DateTime FechaInicio { get; set; }
        [Required]
        public DateTime FechaFin { get; set; }
        public int? UsuarioID { get; set; }
        public int? ProductoID { get; set; }
    }
}
