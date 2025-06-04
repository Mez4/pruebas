using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.AppValePeticiones.AppDistribuidores
{
    public class Get
    {
        public int ProductoID { get; set; }

        public int EmpresaId { get; set; }

        public int ProductoPrestamoID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID { get; set; }

    }

    public class GetFolios
    {
        //[Range(minimum: 0, maximum: 99999999)]
        //[Required]
        public int ProductoID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public int SucursalID { get; set; }

        public string Folio { get; set; }

    }

    public class GetRelacion
    {
        //[Required]
        //[Range(minimum: 0, maximum: 999999)]
        public int ProductoID { get; set; }

        public int EmpresaId { get; set; }

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

    }

    public class CodigoValidarSocia
    {
        [Required]
        public int PersonaID { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(16)]
        public string Telefono { get; set; }

        [Required]
        public string src { get; set; }
    }
}
