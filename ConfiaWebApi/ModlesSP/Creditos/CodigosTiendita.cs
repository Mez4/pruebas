using DBContext.DBConfia.Creditos;
using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class CodigosTienditaRes
    {
        [Column("CodigoID")]
        public int CodigoID { get; set; }

        [Column("SKU")]
        public int SKU { get; set; }

        [Column("Descuento")]
        public int Descuento { get; set; }

        [Column("Sucursal")]
        public string Sucursal { get; set; }

        [Column("Distribuidor")]
        public string Distribuidor { get; set; }
        
        [Column("Codigo")]
        public string Codigo { get; set; }

        [Column("Cliente")]
        public string Cliente { get; set; }

        [Column("Estatus")]
        public string Estatus { get; set; } 
        
        [Column("EstatusNombre")]
        public string? EstatusNombre { get; set; } 

        [Column("Color")]
        public string? Color { get; set; } 

        [Column("PersonaRegistraID")]
        public int PersonaRegistraID { get; set; }

        [Column("PersonaRegistra")]
        public string PersonaRegistra { get; set; }

        [Column("FechaRegistra")]
        public DateTime FechaRegistra { get; set; }

        [Column("PersonaModificaID")]
        public int PersonaModificaID { get; set; }

        [Column("PersonaModifica")]
        public string PersonaModifica { get; set; }

        [Column("FechaModifica")]
        public DateTime FechaModifica { get; set; }
    }

     public class DescuentoTiendita
    {
        
        [Column("SKU")]
        public int SKU { get; set; }

        [Column("CodigoID")]
        public int CodigoID { get; set; }

        [Column("Descuento")]
        public int Descuento { get; set; }
    }
}
