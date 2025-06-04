using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class SaldoInicialW
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


        [Column("total")]
        public double saldoAnterior { get; set; }

    }
}
