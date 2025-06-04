using System;
using NPoco;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBContext.DBConfia.Creditos;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class DesaplicaPagoRes : Aplicaciones_VW
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

    }
}
