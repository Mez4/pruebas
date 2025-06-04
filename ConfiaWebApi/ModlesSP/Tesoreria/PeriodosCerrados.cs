using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class PeriodosCerrados
    {

        [Column("PeriodoID")]
        public int periodoID { get; set; }

        [Column("Periodo")]
        public string periodo { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }

    }
}
