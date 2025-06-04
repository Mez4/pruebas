using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.InventarioUniformes
{
    public class Agregar
    {

        [Required]
        public int Producto { get; set; }

        [Required]
        [StringLength(3, MinimumLength = 3)]
        public string TipoMov { get; set; }

        [Required]
        [Range(1, 999)]
        public int NumeroPiezas { get; set; }

    }
    public class Actualizar : Agregar
    {

        [Required]
        public int CorteID { get; set; }
        public int Id { get; set; }

        public int Usuario { get; set; }

        public DateTime Fecha { get; set; }


    }
}
