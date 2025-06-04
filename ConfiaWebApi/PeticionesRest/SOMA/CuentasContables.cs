using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.CuentasContables
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
        public Nullable<int> AcumulaCuentaID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string Nombre { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int TipoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int NaturalezaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int RubroID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int16 EmpresaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int CatMonedaSatID { get; set; }


        public int SucursalID { get; set; }


        [Required]
        public bool Activa { get; set; } = true;

        [Required]
        public DateTime FechaRegistro { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public Nullable<int> TipoBancoId { get; set; }
    }
    public class Update : Add
    {
        /* [Range(minimum: 0, maximum: 9999)]
        public int CuentaID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)] */
    }
}
