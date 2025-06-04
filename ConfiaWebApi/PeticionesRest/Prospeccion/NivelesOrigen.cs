using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.NivelesOrigen
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int Id { get; set; }
    }
    public class AddNivel
    {
        [Required]
        public String DistribuidorNivel { get; set; }
        [Required]
        public decimal PorcComisionBase { get; set; }
        [Required]
        public decimal CapitalColocadoMinimo { get; set; }
        [Required]
        public decimal CapitalColocadoMaximo { get; set; }
        [Required]
        public decimal ImporteProteccionSaldo { get; set; }
        [Required]
        public decimal importeMaxCanje { get; set; }
        [Required]
        public decimal maximoPrestamoPersonal { get; set; }
        [Required]
        public decimal maximoImporteCanjeCliente { get; set; }
        [Required]
        public decimal maximoImporteCanjeAval { get; set; }
        [Required]
        public bool Activo { get; set; }
    }
        public class UpdNivel
    {
        [Required]
        public int DistribuidorNivelID { get; set; }
        [Required]
        public String DistribuidorNivel { get; set; }
        [Required]
        public decimal PorcComisionBase { get; set; }
        [Required]
        public decimal CapitalColocadoMinimo { get; set; }
        [Required]
        public decimal CapitalColocadoMaximo { get; set; }
        [Required]
        public decimal ImporteProteccionSaldo { get; set; }
        [Required]
        public decimal importeMaxCanje { get; set; }
        [Required]
        public decimal maximoPrestamoPersonal { get; set; }
        [Required]
        public decimal maximoImporteCanjeCliente { get; set; }
        [Required]
        public decimal maximoImporteCanjeAval { get; set; }
        [Required]
        public bool Activo { get; set; }
    }
}
