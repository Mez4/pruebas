using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Tesoreria
{
    [ExplicitColumns]
    public class PolizaDetSup
    {

        [Column("PolizaID")]
        public int PolizaID { get; set; }

        [Column("Referencia")]
        public string Referencia { get; set; }

        [Column("Concepto")]
        public string Concepto { get; set; }

        [Column("Fecha")]
        public string Fecha { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }


        [Column("DescripcionEstatus")]
        public string DescripcionEstatus { get; set; }

        [Column("DescripcionPoliza")]
        public string DescripcionPoliza { get; set; }






















    }
}
