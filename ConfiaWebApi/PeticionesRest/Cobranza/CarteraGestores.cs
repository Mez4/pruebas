using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores
{
    public class getGestoresDistribuidores
    {
        [Range(minimum: 0, maximum: 999999)]
        public int GestorID { get; set; }
        public int ProductoID { get; set; }
    }

    public class getDistribuidoresClientes
    {
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorID { get; set; }
        public int ProductoID { get; set; }
    }

    public class getPersonas
    {
        [Range(minimum: 0, maximum: 999999)]
        public int PersonaID { get; set; }
    }

    public class getGestores
    {
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorID { get; set; }
        public int ProductoID { get; set; }
    }

    public class UploadFile
    {


        public int TicketID { get; set; }


        public DateTime FechaRegistro { get; set; }


        public bool Activo { get; set; }


        public string DistribuidorID { get; set; }

        public string GestorID { get; set; }


        public string Ruta { get; set; }

        public string Monto { get; set; }

        public string UltRelacionImporte { get; set; }

        public string FechaCorte { get; set; }

        public IFormFile doc { get; set; }

        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class GetVerTicket
    {
        public int TicketID { get; set; }
    }

    public class getGestoresinex
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }

    }

    public class getDireccionVR
    {
        [Required]
        public int PersonaID { get; set; }

    }

    public class getReferenciasVR
    {
        [Required]
        public int DistribuidorID { get; set; }

    }

    public class getListaTicket
    {
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorID { get; set; }

    }
    public class insertarPago
    {
        [Range(minimum: 0, maximum: 999999)]
        public int GestorID { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorID { get; set; }

        [Required]
        public bool OrigenVR { get; set; }

        [Required]
        public decimal Monto { get; set; }

        [Required]
        public decimal SaldoAntes { get; set; }

        public int TipoActivo { get; set; }

        public bool Mercancia { get; set; }


    }
    public class getListaTicket2
    {
        [Range(minimum: 0, maximum: 999999)]
        public int GestorID { get; set; }

    }
    public class getListaConvenios
    {
        [Range(minimum: 0, maximum: 999999)]
        public int UsuarioID { get; set; }

    }
    public class getListaTicket3
    {
        [Range(minimum: 0, maximum: 999999)]
        public int GestorID { get; set; }

        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorID { get; set; }


    }

    public class getMonto
    {
        public int DistribuidorID { get; set; }

    }

    public class CancelarTicket
    {
        public int TicketID { get; set; }

        public int Monto { get; set; }

        public int DistribuidorID { get; set; }

        public string CodigoCancelacion { get; set; }

        public int regresa { get; set; }

        public string msj { get; set; }

    }

    public class CodigoSMS
    {
        public int DistribuidorID { get; set; }
        public int TicketID { get; set; }
        public int Abono { get; set; }

    }
}
