using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.VersionApp")]
    public class VersionApp
    {




        [Column("nombreApp")]
        public string nombreApp { get; set; }


        [Column("numVersion")]
        public string numVersion { get; set; }


        [Column("enlaceDescarga")]
        public string enlaceDescarga { get; set; }


        [Column("mensaje")]
        public string mensaje { get; set; }


        [Column("forzarActualizacion")]
        public bool forzarActualizacion { get; set; }



    }
}
