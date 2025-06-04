using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.SolicitudCortes
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int AgrupacionID { get; set; }

    }

    public class Agregar
    {

        [Required]
        public string Cortes { get; set; }
        public string Clave { get; set; }
        public string NumeroPiezas { get; set; }

    }


    public class Actualizar : Agregar
    {

        [Required]
        public int CorteID { get; set; }
        public int Id { get; set; }
        public int Producto { get; set; }


    }
}
