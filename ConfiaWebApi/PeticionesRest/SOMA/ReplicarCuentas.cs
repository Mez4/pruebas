using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.ReplicarCuentas
{
    public class GuardarCuenta
    {
        [Required]
        public int CuentaBancoID { get; set; }

        [Required]
        public string NumeroCuenta { get; set; }

        [Required]
        public string Descripcion { get; set; }

        [Required]
        public int ProductoID { get; set; }

        [Required]
        public int SucursalID { get; set; }



    }

    public class EstadoCuentaPDF
    {
        [Required]
        public int CuentaBancoID { get; set; }
    }
    public class Cancel
    {
        public int? Id { get; set; }

        public string MvCancelacion { get; set; }

    }

    public class CancelRes
    {
        public int regresa { get; set; }

        public string msj { get; set; }

    }

}
