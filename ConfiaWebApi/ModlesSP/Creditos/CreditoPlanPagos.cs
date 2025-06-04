using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Creditos
{
    public class CreditosPlanPagos : DBConfia.Creditos.Creditos_VW
    {
        [Ignore]
        public List<DBConfia.Creditos.PlanPagos> PlanPagos { get; set; }
    }
}
