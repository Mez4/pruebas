using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Cobranza.GestorCobranza
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }

    }

    public class add
    {
        public int PersonaID { get; set; }
        public string NombreCompleto { get; set; }
        public int MesaCobranzaID { get; set; }
        public string mesaCobranza { get; set; }
        public bool Activo { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }

    public class upd
    {
        public int PersonaID { get; set; }
        public string NombreCompleto { get; set; }
        public int MesaCobranzaID { get; set; }
        public int MesaAnteriorId { get; set; }
        // public string mesaCobranza { get; set; }
        public bool Activo { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }

    }
    public class addPersonaGestor
    {
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string FechaNacimiento { get; set; }
        public string SexoID { get; set; }
        public string CURP { get; set; }
        public string RFC { get; set; }
        public string EstadoCivilID { get; set; }
        public string NombreConyuge { get; set; }
        public int EscolaridadID { get; set; }
        public string TelefonoMovil { get; set; }
        public string CorreoElectronico { get; set; }
        public string LugarNacimiento { get; set; }
        public int AsentamientoID { get; set; }
        public string Calle { get; set; }
        public string NumeroExterior { get; set; }
        public string TelefonoDomicilio { get; set; }
        public string Observaciones { get; set; }
        public int identificacionTipoId { get; set; }
        public string identificacionNumero { get; set; }
        public int MesaCobranzaID { get; set; }
        public int vialidadTipoId { get; set; }
        public int orientacionVialidadTipoId { get; set; }
        public int viviendaTipoId { get; set; }
        public int regresa { get; set; }
        public string msj { get; set; }
    }

    public class validacionAltaGestorCobranza
    {
        public bool valida { get; set; } 
        public int regresa { get; set; }
        public string msj { get; set; }

    }

      public class getGestor
    {
        [Range(minimum: 0, maximum: 999999)]
        public int DistribuidorID { get; set; }        
        // public int GestorID { get; set; }

    }
}
