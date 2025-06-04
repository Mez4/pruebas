using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.SolicitudUniforme
{
    public class DetalleSolicitud
    {
        public int SolicitudDetalleID { get; set; }
        public int SolicitudID { get; set; }
        public int ProductoUniformeID { get; set; }
        public int PiezasSolicitadas { get; set; }
        public int PiezasRecepcionadas { get; set; }

    }
    public class Agregar
    {
        public int SolicitudID { get; set; }
        public int SolicitanteID { get; set; }
        public int RecepcionaID { get; set; }
        public int CancelaID { get; set; }
        public DateTime FechaSolicitud { get; set; }
        public DateTime FechaRecepcion { get; set; }
        public DateTime FechaCancelacion { get; set; }
        public int EstatusID { get; set; }
        public string Descripcion { get; set; }
        public int Piezas { get; set; }
        public List<DetalleSolicitud> DetalleSolicitud { set; get; }

    }
}
