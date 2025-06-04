using DBContext.DBConfia.Creditos;
using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class ContratoRes : Contratos_VW
    {
        [Column("Type")]
        public int Type { get; set; } = 1;

        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }
    }
}
