using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.AppCobranzaPeticiones.AppCobranza
{
    public class DatosDV
    {
        [Required]

        public int telefono { get; set; }

    }

    public class CarteraGestor
    {
        [Required]
        public int GestorID { get; set; }

    }

    public class MontoDV
    {
        [Required]
        public int DistribuidorID { get; set; }
    }

    public class InfoGestor
    {
        [Required]
        public int GestorID { get; set; }
    }

    public class ObtenerDireccion
    {
        [Required]
        public int PersonaID { get; set; }
    }

}
