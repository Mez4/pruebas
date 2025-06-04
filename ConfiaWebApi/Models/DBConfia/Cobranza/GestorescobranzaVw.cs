using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.GestoresCobranza_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class GestoresCobranza_VW
    {


        [Column("GestorCobranzaID")]
        public Int64 GestorCobranzaID { get; set; }


        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }


        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }


        [Column("Activo")]
        public bool Activo { get; set; }


        [Column("UsuarioID")]
        public int UsuarioID { get; set; }


        [Column("MesaCobranzaID")]
        public int MesaCobranzaID { get; set; }


        [Column("mesaCobranza")]
        public string mesaCobranza { get; set; }


        [Column("limInferiorDias")]
        public int? limInferiorDias { get; set; }


        [Column("limSuperiorDias")]
        public int? limSuperiorDias { get; set; }


        [Column("Externo")]
        public bool? Externo { get; set; }


        [Column("ExternoDesc")]
        public string ExternoDesc { get; set; }


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
