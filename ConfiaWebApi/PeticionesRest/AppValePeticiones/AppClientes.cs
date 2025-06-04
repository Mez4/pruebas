using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.AppValePeticiones.AppClientes
{
    public class AddPersona
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 99999999)]
        public int DistribuidorID { get; set; }

        public int ClienteID { get; set; }

        [Required]
        public long PersonaID { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string Nombre { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string ApellidoPaterno { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string ApellidoMaterno { get; set; }

        [Required]
        public DateTime FechaNacimiento { get; set; }

        // [Required]
        [MinLength(0)]
        [MaxLength(120)]
        public string LugarNacimiento { get; set; }

        [Required]
        [MinLength(18)]
        [MaxLength(18)]
        public string CURP { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(13)]
        public string RFC { get; set; }

        // [Required]
        [MinLength(0)]
        [MaxLength(1)]
        public string SexoID { get; set; }

        //[Required]
        //[Range(minimum: 1, maximum: 9999999)]
        public string EstadoCivilID { get; set; }

        // [Required]
        public decimal IngresosMensuales { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(16)]
        public string TelefonoMovil { get; set; }

        //[Required]
        [Range(minimum: 0, maximum: 9999999)]
        public int EscolaridadID { get; set; }

        [MinLength(0)]
        [MaxLength(250)]
        public string NombreConyuge { get; set; }

        //[Required]
        //[Range(minimum: 1, 99999)]
        public int identificacionTipoId { get; set; }

        //[Required]
        //[MinLength(10)]
        //[MaxLength(250)]
        public string identificacionNumero { get; set; }

        //[Required]
        //[MinLength(10)]
        //[MaxLength(10)]
        public string TelefonoDomicilio { get; set; }

        //[Required]
        [MaxLength(75)]
        [EmailAddress]
        public string CorreoElectronico { get; set; }

        //[Required]
        //[Range(minimum: 0, maximum: 99)]
        public int DependientesEconomicos { get; set; }

        //[Required]
        //[MinLength(0)]
        [MaxLength(128)]
        public string Observaciones { get; set; }

        [Required]
        [Range(1, 999999)]
        public int vialidadTipoId { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string NombreVialidad { get; set; }

        [Required]
        [Range(0, 999999)]
        public int orientacionVialidadTipoId { get; set; }

        // [Required]
        [MinLength(0)]
        [MaxLength(120)]
        public string NumeroExterior { get; set; }

        [MinLength(0)]
        [MaxLength(120)]
        public string NumeroInterior { get; set; }

        // [Required]
        [MinLength(0)]
        [MaxLength(120)]
        public string ReferenciasGeograficas { get; set; }

        [Required]
        [Range(1, 999999)]
        public int AsentamientoID { get; set; }

        // [Required]
        [Range(0, 999999)]
        public int viviendaTipoId { get; set; }

        [Required]
        public bool CURPValida { get; set; }

        public string FrenteIne { get; set; }

        public string ReversoIne { get; set; }

    }

    public class Get
    {
        public int ProductoID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID { get; set; }

        // [Range(minimum: 1, maximum: 99999999)]
        // [Required]
        // public long ClienteID { get; set; }

    }

    public class GetNota
    {
        [Required]
        public int PersonaID { get; set; }

        public string Nota { get; set; }

    }

    public class GetCodigoSMS
    {
        [Required]
        public int DistribuidorID { get; set; }

        public string Codigo { get; set; }

    }

    public class GetSingle
    {
        public int ProductoID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long ClienteID { get; set; }

    }

    public class GetDatosBancarios
    {
        public int ProductoID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID { get; set; }

        [Range(minimum: 0, maximum: 99999999)]
        // [Required]
        public long ClienteID { get; set; }

    }

    public class ValidaCurp
    {
        [Required]
        public string CURP { get; set; }
    }

    public class CodigoClienteNuevo
    {

        [Required]
        [Range(minimum: 1, maximum: 999999999)]
        public long PersonaID { get; set; }

        [Required]
        [MinLength(10)]
        public string Telefono { get; set; }

        [Required]
        public string src { get; set; }

    }
    public class getReciboCliente
    {
        public int ProductoID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        [Required]
        public long DistribuidorID { get; set; }

        [Range(minimum: 0, maximum: 999999999)]
        [Required]
        public long ClienteID { get; set; }
    }
}

