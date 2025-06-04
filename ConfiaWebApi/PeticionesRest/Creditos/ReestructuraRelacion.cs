using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.Creditos.ReestructuraRelacion
{
    public class getPlazos
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }
    }
    public class getAmortizacionRelacion
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        public DateTime FechaPago { get; set; }

        [Required]
        [Range(minimum: 2, maximum: 12)]
        public int Plazos { get; set; }

        [Range(minimum: 0, maximum: 1)]
        public int ValAnt { get; set; }
    }

    public class DownLoadFile
    {
        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int DistribuidorID { get; set; }
    }

    public class DownLoadFileMachote
    {
        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int DistribuidorID { get; set; }

        [Required]
        public List<int> Clientes { get; set; }
    }

    public class reestructuraRelacion
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        public String FechaPago { get; set; }

        [Required]
        [Range(minimum: 2, maximum: 12)]
        public int Plazos { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ConceptoId { get; set; }

        [Required]
        public decimal Monto { get; set; }

        [Required]
        public IFormFile doc { get; set; }
    }

    public class GetClienteSaldo
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }
    }

    public class getAmortizacionClientes
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        public DateTime FechaPago { get; set; }

        [Required]
        [Range(minimum: 2, maximum: 12)]
        public int Plazos { get; set; }

        [Required]
        public List<int> Clientes { get; set; }

        [Range(minimum: 0, maximum: 1)]
        public int ValAnt { get; set; }
    }

    public class reestructuraClientes
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }

        [Required]
        public DateTime FechaPago { get; set; }

        [Required]
        [Range(minimum: 2, maximum: 12)]
        public int Plazos { get; set; }

        //[Required]
        //public List<int> Clientes { get; set; }
        [Required]
        public String Clientes { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ConceptoId { get; set; }

        [Required]
        public decimal Monto { get; set; }

        [Required]
        public IFormFile doc { get; set; }

        [Required]
        public IFormFile doc2 { get; set; }
    }

    public class getSolicitudActual
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }
    }

    public class getDoc
    {
        [Required]
        public String DocumentoPath { get; set; }
    }

    public class getDocsByCode
    {
        [Required]
        public int SolicitudReestructuraID { get; set; }
        
        [Required]
        public int Code { get; set; }
    }

    public class subirDoc
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorId { get; set; }
        
        [Required]
        [Range(minimum: 1, maximum: 3)]
        public int identificador { get; set; }

        [Required]  
        public IFormFile doc { get; set; }
    }

    public class getSolicitudes
    {
        // [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }

    }

    public class add
    {
        [Required]
        public int SolicitudReestructuraID { get; set; }
        [Required]
        public int PersonaAnalistaID { get; set; }

    }

    public class cancelar
    {
        [Required]
        public int SolicitudReestructuraID { get; set; }

    }
    
    public class aplicar
    {
        [Required]
        public int SolicitudReestructuraID { get; set; }

    }
}
