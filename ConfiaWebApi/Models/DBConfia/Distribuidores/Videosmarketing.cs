using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.VideosMarketing")]
    [ExplicitColumns]
    [PrimaryKey("VideoID")]
    public class VideosMarketing
    {


        [Column("VideoID")]
        public int VideoID { get; set; }


        [Column("VideoURL")]
        public string VideoURL { get; set; }


        [Column("VideoDescripcion")]
        public string VideoDescripcion { get; set; }


        [Column("Mostrar")]
        public bool Mostrar { get; set; }


        [Column("FechaHoraRegistro")]
        public DateTime? FechaHoraRegistro { get; set; }


        [Column("UsuarioCreacionID")]
        public int? UsuarioCreacionID { get; set; }


        [Column("Prioridad")]
        public int Prioridad { get; set; }


        [Column("VideoPortada")]
        public string VideoPortada { get; set; }


        [Column("VideoTitulo")]
        public string VideoTitulo { get; set; }


        [Column("EsVR")]
        public bool? EsVR { get; set; }


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
}
