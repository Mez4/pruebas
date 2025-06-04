using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Cobranza
{
    [ExplicitColumns]
    public class spActualizarTabDiasMora
    {

        [Column("idTabMora")]
        public int idTabMora { get; set; }

        [Column("limInferiorDias")]
        public int limInferiorDias { get; set; }

        [Column("limSuperiorDias")]
        public int limSuperiorDias { get; set; }

        [Column("diasMoraCartera")]
        public int diasMoraCartera { get; set; }

        [Column("Activo")]
        public bool Activo { get; set; }

        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }


    }
}
