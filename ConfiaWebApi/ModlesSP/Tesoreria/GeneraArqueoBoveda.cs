using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class GeneraArqueoBoveda
    {


        [Column("MensajeID")]
        public int MensajeID { get; set; }

        [Column("Mensaje")]
        public string Mensaje { get; set; }

        [Column("ArqueoID")]
        public int ArqueoBovedaID { get; set; }

        [Column("CajaID")]
        public int CajaID { get; set; }


    }


}
