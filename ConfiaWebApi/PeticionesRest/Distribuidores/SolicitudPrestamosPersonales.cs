using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales
{
    public class altaSolicitudPrestamo
    {
        public int ProductoID { get; set; }
        public int SucursalID { get; set; }
        public int DistribuidorID { get; set; }
        public int ContratoID { get; set; }
        public int PrestamoSolicitado { get; set; }
        public int EstatusID { get; set; }
        public int UsuarioSolicitoID { get; set; }
        public string Observaciones { get; set; }
        public int PlazoSolicitado { get; set; }
        // public object[] EmpresaId { get; internal set; }
        public int EmpresaId { get; set; }

        public int TipoDesembolso { get; set; }


    }

    public class obtenerContrato
    {
        public int DistribuidorID { get; set; }

        public int ContratoID { get; set; }

        public int LineaCredito { get; set; }
    }

    public class obtenerPlanPago
    {
        public int DistribuidorID { get; set; }

        public int ContratoID { get; set; }

        public int SolicitudPrestamoPersonalID { get; set; }

        public int CreditoID { get; set; }
    }
    public class Cancelacion
    {
        public int SolicitudPrestamoPersonalID { get; set; }

        public string MotivoCancelacion { get; set; }

    }

    public class AceptarPrestamo
    {
        public int SolicitudPrestamoPersonalID { get; set; }

       
        public long DistribuidorID { get; set; }

       
        public long ContratoID { get; set; }

       
        public int ProductoID { get; set; }

        public int? UsuarioId { get; set; }

 
        public decimal PrestamoSolicitado { get; set; }

        public int PlazoSolicitado { get; set; }

        public int? regresa { get; set; }

        public string msj { get; set; }
        public int CajaID { get; set; }
    }
    public class updatePrestamo
    {
        public int SolicitudPrestamoPersonalID { get; set; }
        public int PrestamoSolicitado { get; set; }

        public string Observaciones { get; set; }

        public int PlazoSolicitado { get; set; }

        public int Interes { get; set; }
    }

    public class PrestamoM
    {
        public int SolicitudPrestamoPersonalID { get; set; }
    }

    public class AceptarMuchos
    {
        [Required]
        public List<PrestamoM> Prestamo { get; set; }
        public int SolicitudPrestamoPersonalID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class UploadFiles
    {
        public int SolicitudPrestamoPersonalID { get; set; }
        public string ImageSrc { get; set; }
        public int DocumentoID { get; set; }
        public IFormFile doc { get; set; }
    }
    public class GetEvidencia
    {
        // public int FirmaDocID { get; set; }
        public int SolicitudPrestamoPersonalID { get; set; }
        public int DocumentoID { get; set; }
        public string ImageSrc { get; set; }
    }

    public class FiltroPrestamo
    {
        [Required]
        public int SucursalID { get; set; }
        [Required]
        public DateTime FechaInicio { get; set; }
        [Required]
        public DateTime FechaFin { get; set; }

    }

    public class FiltroPrestamoCartera
    {
        [Required]
        public DateTime FechaInicio { get; set; }
        [Required]
        public DateTime FechaFin { get; set; }
        public int? UsuarioID { get; set; }
    }
    public class SensorHuellasRequest
    {
        [Required]
        public int DistribuidorID { get; set; }
    }
    public class SensorHuellasCliente
    {
        [Required]
        public int ClienteID { get; set; }
    }
    public class SensorHuellasCurp
    {
        [Required]
        public string Curp { get; set; }
    }
}