using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Bancos.CuentaCorte
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9223372036854775807)]
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int cuentaId { get; set; }

        [Required]
        public DateTime fecha { get; set; }

        public int usuarioID { get; set; }

        public string observaciones { get; set; }

        [Required]
        public decimal importeSistema { get; set; }

        [Required]
        public decimal importeFisico { get; set; }

        public decimal? diferencia { get; set; }

        public DateTime fechaCaptura { get; set; }

        public decimal? saldoInicial { get; set; }

        public bool? cancelado { get; set; } = false;

        public int? usuarioIdCancela { get; set; }

        public string comentarioCancela { get; set; }

        [Required]
        public decimal importeSistemaAnt { get; set; }

        [Required]
        public decimal importeFisicoAnt { get; set; }

        public DateTime? fechaAnt { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int corteId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int cuentaId { get; set; }

        [Required]
        public DateTime fecha { get; set; }

        public int usuarioID { get; set; }

        public string observaciones { get; set; }

        [Required]
        public decimal importeSistema { get; set; }

        [Required]
        public decimal importeFisico { get; set; }

        public decimal? diferencia { get; set; }

        public DateTime fechaCaptura { get; set; }

        public decimal? saldoInicial { get; set; }

        public bool? cancelado { get; set; } = false;

        public int? usuarioIdCancela { get; set; }

        public string comentarioCancela { get; set; }

        [Required]
        public decimal importeSistemaAnt { get; set; }

        [Required]
        public decimal importeFisicoAnt { get; set; }

        public DateTime? fechaAnt { get; set; }
    }
}
