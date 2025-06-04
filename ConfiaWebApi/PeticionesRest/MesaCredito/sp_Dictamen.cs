using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.sp_Dictamen
{
    public class GetDictamen
    {
        public int regresa { get; set; }

        public string msj { get; set; }
    }
    public class GetParams
    {
        public int SolicitudMesaCreditoID { get; set; }

        public double Monto { get; set; }
    }
}
