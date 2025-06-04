using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudIncrementos
{
    public class altaSolicitudIncremento
    {
        public int ProductoID { get; set; }
        public int SucursalID { get; set; }
        public int DistribuidorID { get; set; }
        public int ContratoID { get; set; }
        public int IncrementoSolicitado { get; set; }
        public int EstatusID { get; set; }
        public int UsuarioSolicitoID { get; set; }
        public string Observaciones { get; set; }
    }


    public class UpdSolicitudAumento
    {
        public int DistribuidorID { get; set; }
    }

    public class CancelarSolicitudAumento
    {
        public int SolicitudID { get; set; }

        public string MotivoCancelacion { get; set; }


    }
    public class getContrato
    {
        public int ContratoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorID { get; set; }

    }

    public class getIncrementosProductos
    {
        public int EmpresaId { get; set; }
    }

    public class getDistribuidorNivel

    {
        public int personaID { get; set; }
    }

    public class updateIncremento
    {
        public int SolicitudID { get; set; }
        public int IncrementoSolicitado { get; set; }
    }

    public class Cancelacion
    {
        public int SolicitudID { get; set; }

        public string MotivoCancelacion { get; set; }

    }

    public class AceptarIncremento
    {
        public int SolicitudID { get; set; }

        [Range(minimum: 1, maximum: 9999999)]
        public long DistribuidorID { get; set; }

        [Range(minimum: 1, maximum: 9999999)]
        public long ContratoID { get; set; }

        [Range(minimum: 1, maximum: 9999999)]
        public int ProductoID { get; set; }

        public int? UsuarioID { get; set; }

        [Range(minimum: 1, maximum: 10000)]
        public decimal IncrementoSolicitado { get; set; }

        public int? regresa { get; set; }

        public string msj { get; set; }
    }

    public class IncrementoM
    {
        public int SolicitudID { get; set; }
    }
    public class AceptarMuchos
    {
        [Required]
        public List<IncrementoM> Incremento { get; set; }
        public int SolicitudID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class FiltroIncrementosCartera
    {
        [Required]
        public DateTime FechaInicio { get; set; }
        [Required]
        public DateTime FechaFin { get; set; }
        public int? UsuarioID { get; set; }
    }

    public class FiltroAumentoNivelCartera
    {
        [Required]
        public DateTime FechaInicio { get; set; }
        [Required]
        public DateTime FechaFin { get; set; }
        public int? UsuarioID { get; set; }
    }
}