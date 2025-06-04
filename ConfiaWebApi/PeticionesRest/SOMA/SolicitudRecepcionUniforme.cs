using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.SOMA.SolicitudRecepcionUniforme
{
    public class DetalleRecepcion
    {
        public int ProductoUniformeID { get; set; }
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
        //PiezasSurtidas
        public int PiezasSurtidas { get; set; }
        //PiezasRecepcionadas
        public int PiezasRecepcionadas { get; set; }
        public string FechaCompromiso { get; set; }
        public string observaciones { get; set; }
    }

    public class Actualizar : Agregar
    {
        public int RecibeID { get; set; }
        public string FechaRecepcion { get; set; }


    }
    public class Agregar
    {
        public int RecepcionID { get; set; }

        public int SolicitudID { get; set; }
        public int SurteID { get; set; }
        public int CancelaID { get; set; }
        public int DevuelveID { get; set; }
        public string FechaSurtido { get; set; }

        public string FechaCancelacion { get; set; }
        public string FechaDevolucion { get; set; }
        public int EstatusID { get; set; }
        public string Descripcion { get; set; }
        public int Cancelada { get; set; }
        public int RecepcionParcial { get; set; }
        public int Devolucion { get; set; }
        public int OrdenID { get; set; }
        public int ReOrdenID { get; set; }
        public int SurtidoID { get; set; }
        public int DevolucionID { get; set; }
        public string ComprobanteDoc { get; set; }
        public int DocumentoID { get; set; }
        public string ComprobanteFirma { get; set; }
        public int FirmaDocID { get; set; }
        public int ProductoID { get; set; }
        public string Pendientes { get; set; }
        public List<DetalleRecepcion> DetalleRecepcion { set; get; }
    }
    public class UploadFile
    {
        public int RecepcionID { set; get; }
        public int DocumentoID { get; set; }

        [Required]
        public IFormFile doc { get; set; }
    }
    public class UploadFiles
    {
        public int RecepcionID { set; get; }
        public int DocumentoID { get; set; }
        public int FirmaDocID { get; set; }
        public string ImageSrc { get; set; }
        public IFormFile doc { get; set; }
    }
    public class GetDoc
    {
        public int DocumentoID { get; set; }
        public int RecepcionID { set; get; }
    }
    public class GetFirma
    {
        public int FirmaDocID { get; set; }
        public int RecepcionID { set; get; }
        public int DocumentoID { get; set; }
    }

}
