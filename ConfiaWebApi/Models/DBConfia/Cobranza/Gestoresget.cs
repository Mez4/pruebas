using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.Gestores")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Gestores
    {


        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }


        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("Nombre")]
        public string Nombre { get; set; }


        [Column("FechaActualiza")]
        public DateTime FechaActualiza { get; set; }



        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################

        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################

    }


}
