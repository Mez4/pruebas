using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class DesembolsoFiniquitoRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("MovimientoID")]
        public string MovimientoID { get; set; }
    }
}
