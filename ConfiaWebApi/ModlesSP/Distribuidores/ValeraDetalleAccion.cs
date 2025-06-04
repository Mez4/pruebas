using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Distribuidores
{
    [ExplicitColumns]
    public class ValeraDetalleAccion
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("ValeraID")]
        public int ValeraID { get; set; }

        [Column("Folio")]
        public int Folio { get; set; }
        
        [Column("Estatus")]
        public string Estatus { get; set; }

    }
}
