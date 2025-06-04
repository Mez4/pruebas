using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.Balances
{
    public class MultiSaldosGet
    {
        public int TipoMultiSaldos { get; set; }
        public DateTime FechaInicio { get; set; }

    }
    public class Get
    {
        [Range(typeof(DateTime), "01/01/1900", "01/01/2100", ErrorMessage = "Fecha fuera de rango")]
        public Nullable<DateTime> FechaIni { get; set; }
        public Nullable<DateTime> FechaFin { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int BalanceID { get; set; }
        [Range(minimum: 0, maximum: 999999)]

        public int AgrupacionID { get; set; }
        [Range(minimum: 0, maximum: 999999)]

        public int SucrusalID { get; set; }
        [Range(minimum: 0, maximum: 999999)]

        public int tipoMoviID { get; set; }
        [Range(minimum: 0, maximum: 999999)]

        public int CuentaID { get; set; }



    }

    public class Balanza
    {
        [Required]
        public int BalanzaID { get; set; }

        [Required]
        public int incMovs { get; set; }

        [Required]
        public int incDetalle { get; set; }

    }

}
