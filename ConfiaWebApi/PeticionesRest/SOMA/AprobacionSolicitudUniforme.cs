using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.AprobacionSolicitudUniforme
{
    public class DetalleAprobacion
    {
        public int AprobadoDetalleID { get; set; }
        public int AprobadoID { get; set; }
        public int SolicitudDetalleID { get; set; }
        public int CorteID { get; set; }
        public int PiezasSolicitadas { get; set; }
        public int PiezasAprobadas { get; set; }

    }
    public class Agregar
    {
        public int AprobadoID { get; set; }
        public int ApruebaID { get; set; }
        public int SolicitudID { get; set; }
        public int SolicitanteID { get; set; }
        public int FechaSolicitud { get; set; }
        public int FechaAprobado { get; set; }
        public int CanceladoID { get; set; }
        public int EstatusID { get; set; }
        public string EstatusDes { get; set; }
        public int Descripcion { get; set; }
        public int ProductoID { get; set; }
        public List<DetalleAprobacion> DetalleAprobacion { set; get; }
        public List<DetalleOrden> DetalleOrden { set; get; }

    }
    
     public class DetalleOrden
    {
        public int OrdenDetalleID { get; set; }
        public int SolicitudUniformeDetalleID { get; set; }
        public int OrdenID { get; set; }
        public int PiezasSolicitadas { get; set; }
        public int PiezasAprobadas { get; set; }
        public int PiezasAutorizadas { get; set; }

    }
}



