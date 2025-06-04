using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.General
{

    [ExplicitColumns]
    public class ActualizaCelular
    {
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }

        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }



        [Column("regresa")]

        public int regresa { get; set; }

        [Column("mensaje")]
        public string mensaje { get; set; }



    }
}
