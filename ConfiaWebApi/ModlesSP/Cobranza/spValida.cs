using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Cobranza
{
    [ExplicitColumns]
    public class spValida
    {
        [Column("regresa")]
        public int regresa { get; set; }


        [Column("msj")]
        public string msj { get; set; }
    }
}
