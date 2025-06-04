using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto
{
    public class get
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string RFC { get; set; }
        public string CURP { get; set; }
        public int? StatusProcesoID { get; set; }
        public bool? Prospecto { get; set; }
        public Int64? SucursalID { get; set; }
    }

    public class get2
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string RFC { get; set; }
        public string CURP { get; set; }
        public int? StatusProcesoID { get; set; }
        public bool? Prospecto { get; set; }

        public int? PromotorUsuarioID { get; set; }
        public Int64? SucursalID { get; set; }

    }

    public class Agregar
    {
        public long PersonaID { get; set; }
        public bool CrearProspecto { get; set; } = false;

        public int DireccionPersona_AsentamientoID { get; set; }
        public string DireccionPersona_NombreVialidad { get; set; }
        public string DireccionPersona_NumeroExterior { get; set; }
        public string DireccionPersona_Localidad { get; set; }

        public bool Laboral_Trabaja { get; set; }
        public string Laboral__Empresa { get; set; }
        public int Laboral__OcupacionID { get; set; }
        public string Laboral__Telefono { get; set; }
        public decimal Laboral__SueldoMensual { get; set; }
        public string Laboral__Antiguedad { get; set; }

        public string DireccionLaboral_NombreVialidad { get; set; }
        public string DireccionLaboral_NumeroExterior { get; set; }
        public int DireccionLaboral_AsentamientoID { get; set; }
        public string DireccionLaboral_LocalidadLaboral { get; set; }

        public bool Conyuge_Trabaja { get; set; }
        public string Conyuge_AntiguedadConyuge { get; set; }
        public int Conyuge_AsentamientoIDLaboralConyuge { get; set; }
        public string Conyuge_CalleLaboralConyuge { get; set; }
        public string Conyuge_EmpresaConyuge { get; set; }
        public string Conyuge_LocalidadLaboralConyuge { get; set; }
        public string Conyuge_NumeroExteriorLaboralConyuge { get; set; }
        public int Conyuge_OcupacionIDConyuge { get; set; }
        public decimal Conyuge_SueldoMensualConyuge { get; set; }
        public string Conyuge_TelefonoLaboralConyuge { get; set; }
    }

    public class DatosEconomicos
    {
        [Required]
        public int prospectoID { get; set; }
        //vivienda
        [Required]
        [MinLength(12)]
        [MaxLength(13)]
        public string rfc { get; set; }
        [Required]
        public int tipoViviendaID { get; set; }
        [Required]
        public int habitantes { get; set; }
        [Required]
        public decimal valorAproxVivienda { get; set; }
        [Required]
        public bool otraVivienda { get; set; }
        public decimal valorAproxOtra { get; set; }
        public int tipoOtraViviendaID { get; set; }
        public int asentamientoIDOtra { get; set; }
        public string calleOtraVivienda { get; set; }
        public string localidadOtraVivienda { get; set; }
        public string numeroOtraVivienda { get; set; }

        //egresos e ingresos
        [Required]
        public decimal ingresoSueldo { get; set; }
        [Required]
        public decimal ingresoGananciasDV { get; set; }
        [Required]
        public decimal ingresoConyuge { get; set; }
        [Required]
        public decimal ingresoOtro { get; set; }
        [Required]
        public decimal egresoAlimentacion { get; set; }
        [Required]
        public decimal egresotarjetas { get; set; }
        [Required]
        public decimal egresoVivienda { get; set; }
        [Required]
        public decimal egresoDomestico { get; set; }
        [Required]
        public decimal egresoOtros { get; set; }
        [Required]
        public int dependientesEconomicos { get; set; }

        //vehiculos
        [Required]
        public bool tieneVehiculo { get; set; }
        public List<Vehiculo> vehiculos { get; set; }

        //experiencia en ventas
        [Required]
        public bool tieneExperiencia { get; set; }
        public List<Experiencia> experiencias { get; set; }

        //Origen
        [Required]
        public int distribuidorTipoID { get; set; }
    }

    public class Vehiculo
    {
        public string marca { get; set; }
        public string modelo { get; set; }
    }

    public class Experiencia
    {
        public string empresaTxt { get; set; }
        public int empresa { get; set; }
        public string fecha { get; set; }
        public decimal limite { get; set; }
        public decimal dispo { get; set; }
    }

    public class GetDocs
    {
        public int ProspectoID { get; set; }
    }

    public class GetDoc
    {
        public int DocumentoID { get; set; }

        public int PersonaID { get; set; }

    }

    public class UploadFile
    {
        [Required]
        public string Clave { get; set; }
        [Required]
        public string Descripcion { get; set; }
        [Required]
        public int DocumentoID { get; set; }
        [Required]
        public string NombreDocumento { get; set; }
        [Required]
        public string Orden { get; set; }
        [Required]
        public string PersonaID { get; set; }
        [Required]
        public string Ruta { get; set; }
        [Required]
        public int TipoDocumentoID { get; set; }
        [Required]
        public string TipoPersonaID { get; set; }

        [Required]
        public IFormFile doc { get; set; }
    }

    public class AddAval
    {
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

        // [MinLength(10)]
        [MaxLength(18)]
        public string TelefonoDomicilio { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(18)]
        public string TelefonoMovil { get; set; }

        [MaxLength(120)]
        // [EmailAddress]
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

    public class ValidarDocumentos
    {
        [Required]
        public int ProspectoID { get; set; }
    }
    public class ValidarDocumentosApp
    {
        [Required]
        public int ProspectoID { get; set; }
        [Required]
        public int ProductoID { get; set; }
    }
    public class ValidarDocumentosAvales
    {
        [Required]
        public int ProspectoID { get; set; }
    }

    public class ValidarReferenciasAvales
    {
        [Required]
        public int ProspectoID { get; set; }
    }

    public class GetNotificaciones
    {
        [Required]
        public int ProspectoID { get; set; }
    }
    public class GetNotificacionesApp
    {
        [Required]
        public int ProspectoID { get; set; }
        [Required]
        public int ProductoID { get; set; }
    }

    public class NotificacionLeida
    {
        [Required]
        public int ProspectoID { get; set; }
    }



    public class ValidarProspecto
    {
        [Required]
        public int ProspectoID { get; set; }

        [Required]
        public int PersonaID { get; set; }


    }

    public class subirDocActivacion
    {
        [Required]
        [Range(minimum: 0, maximum: 9999999)]
        public int ProspectoID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 3)]
        public int identificador { get; set; }

        [Required]
        public IFormFile doc { get; set; }
    }

    public class getDocActivacion
    {

        public String DocumentoPath { get; set; }
    }

    public class getDocSolicitudFallecida
    {

        public String Ruta { get; set; }
    }

    public class GetProcesos
    {
        [Required]
        public int ProspectoID { get; set; }
    }

    public class GetPerfil
    {
        public int? ProspectoID { get; set; }
    }
    public class updateAutorizaDocumeto
    {
        public int DocumentoID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateRechazaDocumeto
    {
        public int DocumentoID { get; set; }
        public string Nota { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateProcesoTitular
    {
        public int ProspectoID { get; set; }
        public int Identificador { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class updateValidaTitular
    {
        public int ProspectoID { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class updateRechazaTitular
    {
        public int ProspectoID { get; set; }
        public string Nota { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class DictaminarProspecto
    {
        [Required]
        public int ProspectoID { get; set; }
        [Required]
        public int DistribuidorNivelID { get; set; }
        [Required]
        public decimal Monto { get; set; }
        public string DistribuidoresEstatusID { get; set; }
    }

    public class AddMsjSucursalPromotor
    {
        [Required]
        public int ProspectoID { get; set; }
        [Required]
        public string Nota { get; set; }
        [Required]
        public int TipoMesa { get; set; }
        public int DesdeProceso { get; set; } = 0;
    }

    public class GetMensajesFijos
    {
        [Required]
        public int StatusProcesoID { get; set; }
        [Required]
        public int TipoDocumentoID { get; set; }
    }

    public class ConsolidarProspecto
    {
        [Required]
        public int ProspectoID { get; set; }
        public int DistribuidorNivelID { get; set; }

        public int DistribuidorNivelID2 { get; set; }
        public int? ProductoID { get; set; }
        public decimal Monto { get; set; }
        public string DistribuidoresEstatusID { get; set; }
    }

    public class GetFirmaAval
    {
        [Required]
        public int AvalID { get; set; }
    }

    public class GetProspecto
    {
        public int PromotorPersonaID { get; set; }

        public Int64 ProspectoID { get; set; }

        public int ProductoID { get; set; }

        public int SucursalID { get; set; }
    }
    public class UpdateProspectoDescartado
    {
        [Required]
        public int ProspectoID { get; set; }
        public bool Descartado { get; set; }
        public string ObservacionesDescartado { get; set; }
    }

    public class UpdateProspectoPreActivacion
    {
        public int opcion { get; set; }

        public int ProspectoID { get; set; }

        public int ProductoID { get; set; }

        public int? NivelOrigen { get; set; }

        public int? Dictamen { get; set; }
    }

}
