using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace ConfiaWebApi.PeticionesRest.Distribuidores.Distribuidor
{

    public class QRGet{
        public int ProductoID { get; set; }

        public long DistribuidorID { get; set; }
    }
    public class Get
    {
        //[Range(minimum: 0, maximum: 99999)]
        public int Id { get; set; }

        //[Range(minimum: 1, maximum: 99999)]
        public int SucursalID { get; set; }

        public int CoordinadorID { get; set; }

        public int SerieId { get; set; }

        public int Folio { get; set; }

        public int GrupoID { get; set; }

        public string fechaCorte { get; set; }

        public int UsuarioID { get; set; }

        public int ProductoID { get; set; }

        public int DistribuidorID { get; set; }

        public int DistribuidorNivelID { get; set; }

        public int ZonaID { get; set; }

        public int DiasAtraso { get; set; }
    }

    public class ValidaAtraso
    {
        public int DistribuidorID { get; set; }
    }

    public class CancelarTemp
    {
        public int Id { get; set; }
        public string DistribuidoresEstatusID { get; set; }
    }
    public class CancelarPermanente
    {
        public int Id { get; set; }
        public string DistribuidoresEstatusID { get; set; }
    }

    public class AceptarSolicitud
    {
        public int DistribuidorID { get; set; }


        public int SolicitudID { get; set; }


    }


    public class CancelarSolicitud
    {
        public int SolicitudID { get; set; }

    }
    public class Agregar
    {
        // public long PersonaID { get; set; }
        // public bool CrearProspecto { get; set; } = false;

        public int DireccionPersona_AsentamientoID { get; set; }
        public string DireccionPersona_NombreVialidad { get; set; }
        public string DireccionPersona_NumeroExterior { get; set; }
        public string DireccionPersona_NumeroInterior { get; set; }
        // public string DireccionPersona_Localidad { get; set; }
        public int DireccionPersona_vialidadTipoId { get; set; }
        public int DireccionPersona_orientacionVialidadTipoId { get; set; }
        public int DireccionPersona_ViviendaTipoId { get; set; }


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
        public string DireccionLaboral_LocalidadLaboral { get; set; }
        public string DireccionLaboral_NumeroInteriorLaboral { get; set; }

        public int DireccionLaboral_vialidadTipoId { get; set; }
        public int DireccionLaboral_orientacionVialidadTipoId { get; set; }
        public int DireccionLaboral_viviendaTipoId { get; set; }



    }
    public class AddAval
    {
        //   [Required]
        // [MinLength(1)]
        // [MaxLength(1)]
        public int DistribuidorID { get; set; }

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

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string LugarNacimiento { get; set; }

        [Required]
        [MinLength(18)]
        [MaxLength(18)]
        public string CURP { get; set; }

        [Required]
        [MinLength(12)]
        [MaxLength(13)]
        public string RFC { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string SexoID { get; set; }

        [Required]
        //[Range(minimum: 1, maximum: 9999999)]
        public string EstadoCivilID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public int EscolaridadID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99)]
        public int DependientesEconomicos { get; set; }

        // [Required]
        // [MinLength(0)]
        // [MaxLength(10)]
        public string TelefonoDomicilio { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(10)]
        public string TelefonoMovil { get; set; }

        [Required]
        [MaxLength(120)]
        [EmailAddress]
        public string CorreoElectronico { get; set; }

        [MinLength(0)]
        [MaxLength(250)]
        public string NombreConyuge { get; set; }

        [Required]
        [MinLength(0)]
        [MaxLength(250)]
        public string Observaciones { get; set; }

        [Required]
        [Range(minimum: 1, 99999)]
        public int identificacionTipoId { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(250)]
        public string identificacionNumero { get; set; }

        public Agregar AgregarAval { get; set; }
    }
    public class AddAvall
    {
        public string Nombre { get; set; }

    }
    public class UpdateImageDistribuidora
    {
        public string Id { get; set; }
        public String Image { get; set; }


    }


    public class UploadFile
    {
        public string Observaciones { get; set; }
        //[Required]
        public int SolicitudID { get; set; }

        //[Required]
        public int DistribuidorID { get; set; }

        // [Required]
        public string Ruta { get; set; }

        //[Required]
        public IFormFile doc { get; set; }
    }

    public class CancelTempObs
    {
        public string Observaciones { get; set; }

        public int SolicitudID { get; set; }

        public int DistribuidorID { get; set; }
    }

    public class GetEvidencia
    {
        public String Ruta { get; set; }

        public int SolicitudID { get; set; }

        public int DistribuidorID { get; set; }
    }

    public class GetDistribuidorTiendita
    {
        public int ProductoID { get; set; }
        public int DistribuidorID { get; set; }
    }
}
