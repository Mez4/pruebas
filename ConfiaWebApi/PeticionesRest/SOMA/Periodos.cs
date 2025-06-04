using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.Periodos
{
    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int PeriodoID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int DiasGracia { get; set; }
    }

    public class Add
    {
        [Range(minimum: 0, maximum: 99999)]
        public int PeriodoID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int NumeroPeriodo { get; set; }


        public DateTime FechaApertura { get; set; }

        public DateTime FechaCierre { get; set; }

        public DateTime FechaInicio { get; set; }


        [Range(minimum: 0, maximum: 99999)]
        public int DiasGracia { get; set; }


        public DateTime FechaFin { get; set; }


        public string Estatus { get; set; }


        public string Ejercicio { get; set; }


        public string UsuarioIDApertura { get; set; }

        public string UsuarioIDCierre { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int AgrupacionID { get; set; }
        [Range(minimum: 0, maximum: 99999)]
        public int PersonaIDCierre { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int PersonaIDApertura { get; set; }


    }

    public class Update : Add
    {

    }
}
