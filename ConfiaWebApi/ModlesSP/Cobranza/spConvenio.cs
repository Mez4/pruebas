using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Cobranza
{
    [ExplicitColumns]
    public class spConvenio
    {

        [Column("error")]
        public int error { get; set; }


        [Column("resultado")]
        public string resultado { get; set; }


        [Column("ConvenioID")]
        public long ConvenioID { get; set; }
    }
}
