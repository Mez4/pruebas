using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.SOMA.SolicitudProcesoSurtido
{
    public class DetalleOrden
    {
        public int OrdenDetalleID { get; set; }
        public int SolicitudUniformeDetalleID { get; set; }
        public int OrdenID { get; set; }
        public int PiezasSolicitadas { get; set; }
        public int PiezasAprobadas { get; set; }
        public int PiezasAutorizadas { get; set; }
        public int PiezasPendientes { get; set; }
        public string FechaCompromiso { get; set; }
        public string observaciones { get; set; }

    }
    public class DetalleSurtido
    {
        public int SurtidoDetalleID { get; set; }
        public int SurtidoID { get; set; }
        public int SolicitudDetalleID { get; set; }
        public int OrdenDetalleID { get; set; }
        public int CorteID { get; set; }
        public string Corte { get; set; }
        public int PiezasAutorizadas { get; set; }
        public int PiezasSurtidas { get; set; }
        public int PiezasPendientes { get; set; }
        public string FechaCompromiso { get; set; }
        public string Observaciones { get; set; }

    }
    public class DetalleSolicitud
    {
        public int SolicitudUniformeDetalleID { get; set; }
        public int SolicitudUniformeID { get; set; }
        public int ColorID { get; set; }
        public int CorteID { get; set; }
        public int TallaID { get; set; }
        public int TipoID { get; set; }
        public int Piezas { get; set; }
        public int PiezasAprobadas { get; set; }
        public int PiezasAutorizadas { get; set; }
        public int PiezasPendientes { get; set; }
        public string FechaCompromiso { get; set; }
        public string observaciones { get; set; }
    }
    public class Agregar
    {
        public int SurtidoID { get; set; }
        public int SolicitudUniformeID { get; set; }
        public int SolicitanteID { get; set; }
        public int AutorizadoID { get; set; }
        public int CanceladoID { get; set; }
        public int Estatus { get; set; }
        public string Descripcion { get; set; }
        public int Piezas { get; set; }
        public List<DetalleSolicitud> DetalleSolicitud { set; get; }
        public int OrdenID { get; set; }
        public int EstatusID { get; set; }
        public int UsuarioID { get; set; }
        public bool ReOrden { get; set; }
        public bool Cancelada { get; set; }
        public List<DetalleOrden> DetalleOrden { set; get; }
        public List<DetalleSurtido> DetalleSurtido { set; get; }
    }
    public class UploadFile
    {
        public int SurtidoID { set; get; }
        public int DocumentoID { get; set; }

        [Required]
        public IFormFile doc { get; set; }
    }
    public class UploadFiles
    {
        public int SurtidoID { set; get; }
        public int DocumentoID { get; set; }
        public int FirmaDocID { get; set; }
        public string ImageSrc { get; set; }
        public IFormFile doc { get; set; }
    }
    public class GetDoc
    {
        public int DocumentoID { get; set; }
        public int SurtidoID { set; get; }
    }
    public class GetFirma
    {
        public int FirmaDocID { get; set; }
        public int SurtidoID { set; get; }
        public int DocumentoID { get; set; }
    }

}
