using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.Bovedas
{
    public class CuentaBancoRecibida
    {
        public int cuentaBancoID { set; get; }

    }



    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int BovedaID { get; set; }

    }

    public class Agregar
    {

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(8)]
        [MinLength(1)]
        public string Clave { get; set; }



        [Required]
        public bool Activa { get; set; }

        [Required]
        [Range(1, 999999)]
        public int CuentaID { get; set; }

        [Required]
        [Range(1, 999999)]
        public int PersonaID { get; set; }


    }

    public class Actualizar : Agregar
    {

        public int SucursalID { get; set; }

        public List<CuentaBancoRecibida> cuentasBanco { set; get; }
        public List<CuentaBancoRecibida> cuentaBanco { set; get; }



    }
}
