using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Tesoreria.Referencias
{
    public class Convenio
    {
        public int ConvenioID { get; set; }

        public string NombreConvenio { get; set; }

        public string CodigoConvenio { get; set; }

        public int ProductoID { get; set; }

        public string Usuario { get; set; }
        public string Contrasena { get; set; }
    }

    public class Referencias
    {
        public int ReferenciaID { get; set; }

        public string Referencia { get; set; }

        public int PersonaID { get; set; }
    }

    public class Persona
    {
        public long PersonaID { get; set; }


    }
}
