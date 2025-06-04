using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.AsignaAnalistaProspecto
{
    public class GetAsignaAnalistaProspecto
    {
        public int regresa { get; set; }

        public string msj { get; set; }
    }

    public class GetDistribuidoresNiveles
    {
        public int DistribuidorNivelID { get; set; }

        public string DistribuidorNivel { get; set; }
    }

    public class GetDistribuidoresEstatus
    {
        public int DistribuidoresEstatusID { get; set; }

        public string DistribuidoresEstatus { get; set; }
    }

    public class GetParams 
    {
            public int SolicitudMesaCreditoID { get; set; } 
            public int AsignaAnalistaID { get; set; }
            public int enSucursal { get; set; }
            public int CatValidacionMesaID { get; set;  }
    }


}
