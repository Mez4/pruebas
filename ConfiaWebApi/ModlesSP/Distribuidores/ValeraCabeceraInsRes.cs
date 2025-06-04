using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Distribuidores
{
    [ExplicitColumns]
    public class ValeraCabeceraInsRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("ValeraCabeceraID")]
        public int ValeraCabeceraID { get; set; }

        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("serieId")]
        public int serieId { get; set; }

        [Column("FolioInicial")]
        public int FolioInicial { get; set; }

        [Column("FolioFinal")]
        public int FolioFinal { get; set; }

        [Column("Estatus")]
        public string Estatus { get; set; }

        [Column("RegistroFecha")]
        public DateTime RegistroFecha { get; set; }

        [Column("RegistroUsuarioId")]
        public int RegistroUsuarioId { get; set; }

        [Column("RegistroPersonaID")]
        public int RegistroPersonaID { get; set; }

        [Column("ValerasFraccionID")]
        public int ValerasFraccionID { get; set; }

        [Column("ValeraTrackingEstatusID")]
        public int ValeraTrackingEstatusID { get; set; }
    }
}
