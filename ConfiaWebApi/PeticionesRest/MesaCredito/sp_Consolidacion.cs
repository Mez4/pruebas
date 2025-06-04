using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.sp_Consolidacion
{
    public class GetParams
    {
        public int SolicitudMesaCreditoID { get;set;}
       
        public int DistribuidoresEstatusID { get; set; }

        public int DistribuidorNivelID { get; set; }
     }


    public class GetConsolidacion 
    {
        public int regresa { get; set; }

        public string msj { get; set; }
    } 


}
