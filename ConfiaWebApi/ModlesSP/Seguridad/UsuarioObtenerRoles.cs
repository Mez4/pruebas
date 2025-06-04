using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Seguridad
{
    [ExplicitColumns]
    public class UsuarioObtenerRoles
    {
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("ProductoNombre")]
        public string ProductoNombre { get; set; }

        [Column("ModuloID")]
        public int ModuloID { get; set; }

        [Column("ModuloNombre")]
        public string ModuloNombre { get; set; }

        [Column("ModuloRuta")]
        public string ModuloRuta { get; set; }

        [Column("ModuloIcono")]
        public string ModuloIcono { get; set; }

        [Column("ModuloEtiqueta")]
        public string ModuloEtiqueta { get; set; }

        [Column("RolID")]
        public int RolID { get; set; }

        [Column("rolNombre")]
        public string RolNombre { get; set; }

        [Column("PermisoID")]
        public int PermisoID { get; set; }

        [Column("PermisoNombre")]
        public string PermisoNombre { get; set; }
    }

    public class CrearUsuarioResp
    {

        [Column("Mensaje")]
        public string Mensaje { get; set; }

        [Column("UsuarioID")]
        public int UsuarioID { get; set; }

        [Column("NOMBRE")]
        public string NOMBRE { get; set; }

        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }

        [Column("IDRespuesta")]
        public int IDRespuesta { get; set; }

    }
}