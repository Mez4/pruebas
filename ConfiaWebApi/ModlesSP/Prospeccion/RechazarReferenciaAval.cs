using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
    [ExplicitColumns]
    public class RechazaReferenciaAval
    {
       [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

             [Column("ReferenciaID")]
        public Int64 ReferenciaID { get; set; }
      
        
    }
}
