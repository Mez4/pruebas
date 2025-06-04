using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Polizas
{
    [ExplicitColumns]
    public class FiltroPoliza
    {
        /*  [Column("regresa")]
         public int regresa { get; set; }

         [Column("msj")]
         public string msj { get; set; } */

        [Column("PolizaID")]
        public Int64 PolizaID { get; set; }


        [Column("Referencia")]
        public Int64? Referencia { get; set; }


        [Column("UsuarioID")]
        public string UsuarioID { get; set; }


        [Column("Numero")]
        public Int64? Numero { get; set; }


        [Column("Fecha")]
        public DateTime Fecha { get; set; }


        [Column("Concepto")]
        public string Concepto { get; set; }


        [Column("CatEstatusMovID")]
        public int? CatEstatusMovID { get; set; }


        [Column("TipoPolizaID")]
        public int? TipoPolizaID { get; set; }


        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }


    }
}
