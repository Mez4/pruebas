using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.AppLogin.AppLogin
{

    public class ObtenerDatosDV
    {
        [Required]
        // [StringLength(10, MinimumLength = 10)]
        public string Telefono { get; set; }

        public string IdentificadorEmpresa { get; set; } = "1";

    }
    public class LoginAutenticacion
    {
        [Required]
        public string username { get; set; }

        [Required]
        public string password { get; set; }

    }

    public class LoginDV
    {
        [Required]
        public string telefono { get; set; }

        [Required]
        public string contrasena { get; set; }

        [Required]
        public string UUID { get; set; }
        public string IdentificadorEmpresa { get; set; } = "1";

    }


    public class CreacionUsuarioDV
    {
        [Required]
        public int DistribuidorID { get; set; }


        [Required]
        public string Password { get; set; }

        [Required]
        public string UUID { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(8)]
        public string Codigo { get; set; }

        [Required]
        [MinLength(10)]
        //[MaxLength(15)]
        public string Telefono { get; set; }
    }

    public class CambioContraPromotor
    {

        [Required]
        public int PersonaID { get; set; }

        [Required]
        public string Contrasena { get; set; }
    }

    public class CambioContraSocia
    {
        [Required]
        public int DistribuidorID { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string UUID { get; set; }

        [Required]
        public string Codigo { get; set; }
    }

    public class ValidacionDv
    {

        [Required]
        public long DistribuidorID { get; set; }


        [Required]
        public string Password { get; set; }

        [Required]
        public string UUID { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(8)]
        public string Codigo { get; set; }

        [Required]
        //  [MinLength(10)]
        //[MaxLength(15)]
        public string Telefono { get; set; }

        [Required]
        [MinLength(4)]
        [MaxLength(6)]
        public string NIP { get; set; }

    }

    public class CodigoRecuperacion
    {

        [Required]
        [Range(minimum: 1, maximum: 999999999)]
        public long PersonaID { get; set; }

        [Required]
        [MinLength(10)]
        //[MaxLength(10)]
        public string Telefono { get; set; }

        [Required]
        public string UUID { get; set; }

        [Required]
        public string src { get; set; }
    }

    public class CambioNIP
    {
        [Required]
        public int DistribuidorID { get; set; }

        [Required]
        public string NIP { get; set; }

        [Required]
        public string UUID { get; set; }

    }

}
