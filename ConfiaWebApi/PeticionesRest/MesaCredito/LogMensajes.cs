using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.LogMensajes
{
    public class GetLogMensajes
    {
        public int regresa { get; set; }

        public string msj { get; set; }
    }

    public class GetParams
    {

        public int SolicitudMesaCreditoID { get; set; }
        public string mensaje { get; set; }
     
    }

    public class  GetMensajeParams
    {
        public int SolicitudMesaCreditoID { get; set; }
    }


    public class GetMensajes 
    {

        public int MensajeID { get; set; }
        public string mensaje { get; set; }
        public DateTime fecha_hora { get; set; }

    }


}
