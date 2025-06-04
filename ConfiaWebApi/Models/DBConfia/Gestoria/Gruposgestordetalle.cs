using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Gestoria
{
    [TableName("Gestoria.GruposGestorDetalle")]
    [ExplicitColumns]
    [PrimaryKey("DistribuidorID,GrupoID", AutoIncrement = false)]
    public class GruposGestorDetalle
    {


        [Column("GrupoID")]
        public int GrupoID { get; set; }


        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }


        [Column("Estatus")]
        public bool Estatus { get; set; }


        [Column("UsuarioCreoID")]
        public int UsuarioCreoID { get; set; }


        [Column("FechaCreacion")]
        public DateTime FechaCreacion { get; set; }


        [Column("UsuarioModificoID")]
        public int? UsuarioModificoID { get; set; }


        [Column("FechaModificacion")]
        public DateTime? FechaModificacion { get; set; }


        [Column("Reasignar")]
        public bool? Reasignar { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################

        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################

        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################

    }
    [TableName("Gestoria.LogGestores")]
    [ExplicitColumns]

    public class LogGestores
    {
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }

        [Column("GestorID")]
        public Int64 GestorID { get; set; }

        [Column("UsuarioActualiza")]
        public int UsuarioActualiza { get; set; }

        [Column("FechaActualiza")]
        public DateTime FechaActualiza { get; set; }

        // ###############################################
        // Parent foreign keys
        // >>

        // ###############################################
        // << Parent foreign keys
        // ###############################################

        // ###############################################
        // Child foreign keys
        // >>
        // Aquí podrías agregar relaciones hacia otras tablas hijas si es necesario.
        // ###############################################
    }

}
