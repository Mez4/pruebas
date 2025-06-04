using NPoco;
using System;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
    [ExplicitColumns]
    public class LogMensajesVW
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("LogMensajeID")]
        public int LogMensajeID { get; set; }


        [Column("Mensaje")]
        public string Mensaje { get; set; }


        [Column("Fecha_hora")]
        public DateTime Fecha_hora { get; set; }


        [Column("AnalistaPersonaID")]
        public Int64 AnalistaPersonaID { get; set; }


        [Column("AnalistaUsuarioID")]
        public int AnalistaUsuarioID { get; set; }


        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }


        [Column("Leido")]
        public bool? Leido { get; set; }


        [Column("PromotorPersonaID")]
        public Int64 PromotorPersonaID { get; set; }


        [Column("PromotorUsuarioID")]
        public int PromotorUsuarioID { get; set; }


        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }


        [Column("NombreProspecto")]
        public string NombreProspecto { get; set; }


        [Column("StatusProcesoID")]
        public Int64 StatusProcesoID { get; set; }


        [Column("Proceso")]
        public string Proceso { get; set; }


        [Column("SucursalID")]
        public int SucursalID { get; set; }

        [Column("EnviadoDesdeMesa")]
        public bool EnviadoDesdeMesa { get; set; }
    }
}
