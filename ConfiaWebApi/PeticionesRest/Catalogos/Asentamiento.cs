using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos.Asentamiento
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9223372036854775807)]
        public int AsentamientoID { get; set; }

        public int EstadoId { get; set; }

        public int MunicipioId { get; set; }

        public int TipoAsentamientoId { get; set; }

        public int CodigoPostalID { get; set; }
    }

    public class GetbyCP
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int CodigoPostal { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int CodigoPostal { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string Asentamiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string Tipo_asenta { get; set; }

        //[Required]
        //[MinLength(1)]
        [MaxLength(250)]
        public string Municipio { get; set; }

        //[Required]
        //[MinLength(1)]
        [MaxLength(250)]
        public string Estado { get; set; }

        //[Required]
        //[MinLength(1)]
        [MaxLength(250)]
        public string Ciudad { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string oficina_postal { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int? id_estado { get; set; }

        //[Required]
        //[MinLength(1)]
        [MaxLength(250)]
        public string id_oficina_postal { get; set; }

        //[Required]
        //[MinLength(1)]
        [MaxLength(5)]
        public string c_CP { get; set; } = "";

        [Required]
        [Range(minimum: 1, maximum: 255)]
        public int? id_tipo_asentamiento { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int? id_municipio { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int? id_asentamiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string zona { get; set; }

        [Range(minimum: 1, maximum: 9999)]
        public int? id_ciudad { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9223372036854775807)]
        public int AsentamientoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999)]
        public int CodigoPostal { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string Asentamiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string Tipo_asenta { get; set; }

        //[Required]
        //[MinLength(1)]
        [MaxLength(250)]
        public string Municipio { get; set; }

        //[Required]
        //[MinLength(1)]
        [MaxLength(250)]
        public string Estado { get; set; }

        //[Required]
        //[MinLength(1)]
        [MaxLength(250)]
        public string Ciudad { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string oficina_postal { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int? id_estado { get; set; }

        //[Required]
        //[MinLength(1)]
        [MaxLength(250)]
        public string id_oficina_postal { get; set; }

        //[Required]
        //[MinLength(1)]
        [MaxLength(5)]
        public string c_CP { get; set; } = "";

        [Required]
        [Range(minimum: 1, maximum: 255)]
        public int? id_tipo_asentamiento { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int? id_municipio { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int? id_asentamiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(250)]
        public string zona { get; set; }

        [Range(minimum: 1, maximum: 9999)]
        public int? id_ciudad { get; set; }
    }
}
