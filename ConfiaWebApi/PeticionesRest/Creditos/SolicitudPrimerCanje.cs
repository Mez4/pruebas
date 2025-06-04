using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.SolicitudPrimerCanje
{
    public class Get
    {
        public Int64 DistribuidorID { get; set; }
        public int ProductoID { get; set; }
    }

    public class GetIne
    {
        public Int64 ClienteID { get; set; }
    }
    public class SpSolicitudPrimerCanje
    {
        public Int64 DistribuidorID { get; set; }
        public Int64 SolicitudCreditoID { get; set; }
        public DateTime fhRegistro { get; set; }
        public bool cancelado { get; set; }
        public DateTime fhCancelacion { get; set; }
        public Int64 valeraDetalleId { get; set; }
        public string nombreCliente { get; set; }
        public decimal importe { get; set; }
        public int plazos { get; set; }
        public string codigoVale { get; set; }
        public Int64 canjeId { get; set; }
        public Int64 CreditoID { get; set; }
        public string folio { get; set; }
        public string telefono { get; set; }
        public string NombreDV { get; set; }
        public Int64 ClienteID { get; set; }

        public string NombreSucursal { get; set; }
        public string Status { get; set; }

    }
    public class Aceptar
    {
        public Int64 SolicitudPrimerCanjeID { get; set; }
    }

    public class Rechazar
    {
        public Int64 SolicitudPrimerCanjeID { get; set; }
    }

    //Para Prestamo Personal 
    public class AceptarPrestamoPersonal
    {
        public int regresa { get; set; }

        public string msj { get; set; }

        public int CreditoId { get; set; }

        public long MovimientoID { get; set; }

        public int CajaId { get; set; }

        public int ClienteId { get; set; }

        public int TipoDesembolsoID { get; set; }

        public long PersonaID { get; set; }
    }
}