using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Aclaraciones.Turnos
{
    public class ObtenerTurno
    {
        [Required]
        public decimal PorcentajeBonificacion { get; set; }
    }
    public class ActualizarTurno
    {
        [Required]
        public int IdTurnos { get; set; }

        [Required]
        public string Turno { get; set; }

        [Required]
        public string HoraEntrada { get; set; }

        [Required]
        public string HoraSalida { get; set; }

    }
    public class AltaTurno
    {
        [Required]
        public string Turno { get; set; }

        [Required]
        public string HoraEntrada { get; set; }

        [Required]
        public string HoraSalida { get; set; }


    }
}