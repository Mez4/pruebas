using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.Prospectos
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }
    }

    public class Add 
    {
       

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string nombre { get; set; }

    
        [MinLength(1)]
        [MaxLength(50)]
        public string segundoNombre { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string primerApellido { get; set; }


        [MinLength(1)]
        [MaxLength(255)]
        public string segundoApellido { get; set; }

        [Required]
        public DateTime fechaNacimiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string resultadoBuroCredito { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idPromotor { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idConsulta { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idSucursal { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string comoSeEntero { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(10)]
        public string idSexo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(18)]
        public string curp { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(18)]
        public string rfc { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string correo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string telefono { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string celular { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string idEstadoCivil { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string dependientesEconomicos { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string nombreConyuge { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string tieneAuto { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string cantidadAuto { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string marcaAuto { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string modeloAuto { get; set; }

    }

    public class Update 
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string nombre { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string segundoNombre { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string primerApellido { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string segundoApellido { get; set; }

        [Required]
        public DateTime fechaNacimiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string resultadoBuroCredito { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idPromotor { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idConsulta { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idSucursal { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string comoSeEntero { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(10)]
        public string idSexo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(18)]
        public string curp { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(18)]
        public string rfc { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string correo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string telefono { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string celular { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string idEstadoCivil { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string dependientesEconomicos { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string nombreConyuge { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string tieneAuto { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string cantidadAuto { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string marcaAuto { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string modeloAuto { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string status { get; set; }

        [Required]
        public DateTime fechaCreacion { get; set; }

    }



    public class respuesta 
    {
        public int personaid { get; set; }

        public int prospectoid { get; set; }

        public string msj { get; set; }
    }

}
