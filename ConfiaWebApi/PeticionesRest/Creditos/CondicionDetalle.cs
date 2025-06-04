using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.CondicionDetalle
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CondicionesID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int RenglonId { get; set; }

    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CondicionesID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int DistribuidorNivelId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int DistribuidorNivelOrigenID { get; set; }

        public bool Activo { get; set; } = true;

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int PlazosMinimos { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int PlazosMaximos { get; set; }

        [Required]
        public decimal ImporteMinimo { get; set; }

        [Required]
        public decimal ImporteMaximo { get; set; }

        [Required]
        public decimal ImporteMaximo1erCanje { get; set; }

        [Required]
        public decimal ImporteMaximo2doCanje { get; set; }

        [Required]
        public decimal ImporteMaximo3erCanje { get; set; }

        [Required]
        public decimal ImporteMinimo1erCanje { get; set; }

        [Required]
        public decimal ImporteMinimo2doCanje { get; set; }

        [Required]
        public decimal ImporteMinimo3erCanje { get; set; }

        [Required]
        public decimal PorcTasaPlazo { get; set; }

        [Required]
        public decimal SeguroPlazo { get; set; }

        [Required]
        public decimal PorcIVA { get; set; }

        [Required]
        public decimal Cargo { get; set; }

        [Required]
        public decimal ManejoCuenta { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int PlazosFijos { get; set; }

        public DateTime fhRegitro { get; set; }

        public DateTime fhModificacion { get; set; }

        [Required]
        public decimal PorcTasaMensual { get; set; }

        [Required]
        public decimal PorcTasaAnual { get; set; }

        [Required]
        public decimal PagoXMilMinimo { get; set; }

        [Required]
        public decimal PagoXMilMaximo { get; set; }

        [Required]
        public decimal CapitalCorte { get; set; }

        [Required]
        public decimal PorcCreditosActivosMax { get; set; }

        [Required]
        public decimal CostoAnualTotal { get; set; }

        public bool PlazosEspeciales { get; set; } = true;

    }
    public class Update
    {

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CondicionesID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int RenglonId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int DistribuidorNivelId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int DistribuidorNivelOrigenID { get; set; }

        public bool Activo { get; set; } = true;

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int PlazosMinimos { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int PlazosMaximos { get; set; }

        [Required]
        public decimal ImporteMinimo { get; set; }

        [Required]
        public decimal ImporteMaximo { get; set; }

        [Required]
        public decimal ImporteMaximo1erCanje { get; set; }

        [Required]
        public decimal ImporteMaximo2doCanje { get; set; }

        [Required]
        public decimal ImporteMaximo3erCanje { get; set; }

        [Required]
        public decimal ImporteMinimo1erCanje { get; set; }

        [Required]
        public decimal ImporteMinimo2doCanje { get; set; }

        [Required]
        public decimal ImporteMinimo3erCanje { get; set; }

        [Required]
        public decimal PorcTasaPlazo { get; set; }

        [Required]
        public decimal SeguroPlazo { get; set; }

        [Required]
        public decimal PorcIVA { get; set; }

        [Required]
        public decimal Cargo { get; set; }

        [Required]
        public decimal ManejoCuenta { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int PlazosFijos { get; set; }

        public DateTime fhRegitro { get; set; }

        public DateTime fhModificacion { get; set; }

        [Required]
        public decimal PorcTasaMensual { get; set; }

        [Required]
        public decimal PorcTasaAnual { get; set; }

        [Required]
        public decimal PagoXMilMinimo { get; set; }

        [Required]
        public decimal PagoXMilMaximo { get; set; }

        [Required]
        public decimal CapitalCorte { get; set; }

        [Required]
        public decimal PorcCreditosActivosMax { get; set; }

        [Required]
        public decimal CostoAnualTotal { get; set; }

        public bool PlazosEspeciales { get; set; } = true;

    }
}
