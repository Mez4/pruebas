using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
    [ExplicitColumns]
    public class RechazaAval
    {
       [Column("regresa")]
        public int regresa { get; set; }

        
        [Column("Nota")]
        public string Nota { get; set; }

        [Column("msj")]
        public string msj { get; set; }

         [Column("AvalID")]
        public Int64 AvalID { get; set; }
      
        
    }
}
