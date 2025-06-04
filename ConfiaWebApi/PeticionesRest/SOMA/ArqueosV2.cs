using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.ArqueosV2

{

    public class CuentasEnOperacionCaja
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int CajaID { get; set; }

    }

    public class CuentasEnOperacionCajaBovedas
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int CajaID { get; set; }

    }
    public class CrearArqueos
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int CajaID { get; set; }

        [Required]
        public List<totalEfectivoCaja> totalEfectivoCaja { set; get; }

    }

    public class totalEfectivoCaja
    {
        public int CajaID { set; get; }
        public int cantidad { set; get; }
        public int catDenomEfectivoID { set; get; }

        public decimal totalXEfectivo { set; get; }

    }

    public class Denominacione
    {
        public int CatDenomEfectivoID { get; set; }
        public string Clave { get; set; }
        public string Concepto { get; set; }
        public double ValorMonetario { get; set; }
        public decimal Total { get; set; }
        public int Cantidad { get; set; }
    }

    public class ValoresCaja
    {
        public int CajaID { get; set; }
        public int CuentaBancoID { get; set; }
        public string DescCuentaBanco { get; set; }
        public string NumeroCuenta { get; set; }
        public string TipoMovimiento { get; set; }
        public List<Denominacione> Denominaciones { get; set; }
    }

    public class ArqueoV3
    {
        public List<ValoresCaja> ValoresCaja { get; set; }
        public string CajaNombre { get; set; }
        public int CajaID { get; set; }
    }


    public class ArqueoBoveda
    {
        public List<ValoresCaja> ValoresCaja { get; set; }
        public string CajaNombre { get; set; }
        public int CajaID { get; set; }
    }

}
