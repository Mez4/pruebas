using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Seguridad.Usuarios
{
    public class Agregar : PeticionesRest.General.Personas.Persona
    {
        /// <summary>
        /// Empresa ligada al usuario
        /// </summary>
        // [Required]
        // [Range(minimum: 1, maximum: int.MaxValue)]
        // public int empresaId { get; set; }

        /// <summary>
        /// Campo a utilizar para el nombre de usuario, 1: Email, 2: Telefono
        /// </summary>
        [Required]
        [Range(minimum: 1, maximum: 2)]
        public int tipoUsuario { get; set; }
    }
    public class AgregarRapido
    {
        public string CURP { get; set; }
        public string Nombre { get; set; }
        public string ApellidoPat { get; set; }
        public string ApellidoMat { get; set; }
        public string CorreoElectronico { get; set; }
        public int ProductoID { get; set; }
        public int SucursalID { get; set; }
        public string ArrayIds { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public int SACId { get; set; }
        public int CreacionUsuarioID { get; set; }
    }

    public class Actualizar
    {

        public string Contrasena { get; set; }
        public int UsuarioID { get; set; }

    }

    public class ActualizarUsuario
    {
        public int UsuarioID { get; set; }
        public int? UsuarioIDActualiza { get; set; }
        public string Usuario { get; set; }
        public string CorreoElectronico { get; set; }
        public string NombrePersona { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public int? ProductoID { get; set; }
    }

    public class GetModulo
    {

        public int UsuarioID { get; set; }
        public int ModuloID { get; set; }

        public int PantallaID { get; set; }

        public int PermisoEspecial { get; set; }

    }
    public class ProductosSeleccionados
    {
        public int value { get; set; }

    }

    public class USerMaster
    {
        public int IDUsuario { get; set; }

    }
    public class Permisos
    {
        [Required]
        public int PermisoID { get; set; }
        public List<ProductosSeleccionados> ProductosSeleccionados { set; get; }

    }
    public class PermisosCL
    {
        [Required]
        public int UsuarioID { set; get; }
        public List<Permisos> Permisos { set; get; }

    }

    public class addPermisosCartera
    {
        public int UsuarioID { get; set; }

        public List<int?> SucursalesIds { get; set; }

        public List<int?> ProductosIds { get; set; }

    }

    public class getAccesos
    {
        public int UsuarioID { get; set; }

    }
}
