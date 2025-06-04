using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ConfiaWebApi.PeticionesRest.General.Personas;

namespace ConfiaWebApi.PeticionesRest.General.PersonasDirecciones
{
    public class DatosAltaProspeccion
    {
        // [Range(minimum: 1, maximum: 99999999)]
        //  [MinLength(18)]
        // [MaxLength(18)]
        public int PersonaID { get; set; }
        public int DireccionID { get; set; }
        public int DireccionID1 { get; set; }
        public int VialidadTipoId { get; set; }
        public int OrientacionVialidadTipoId { get; set; }
        public int AsentamientoID { get; set; }
        public string NombreVialidad { get; set; }
        public string NumeroExterior { get; set; }
        public string NumeroInterior { get; set; }
        public string ReferenciasGeograficas { get; set; }
        public int ViviendaTipoId { get; set; }
        public DateTime CreacionFecha { get; set; }
        public int CreacionPersonaID { get; set; }
        public string CodigoPostal { get; set; }
        public int CreacionUsuarioID { get; set; }
        public int AsentamientoID1 { get; set; }
        public string CodigoPostal1 { get; set; }
        public string Asentamiento { get; set; }
        public string TipoAsenta { get; set; }
        public string Municipio { get; set; }
        public string Estado { get; set; }
        public string Ciudad { get; set; }
        public string OficinaPostal { get; set; }
        public int IdEstado { get; set; }
        public int IdOficinaPostal { get; set; }
        public string C_CP { get; set; }
        public int IdTipoAsentamiento { get; set; }
        public int IdMunicipio { get; set; }
        public int IdAsentamiento { get; set; }
        public string Zona { get; set; }
        public int IdCiudad { get; set; }
    }
}