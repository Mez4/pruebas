using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Tesoreria.CuentasContables
{
    public class Get 
    {
        [Range(minimum: 0, maximum: 9999)]
        public int CuentaID { get; set; }
    }
    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string Cuenta { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int AcumulaCuentaID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string Nombre { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int TipoID { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int NaturalezaID { get; set; }
        
        [Range(minimum: 0, maximum: 9999)]
        public int RubroID { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public Int16 EmpresaID { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int CatMonedaSatID { get; set; }

        public bool Activa { get; set; } = true;

        [Required]
        public DateTime FechaRegistro { get; set; }
    }
    public class Update 
    {
        [Range(minimum: 0, maximum: 9999)]
        public int CuentaID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string Cuenta { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int AcumulaCuentaID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string Nombre { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int TipoID { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int NaturalezaID { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int RubroID { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public Int16 EmpresaID { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int CatMonedaSatID { get; set; }

        public bool Activa { get; set; } = true;

        [Required]
        public DateTime FechaRegistro { get; set; }
    }
}
