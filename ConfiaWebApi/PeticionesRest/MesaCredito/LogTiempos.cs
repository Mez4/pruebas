using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.LogTiempos
{
    public class GetLogTiempos
    {

        public int regresa { get; set; }

        public string msj { get; set; }
    }

    public class GetTiemposParams 
    {
        public int SolicitudMesaCreditoID { get; set; }
    }

    public class GetTiempos
    {
            public int TiempoID { get; set; } 
            public int SolicitudMesaCreditoID { get; set; }	
            public string Motivo { get; set; }
            public DateTime Tiempo { get; set; }
    }

    public class GetParams
    {
        public int AsignaAnalistaID { get; set; }
        public DateTime Tiempo { get; set;}
        public string Motivo { get; set; }
    }

}
