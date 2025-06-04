using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{

    // View, no primary key needed
    public class ValesDVPrimerCanje
    {


        [Column("valeId")]
        public Int64 valeId { get; set; }
        [Column("fhRegistro")]
        public DateTime fhRegistro { get; set; }

        [Column("cancelado")]
        public bool cancelado { get; set; }

        [Column("fhCancelacion")]
        public DateTime? fhCancelacion { get; set; }
        [Column("valeraDetalleId")]
        public int valeraDetalleId { get; set; }
        [Column("nombreCliente")]
        public string nombreCliente { get; set; }
        [Column("importe")]
        public decimal importe { get; set; }
        [Column("plazos")]
        public int plazos { get; set; }
        [Column("codigoVale")]
        public string codigoVale { get; set; }
        [Column("canjeId")]
        public int canjeId { get; set; }
        [Column("status")]
        public string status { get; set; }
        [Column("creditoId")]
        public Int64 creditoId { get; set; }
        [Column("folio")]
        public String folio { get; set; }

        [Column("telefono")]
        public string telefono { get; set; }

        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }

    }
}
