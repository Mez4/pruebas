using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Contratos.Contratos
{
    public class Get
    {
        // Contratos de un distribuidor en especifico
        [Range(minimum: 0, maximum: 9999999)]
        public int? DistribuidorID { get; set; }

        // Contratos de un producto en especifico
        [Range(minimum: 0, maximum: 9999999)]
        public int? ProductoID { get; set; }

        // Contratos registrados por una persona en especifico
        [Range(minimum: 0, maximum: 9999999)]
        public int? PersonaIDRegistro { get; set; }

        // Contratos registrados por un usuario en especifico
        [Range(minimum: 0, maximum: 9999999)]
        public string UsuarioIDRegistro { get; set; }

        // Contratos en un rango de fechas especificos
        public System.DateTime? FechaInicio { get; set; }
        public System.DateTime? FechaFin { get; set; }
    }

    public class Increase
    {
        [Range(minimum: 1, maximum: 9999999)]
        public long DistribuidorID { get; set; }

        [Range(minimum: 1, maximum: 9999999)]
        public long ContratoID { get; set; }

        [Range(minimum: 1, maximum: 9999999)]
        public int ProductoID { get; set; }

        public int? UsuarioID { get; set; }

        [Range(minimum: 1, maximum: 10000)]
        public decimal IncrementoQuincena { get; set; }

        public int? regresa { get; set; }

        public string msj { get; set; }
    }

    public class Decrease
    {
        [Range(minimum: 1, maximum: 9999999)]
        public long DistribuidorID { get; set; }

        [Range(minimum: 1, maximum: 9999999)]
        public long ContratoID { get; set; }

        [Range(minimum: 1, maximum: 9999999)]
        public int ProductoID { get; set; }

        public int? UsuarioID { get; set; }

        [Range(minimum: 1, maximum: 300000)]
        public decimal Decremento { get; set; }

        public int? regresa { get; set; }

        public string msj { get; set; }
    }
}
