using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.Promotor
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string creditoPromotorNombre { get; set; }

        public bool activo { get; set; } = true;

        public DateTime fhRegistro { get; set; }

        public int usuarioIdRegistro { get; set; }

    }

    public class AddPromotor
    {
        [Required]
        public int UsuarioID { get; set; }
        [Required]
        public int SucursalID { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int PromotorID { get; set; }

        public bool Activo { get; set; } = true;

        public int? UsuarioActualizaID { get; set; }

        public int SucursalID { get; set; }
    }

    public class GetPromotor
    {

        public int ProductoID { get; set; }

        public int SucursalID { get; set; }

        public Int64 creditoPromotorId { get; set; }

        public bool activo { get; set; }
    }

    public class GetSucursal
    {
        public int Id { get; set; }

        public int SucursalID { get; set; }
    }

    public class TraspasarProspecto
    {
        [Required]
        public int PromotorID { get; set; }

        [Required]
        public int PromotorDestinoID { get; set; }

        [Required]
        public List<int> Prospectos { get; set; }
    }

    public class TraspasarInteresado
    {
        [Required]
        public int PromotorID { get; set; }

        [Required]
        public int PromotorDestinoID { get; set; }

        [Required]
        public List<int> Interesados { get; set; }
    }

}
