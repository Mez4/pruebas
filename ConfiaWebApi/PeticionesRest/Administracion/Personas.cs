using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ConfiaWebApi.PeticionesRest.General.Personas;

namespace ConfiaWebApi.PeticionesRest.Administracion.Personas
{
    public class Get
    {
        //DistribuidorIDVR
        public string DistribuidorIDVR { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        public int? PersonaID { get; set; }

        public int? usuario_id { get; set; }

        public string Nombre { get; set; }

        public string RFC { get; set; }

        public string DistribuidorID { get; set; }

        public string CURP { get; set; }

        public string frenteIne { get; set; }
        public string reversoIne { get; set; }

        [MinLength(1)]
        [MaxLength(1)]
        public string SexoID { get; set; }

        /*     [Range(minimum: 1, maximum: 99999999)] */
        public string EstadoCivilID { get; set; }

        /* [Range(minimum: 1, maximum: 99999999)] */
        public int? EscolaridadID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        public int? OcupacionID { get; set; }

        public bool? Distribuidor { get; set; }
        public bool? Cliente { get; set; }

        public bool? Coordinador { get; set; }
        public bool? Prospecto { get; set; }
        public bool? Sac { get; set; }

        public decimal IngresosMensuales { get; set; }

        public Administracion.Personas.GetDocus VerDoc { get; set; }

    }

    public class Interactuar
    {
        [Required]
        [Range(minimum: 1, maximum: 999999999)]
        public int PersonaID { get; set; }
    }
    /// <summary>
    /// Clase basica para interactuar con una persona
    /// </summary>
    public class getSAC
    {
        [Required]
        [Range(minimum: 1, maximum: 999999999)]
        public int PersonaID { get; set; }

        public string NombreCompleto { get; set; }

        public bool? isSucursal { get; set; } = false;
    }

    /// <summary>
    /// Clase para consultar los creditos de una persona en el sistema
    /// </summary>
    public class CreditosGet
    {
        [Required]
        public int ClienteID { get; set; }

        [Required]
        public bool Recientes { get; set; } = false;
        public string EstatusID { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
    }


    public class AddCoordi
    {

        public long CoordinadorID { get; set; }
        public int SucursalID { get; set; }
        public int GrupoID { get; set; }
        public bool CarteraVencida { get; set; }
        public bool ImprimirRelacionesMasivas { get; set; }
        public char EstadoCoordinadorID { get; set; }
        public DateTime? CreacionFecha { get; set; }

          public long PersonaID { get; set; }

    }


    public class AgregarEmpleo
    {
        [Required]
        [Range(1, 99999999)]
        public long PersonaID { get; set; }

