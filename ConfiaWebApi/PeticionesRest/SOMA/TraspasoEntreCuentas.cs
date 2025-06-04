using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.TraspasoEntreCuentas
{
    public class cuentasMovimientosRetiro
    {
        [Required]
        public int CajaID { set; get; }

        [Required]
        public int SucursalID { set; get; }

    }

    public class cuentasMovimientosDeposito
    {
        [Required]
        public int CajaID { set; get; }

        [Required]
        public int SucursalID { set; get; }

        [Required]
        public int EmpresaID { set; get; }

    }

}
