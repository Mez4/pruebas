using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.Dispersiones
{

    public class CancelarCredito
    {
        [Required]
        public int CreditoID { set; get; }

    }

    public class UPDTiempoAD
    {
        [Required]
        public int varValue { set; get; }

    }

    public class Dispersiones
    {
        public bool EsReintento { set; get; }
        public int CreditoID { set; get; }
        public decimal Capital { set; get; }
        public int ProductoID { set; get; }
        public string CURP { set; get; }
        public string datoBancario { set; get; }
        public int BancoStpID { set; get; }
        public string NombreCompleto { set; get; }
        public int ClienteID { set; get; }
        public int? datoTipoID { set; get; }

    }

    public class GenerarDispersiones
    {

        [Required]
        public List<Dispersiones> Dispersiones { set; get; }

    }

    public class actualizaOrden
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Debe ser mayor a cero")]

        public int id { set; get; }

        [Required]
        public string empresa { set; get; }

        [Required]
        public string folioOrigen { set; get; }

        [Required]
        public string estado { set; get; }

        public string causaDevolucion { set; get; }

        [Required]
        public string tsLiquidacion { set; get; }
    }

    public class consultaDispersion
    {
        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public string CuentaOrdenante { get; set; }

        public string NombreOrdenante { get; set; }

        public string NombreBeneficiario { get; set; }

        public int? EstadoDispersionID { get; set; }

        public int? ClaveTipoCuenta { get; set; }

    }

    public class dispersionEfectivo
    {
        [Required]
        public int MovimientoID { get; set; }

        [Required]
        public int CreditoID { get; set; }
    }

    public class consultaOrdenes
    {
        [Required]
        public int TipoConsulta { get; set; }

        public DateTime? Fecha { get; set; }

    }

    public class consultaOrdenesFecha
    {
        [Required]
        public int TipoConsulta { get; set; }

        public DateTime Fecha { get; set; }

    }

    public class consultaXrastreo
    {
        [Required]
        public string claveRastreo { get; set; }

        [Required]
        public DateTime fechaOperacion { get; set; }


    }
}
