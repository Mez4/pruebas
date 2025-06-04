using DBContext.DBConfia.Creditos;
using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class DistribuirPlanPagos
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("mensaje")]
        public string mensaje { get; set; }
    }
}
