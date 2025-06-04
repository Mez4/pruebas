using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Bancos.Dispersion
{
    public class Get
    {
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int CuentaID { get; set; }

        public DateTime FHRegistro { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int ConsecutivoDia { get; set; }

        public decimal? ImporteTotal { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int CantidadMovimientos { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int UsuarioID { get; set; }

        public bool Cancelacion { get; set; } = false;

        [Required]
        [Range(minimum: 1, maximum: 255)]
        public int DispersionEstatusID { get; set; }

    }

    public class Update
    {
        [Required]
        public int DispersionID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int CuentaID { get; set; }

        public DateTime FHRegistro { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int ConsecutivoDia { get; set; }

        public decimal? ImporteTotal { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int CantidadMovimientos { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int UsuarioID { get; set; }

        public bool Cancelacion { get; set; } = false;

        [Required]
        [Range(minimum: 1, maximum: 255)]
        public int DispersionEstatusID { get; set; }

    }
}
