using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Cobranza.ConsultarCobranzaAppMovil
{
    public class getfiltrosapp
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }
    public class getCredito
    {
        [Range(minimum: 0, maximum: 999999)]
        public int ContratoID { get; set; }
    }
    public class ConsultaCobranza
    {
        public int? porCobrarId { get; set; }

        public int? creditoId { get; set; }

        public int? productoId { get; set; }

        public int? sucursalId { get; set; }

        public string cobradorAsignado { get; set; }

        public string tipoCredito { get; set; }

        public string estatus { get; set; }

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public DateTime? creacionFecha { get; set; }

    }
    public class Tickets
    {

        public Int64 detalleID { get; set; }

        public Int64 porCobrarId { get; set; }

        public Int64 creditoId { get; set; }

        public int productoId { get; set; }

        public int sucursalId { get; set; }

        public string cobradorAsignado { get; set; }

        public string nombreCompleto { get; set; }

        public string celular { get; set; }

        public string domicilio { get; set; }

        public string tipoCredito { get; set; }

        public decimal montoCobrar { get; set; }

        public decimal montoAbonado { get; set; }

        public DateTime fechaUltimoPago { get; set; }

        public string estatus { get; set; }

        public bool puedeRealizarQuita { get; set; }

        public decimal quitaPorcRangoMin { get; set; }

        public decimal quitaPorcRangoMax { get; set; }

        public DateTime creacionFecha { get; set; }

        public Int64? ticketID { get; set; }


    }


    public class ConciliacionTicket
    {


        public string cobradorAsignado { get; set; }

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }
        public DateTime? creacionFecha { get; set; }
        public int conciliado { get; set; }


    }
    public class AgregarConc
    {


        public Int64 detalleID { get; set; }
        public decimal montoCobrar { get; set; }

        public decimal montoAbonado { get; set; }


        [Required]
        public List<Tickets> Tickets { set; get; }

    }
    public class Agregar
    {
        public int porCobrarId { get; set; }

        public int creditoId { get; set; }

        public int productoId { get; set; }
        public int detalleID { get; set; }

        public int sucursalId { get; set; }

        public string cobradorAsignado { get; set; }

        public string tipoCredito { get; set; }

        public string estatus { get; set; }

        public DateTime? creacionFecha { get; set; }



    }
    public class Actualizar
    {
        public int conciliado { get; set; }
    }


}
