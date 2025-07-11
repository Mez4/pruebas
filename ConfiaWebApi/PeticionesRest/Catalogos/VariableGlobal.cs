﻿using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.VariableGlobal
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }

        public string varName { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(32)]
        public string varName { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(8000)]
        public string varValue { get; set; }

        public bool usuario { get; set; } = true;
    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Id { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(32)]
        public string varName { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(8000)]
        public string varValue { get; set; }

        public bool usuario { get; set; } = true;
    }
}
