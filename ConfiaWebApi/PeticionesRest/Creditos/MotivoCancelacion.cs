using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Creditos.MotivoCancelacion
{
    public class Get
    {
        [Range(minimum: 0, maximum: 255)]
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string MotivoCancelacion { get; set; }

        public bool genMovBanco { get; set; } = false;

    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 255)]
        public int MotivoCancelacionID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string MotivoCancelacion { get; set; }

        public bool genMovBanco { get; set; } = false;

    }
}
