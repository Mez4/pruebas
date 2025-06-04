using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.PlanPagos
{
    public class Get
    {
        public Int64 CreditoID { get; set; }
    }

    public class ActualizarPlanPagos
    {
        public int CreditoID { get; set; }

        public string PlanPagoArray { get; set; }
    }
}
