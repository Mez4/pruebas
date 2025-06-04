using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class HeaderCorteCajaSucursal
    {


        [Column("cajaID")]
        public int cajaID { get; set; }

        [Column("fecha")]

        public string fecha { get; set; }


        [Column("sucursal")]
        public string sucursal { get; set; }

        [Column("cuenta")]
        public string cuenta { get; set; }

        [Column("nombreCaja")]
        public string nombreCaja { get; set; }

        [Column("realizaArqueo")]
        public string realizaArqueo { get; set; }

    }
}
