using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
  [ExplicitColumns]
    public class SolicitudesPrestamosPersonalesCheck
    {
        [Column("status")]
        public int status { get; set; }

        [Column("msg")]
        public string msg { get; set; }

        [Column("reason")]
        public string reason { get; set; }
    }       
}