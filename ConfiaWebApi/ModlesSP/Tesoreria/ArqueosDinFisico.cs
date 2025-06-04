using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class ArqueosDinFisico
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

        [Column("Clave")]
        public string Clave { get; set; }

        [Column("Concepto")]
        public string Concepto { get; set; }


        [Column("Cantidad")]
        public string Cantidad { get; set; }

        [Column("ValorMonetario")]
        public string ValorMonetario { get; set; }

        [Column("Total")]
        public string Total { get; set; }

        //CuentaBancoID
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }


    }
}
