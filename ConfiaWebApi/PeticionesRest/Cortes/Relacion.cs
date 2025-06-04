using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Cortes.Relacion
{
    public class Get
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int SucursalID { get; set; }

        public int CoordinadorID { get; set; }

        [Required]
        public List<int> Distribuidores { get; set; }

        //[Required]
        public long DistribuidorID { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(10)]
        public string fecha { get; set; }

        //public DateTime FechaCorte { get; set; }

        [Required]
        public int tipo { get; set; }
         
        [Required]
        public int formato { get; set; }

        public int DistribuidorNivelID { get; set; }

        public int DistribuidorNivelIDOrigen { get; set; }

        // public int EmpresaId { get; set; }

    }

    public class GetFecha
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalID { get; set; }
    }

    public class Recalculo
    {
        [Required]
        public string fechaCorte { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int SucursalID { get; set; }

        //[Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int DistribuidorID { get; set; }

        public bool swForzar { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }
}
