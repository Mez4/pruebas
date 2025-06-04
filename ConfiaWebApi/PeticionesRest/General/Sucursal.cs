using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.General.Sucursal
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int ZonaID { get; set; }

        public int EmpresaId { get; set; }

        public long DistribuidorID { get; set; }

        public int ConvenioID { get; set; }

    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(35)]
        public string Nombre { get; set; }

        [Required]
        public long distribuidorIdMin { get; set; } = 0;


        [Required]
        public long distribuidorIdMax { get; set; } = 2147483647;


        [Required]
        public decimal importeLimiteCreditoDefault { get; set; } = 0;


        [Required]
        public Int16 tabuladorTipoID { get; set; } = 0;


        //[Required]
        //public Int16 empresaId { get; set; } = 0;


        [Required]
        public int ZonaID { get; set; } = 0;

        public int SucursalOrigenID { get; set; }


        //[Required]
        //public int ProductoID { get; set; }


        [Required]
        public int SucursalFisicaID { get; set; }


        [Required]
        public List<int> ProductosIds { get; set; }

        [Required]
        public int PersonaResponsableID { get; set; } = 0;
        [Required]
        public Boolean PermisoRangoFecha { get; set; } = false;


    }

    public class Update
    {
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalID { get; set; }


        [Required]
        [MinLength(1)]
        [MaxLength(35)]
        public string Nombre { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 2147483647)]
        public long distribuidorIdMin { get; set; } = 0;


        [Required]
        [Range(minimum: 0, maximum: 2147483647)]
        public long distribuidorIdMax { get; set; } = 2147483647;


        [Required]
        [Range(minimum: 0, maximum: 99999999.9999)]
        public decimal importeLimiteCreditoDefault { get; set; } = 0;


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int16 tabuladorTipoID { get; set; } = 0;


        //[Required]
        //[Range(minimum: 0, maximum: 9999)]
        //public Int16 empresaId { get; set; } = 0;


        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int ZonaID { get; set; } = 0;

        public int SucursalOrigenID { get; set; }

        //[Required]
        //public int ProductoID { get; set; }


        [Required]
        public int SucursalFisicaID { get; set; }


        [Required]
        public List<int> ProductosIds { get; set; }

        [Required]
        public int PersonaResponsableID { get; set; } = 0;

        [Required]
        public Boolean PermisoRangoFecha { get; set; } = false;



    }

    public class UpdateContrato
    {
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string ContratoCIE { get; set; }

    }

    public class GetView
    {
        [Range(minimum: 0, maximum: 999999)]
        public int ProductoID { get; set; }


    }

    public class GetClasificador
    {
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalID { get; set; }


    }


}
