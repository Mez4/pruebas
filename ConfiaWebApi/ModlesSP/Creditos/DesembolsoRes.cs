using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using DBContext.DBConfia.Creditos;

namespace DBContext.DBConfia.Custom.Creditos
{
    [ExplicitColumns]
    public class DesembolsoRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("MovimientoID")]
        public long? MovimientoID { get; set; }
    }

    public class DatosFichaPagoCF
    {
        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("EmpresaId")]
        public int EmpresaId { get; set; }

        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }

        [Column("SucursalID")]
        public int SucursalID { get; set; }

        [Column("SucursalNombre")]
        public string SucursalNombre { get; set; }

        [Column("Eslogan")]
        public string Eslogan { get; set; }

        [Column("ContratoCIE")]
        public string ContratoCIE { get; set; }

        [Column("refBancomer")]
        public string refBancomer { get; set; }

        [Column("refSoriana")]
        public string refSoriana { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }

        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }

        [Column("Logo")]
        public byte[] Logo { get; set; }
    }
}