using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.Cobranza.Convenio
{

    public class Get
    {
        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID { get; set; }

        public int ProductoID { get; set; }

        // [Range(minimum: 0, maximum: 999999999999999)]
        // [Required]
        public long ConvenioID { get; set; }
    }

    public class GetDetalle
    {
        [Range(minimum: 0, maximum: 999999999999999)]
        [Required]
        public long ConvenioID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID  { get; set; }
        
        // [Range(minimum: 1, maximum: 99999999)]
        // [Required]
        public int ProductoID  { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public int SucursalID  { get; set; }
        
        [Range(minimum: 0, maximum: 100)]
        // [Required]
        public decimal PorcPagInt  { get; set; }

        [Range(minimum: 0, maximum: 100)]
        // [Required]
        public decimal PorcBon  { get; set; }
        
        [Range(minimum: 0, maximum: 99999999)]
        // [Required]
        public int Plazos  { get; set; }

        public int error { get; set; }

        public string resultado { get; set; }
    }

    public class Cancel
    {
        [Range(minimum: 1, maximum: 999999999999999)]
        [Required]
        public long ConvenioID { get; set; }        
    }

    public class Add
    {
        public int error { get; set; }

        public string resultado { get; set; }

        public long ConvenioID  { get; set; }

        public int UsuarioID  { get; set; }
        
        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID  { get; set; }
        
        // [Range(minimum: 1, maximum: 99999999)]
        // [Required]
        public int ProductoID  { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public int SucursalID  { get; set; }
        
        [Range(minimum: 0, maximum: 100)]
        [Required]
        public decimal PorcPagInt  { get; set; }

        [Range(minimum: 0, maximum: 100)]
        [Required]
        public decimal PorcBon  { get; set; }
        
        [Range(minimum: 0, maximum: 99999999)]
        [Required]
        public int Plazos  { get; set; }

    }

    public class Autorizar
    {
        public int error { get; set; }

        public string resultado { get; set; }

        public int UsuarioID  { get; set; }

        public long PersonaIDRegistro { get; set; }

        [Range(minimum: 1, maximum: 99999999999999)]
        [Required]
        public long ConvenioID  { get; set; }
        
        [Range(minimum: 1, maximum: 99999999999999)]
        [Required]
        public long DistribuidorID  { get; set; }
        
        public int ProductoID  { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public int SucursalID  { get; set; }
        
        [Range(minimum: 0, maximum: 100)]
        [Required]
        public decimal PorcPagInt  { get; set; }

        [Range(minimum: 0, maximum: 100)]
        [Required]
        public decimal PorcBon  { get; set; }
        
        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public int Plazos  { get; set; }

        [Required]
        public bool Editar  { get; set; }

    }

    public class GetPlazo
    {
        public decimal Saldo  { get; set; }

        public int DiasAtraso  { get; set; }
    }

    public class UploadFile
    {
        [Range(minimum: 1, maximum: 99999999999999)]
        [Required]
        public long ConvenioID  { get; set; }        

        // [Range(minimum: 1, maximum: 99999999999999)]
        // [Required]
        public long DistribuidorID  { get; set; }  

        public string Ruta { get; set; }

        public IFormFile doc { get; set; }

        public int regresa { get; set; }
        
        public string msj { get; set; }
    }

    public class GetPDF
    {
        [Range(minimum: 1, maximum: 99999999999999)]
        [Required]
        public long DocumentoConvenioID  { get; set; }  
    }
}
