using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class SaldopCajaW
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

        [Column("boveda")]
        public string boveda { get; set; }

        [Column("total")]
        public decimal total { get; set; }

        [Column("activa")]
        public bool activa { get; set; }

        [Column("numeroCuenta")]
        public string numeroCuenta { get; set; }

        [Column("fecha")]
        public DateTime fecha { get; set; }

        [Column("bovedaId")]
        public int bovedaID { get; set; }

        [Column("estado")]
        public string estado { get; set; }


        [Column("porcentaje")]
        public string porcentaje { get; set; }


        [Column("agrupacion")]
        public string agrupacion { get; set; }


        [Column("sucursal")]
        public string sucursal { get; set; }











    }
}
