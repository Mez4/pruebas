using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class FnsCorteCajaW
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

        [Column("valorMonetario")]
        public string valorMonetario { get; set; }

        [Column("fecha")]
        public string fecha { get; set; }


        [Column("cantidad")]
        public string cantidad { get; set; }

        [Column("totalXEfectivo")]
        public string totalXEfectivo { get; set; }

        [Column("sucursal")]
        public string sucursal { get; set; }

        [Column("cuenta")]
        public string cuenta { get; set; }

        [Column("nombreCaja")]
        public string nombreCaja { get; set; }

        [Column("realizaArqueo")]
        public string realizaArqueo { get; set; }

        [Column("claveDenominacion")]
        public string claveDenominacion { get; set; }

        [Column("movimiento")]
        public string movimiento { get; set; }

        [Column("nombreDenom")]
        public string nombreDenom { get; set; }










    }
}
