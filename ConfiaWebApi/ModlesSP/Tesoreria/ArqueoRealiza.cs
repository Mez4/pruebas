using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class ArqueoRealiza
    {
        /*  [Column("regresa")]
         public int regresa { get; set; }

         [Column("msj")]
         public string msj { get; set; } */

        /*    [Column("idT")]
           public int idT { get; set; }


           [Column("sucursal")]
           public string sucursal { get; set; }


           [Column("bovedaId")]
           public int bovedaId { get; set; }
    */

        [Column("Sucursal")]
        public string Sucursal { get; set; }

        [Column("NombreCaja")]
        public string NombreCaja { get; set; }


        [Column("Fecha")]
        public string Fecha { get; set; }

        [Column("Realiza")]
        public string Realiza { get; set; }


    }
}