        // #######################################
        // Detalle de empleo
        // #######################################
        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string FormaEmpleo__Empresa { get; set; }
        [Required]
        public decimal IngresosMensuales { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string FormaEmpleo__Puesto { get; set; }



        public int FormaEmpleo__OcupacionID { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(10)]
        public string FormaEmpleo__Telefono { get; set; }

        [Required]
        public DateTime FormaEmpleo__FechaIngreso { get; set; }

        public DateTime? FormaEmpleo__FechaTermino { get; set; }

        [Required]
        [Range(0, 999999)]
        public Decimal FormaEmpleo__SueldoMensual { get; set; }

        // #######################################
        // Detalle de empleo - Direccion
        // #######################################
        [Required]
        [Range(1, 999999)]
        public int DireccionEmpleo_vialidadTipoId { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string DireccionEmpleo_NombreVialidad { get; set; }


        public int DireccionEmpleo_orientacionVialidadTipoId { get; set; }

        //[Required]
        [MinLength(0)]
        [MaxLength(120)]
        public string DireccionEmpleo_NumeroExterior { get; set; }

        [MinLength(0)]
        [MaxLength(120)]
        public string DireccionEmpleo_NumeroInterior { get; set; }

        // [Required]
        // [MinLength(10)]
        [MaxLength(120)]
        public string DireccionEmpleo_ReferenciaGeografica { get; set; }

        [Required]
        [Range(1, 999999)]
        public int DireccionEmpleo_AsentamientoID { get; set; }

        [Required]
        [Range(1, 999999)]
        public int DireccionEmpleo_viviendaTipoId { get; set; }
    }

    public class AgregarDireccion
    {
        [Required]
        [Range(1, 99999999)]
        public long PersonaID { get; set; }

        // #######################################
        // Detalle de dirección personal
        // #######################################
        [Required]
        [Range(1, 999999)]
        public int DireccionPersona_vialidadTipoId { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string DireccionPersona_NombreVialidad { get; set; }
        public decimal IngresosMensuales { get; set; }


        public int DireccionPersona_orientacionVialidadTipoId { get; set; }

        //[Required]
        [MinLength(0)]
        [MaxLength(120)]
        public string DireccionPersona_NumeroExterior { get; set; }

        [MinLength(0)]
        [MaxLength(120)]
        public string DireccionPersona_NumeroInterior { get; set; }

        // [Required]
        // [MinLength(10)]
        [MaxLength(120)]
        public string DireccionPersona_ReferenciaGeografica { get; set; }

        [Required]
        [Range(1, 999999)]
        public int DireccionPersona_AsentamientoID { get; set; }

        [Required]
        [Range(1, 999999)]
        public int DireccionPersona_viviendaTipoId { get; set; }
    }

    public class Editar : PeticionesRest.General.Personas.Persona
    {
        [Required]
        [Range(1, 99999999)]
        public int PersonaID { get; set; }
    }

    public class Agregar : Persona
    {
        public AgregarDireccion AgregarDireccion { get; set; }

        public AgregarEmpleo AgregarEmpleo { get; set; }

        public Int64? SucursalID { get; set; }

        public int? Prospeccion { get; set; }
    }

    public class AppAgregar : Persona
    {

        public int ProductoID { get; set; }
        public AgregarDireccion AgregarDireccion { get; set; }

        public AgregarEmpleo AgregarEmpleo { get; set; }

    }

    public class GetDoc
    {
        public int PersonasDocID { get; set; }
    }
    public class GetDocus
    {
        public Int64 PersonasDocID { get; set; }
    }
    public class CurpCheck
    {
        public string CURP { get; set; }
    }

    public class MovilCheck
    {
        public int Telefono { get; set; }
    }

    public class AgregarDireccionPersona
    {


        public int PersonaID { get; set; }

        public int DireccionPersona_AsentamientoID { get; set; }
        public string DireccionPersona_NombreVialidad { get; set; }
        public string DireccionPersona_NumeroExterior { get; set; }
        public string DireccionPersona_NumeroInterior { get; set; }
        public int DireccionPersona_vialidadTipoId { get; set; }
        public int DireccionPersona_orientacionVialidadTipoId { get; set; }
        public int DireccionPersona_ViviendaTipoId { get; set; }

        public string DireccionPersona_Telefono { get; set; }

    }
    public class AgregarEmpleoPersona
    {
        // public long PersonaID { get; set; }
        // public bool CrearProspecto { get; set; } = false;
        public int PersonaID { get; set; }
        // public int DireccionPersona_AsentamientoID { get; set; }
        // public string DireccionPersona_NombreVialidad { get; set; }
        // public string DireccionPersona_NumeroExterior { get; set; }
        // public string DireccionPersona_NumeroInterior { get; set; }
        // // public string DireccionPersona_Localidad { get; set; }
        // public int DireccionPersona_vialidadTipoId { get; set; }
        // public int DireccionPersona_orientacionVialidadTipoId { get; set; }
        // public int DireccionPersona_ViviendaTipoId { get; set; }


        // DireccionPersona_cp      

        public bool Laboral_Trabaja { get; set; }
        public string Laboral_Empresa { get; set; }
        public int Laboral_OcupacionID { get; set; }
        public string Laboral_Telefono { get; set; }
        public decimal Laboral_SueldoMensual { get; set; }
        public string Laboral_Antiguedad { get; set; }

        public int DireccionLaboral_AsentamientoID { get; set; }
        public string DireccionLaboral_NombreVialidad { get; set; }
        public string DireccionLaboral_NumeroExterior { get; set; }
        // public string DireccionLaboral_LocalidadLaboral { get; set; }
        public string DireccionLaboral_NumeroInteriorLaboral { get; set; }

        public int DireccionLaboral_vialidadTipoId { get; set; }
        public int DireccionLaboral_orientacionVialidadTipoId { get; set; }
        public int DireccionLaboral_viviendaTipoId { get; set; }

    }

    public class ActualizaContra  //: PeticionesRest.General.Personas.Persona
    {
        [Required]
        [Range(1, 99999999)]
        public int PersonaID { get; set; }

        public string Contrasena { get; set; }

    }

}
