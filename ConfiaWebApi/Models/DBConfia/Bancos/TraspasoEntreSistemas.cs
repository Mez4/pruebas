using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace DBContext.DBConfia.Custom.Bancos
{
    [ExplicitColumns]
    public class spTraspaso
    {

        [Column("regresa")]
        public int regresa { get; set; }
        [Column("msj")]
        public string msj { get; set; }

        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }

    }

}
