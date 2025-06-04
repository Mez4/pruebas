using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class spMultisaldosCuenta
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


        [Column("SaldoTotalCuenta")]
        public double saldoTotalCuenta { get; set; }

    }

    public class spMultisaldosCuentaV2
    {
        /*  [Column("regresa")]
         public int regresa { get; set; }

         [Column("msj")]
         public string msj { get; set; } */

        /*    [Column("idT")]
           public int idT { get; set; }


           [Column("sucursal")]
           public string sucursal { get; set; }


          
    */
        [Column("CuentaID")]
        public int CuentaID { get; set; }

        [Column("Cuenta")]
        public string Cuenta { get; set; }

        [Column("Cargos")]
        public int Cargos { get; set; }

        [Column("Abonos")]
        public int Abonos { get; set; }

        [Column("SaldoEnMovs")]
        public int SaldoEnMovs { get; set; }

        [Column("SALDOACTUAL")]
        public decimal SALDOACTUAL { get; set; }

        [Column("TOTAL")]
        public decimal TOTAL { get; set; }


    }
}
