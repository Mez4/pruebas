using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;

namespace ConfiaWebApi.PeticionesRest.Sistema.AccesosWebCobranza
{
    public class ActivarWebCobranza
    {
        public int UsuarioID { get; set; }
        public bool? esDirectorCobranzaWeb { get; set; }
        public bool? esSubdirectorCobranzaWeb { get; set; }
        public bool? esZonalCobranzaWeb { get; set; }
        public bool? esGerenteCobranzaWeb { get; set; }
        public bool? esCoordinadorCobranzaWeb { get; set; }
        public bool? esGestorCobranzaWeb { get; set; }
    }
}