using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Balances.GenerarBalances1
{
    public class GenerarPDF2
    {
        public int BalanceTempID { get; set; }
        public int BalanceSeleccionado { get; set; }

        public int Accion { get; set; }

        public int BalanceIDTemp { get; set; }

        public string NombreBalance { get; set; }

        public int PeriodoID { get; set; }

        public Int64 BTemporalID	 { get; set; }

    }
    public class productoRecibido
    {
        public int periodoId { set; get; }
        public int cuentaBancoId { set; get; }
        public int productoId { set; get; }

    }

    public class cuentaRecibida
    {
        public int CtaBancoId { set; get; }


    }
    public class Add
    {
        [Required]
        public List<productoRecibido> productos_seleccionados { set; get; }
        public List<cuentaRecibida> cuentas_seleccionadas { set; get; }


        [Required]
        public int periodoId { get; set; }

        /*    [Required]
           public int ctaBancoId { get; set; } */

        /*  [Required]
         public int productoId { get; set; }

         [Required]
         public int tipoMovimiento { get; set; } */

        [Required]
        public int incMovs { get; set; }

        [Required]
        public int incDetalle { get; set; }

        [Required]
        public int esReporteCuenta { get; set; }

        [Required]
        public string nombreBalance { get; set; }
    }

    public class Update
    {


    }
}
