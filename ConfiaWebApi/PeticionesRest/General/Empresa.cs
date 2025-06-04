using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.General.Empresa
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int Id { get; set; }
    }

    public class Add
    {
        public int TipoEmpresaID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string EmpresaNombre { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(13)]
        public string EmpresaRfc { get; set; }


        [Required]
        [MinLength(1)]
        [MaxLength(128)]
        public string EmpresaDireccionFiscal { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(128)]
        public string EmpresaRegistroPatronal  { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(128)]
        public string EmpresaRazonSocial { get; set; }
        public bool EsPrestaStar { get; set; }

    }

    public class Update 
    {

        [Range(minimum: 0, maximum: 99999)]
        public int EmpresaId { get; set; }

        public int TipoEmpresaID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string EmpresaNombre { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(13)]
        public string EmpresaRfc { get; set; }


        [Required]
        [MinLength(1)]
        [MaxLength(128)]
        public string EmpresaDireccionFiscal { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(128)]
        public string EmpresaRegistroPatronal { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(128)]
        public string EmpresaRazonSocial { get; set; }

        //Indicamos si tomará el precio de la valera de PrestaStar
        public bool EsPrestaStar { get; set; }
    }

}
