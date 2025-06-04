using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.BannerApp")]
    [ExplicitColumns]
    [PrimaryKey("ImageID")]
    public class BannerApp
    {


        [Column("ImageID")]
        public int ImageID { get; set; }


        [Column("Imagen")]
        public string Imagen { get; set; }


        [Column("Titulo")]
        public string Titulo { get; set; }


        [Column("Descripcion")]
        public string Descripcion { get; set; }


        [Column("Mostrar")]
        public bool Mostrar { get; set; }


        [Column("FechaAlta")]
        public DateTime FechaAlta { get; set; }
        [Column("TipoEmpresaID")]
        public int TipoEmpresaID { get; set; }


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
