using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class ArqueoSaldoInicial
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

        [Column("Total")]
        public decimal Total { get; set; }


    }
}
