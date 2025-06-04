using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Cobranza
{
    [ExplicitColumns]
    public class spSubirTicket
    {
        [Column("GestorID")]
        public Int64 GestorID { get; set; }


        [Column("GestorDesc")]
        public string GestorDesc { get; set; }


        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }


        [Column("DistribuidorDesc")]
        public string DistribuidorDesc { get; set; }


        [Column("SucursalID")]
        public int SucursalID { get; set; }


        [Column("Sucursal")]
        public string Sucursal { get; set; }


        [Column("Grupo")]
        public string Grupo { get; set; }


        [Column("ClasificadorGrupoID")]
        public int? ClasificadorGrupoID { get; set; }


        [Column("FechaAsignacion")]
        public string FechaAsignacion { get; set; }


        [Column("DiasAtrasoAsignado")]
        public int? DiasAtrasoAsignado { get; set; }


        [Column("DiasAtraso")]
        public int DiasAtraso { get; set; }


        [Column("ProductoID")]
        public int ProductoID { get; set; }


        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }


        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }


        [Column("Activo")]
        public bool Activo { get; set; }


        [Column("ColorTicket")]
        public string ColorTicket { get; set; }


        [Column("ColorReferencias")]
        public string ColorReferencias { get; set; }


        [Column("ColorReferenciasAvales")]
        public string ColorReferenciasAvales { get; set; }

        [Column("TicketID2")]
        public string TicketID2 { get; set; }


        [Column("regresa")]
        public int regresa { get; set; }


        [Column("msj")]
        public string msj { get; set; }
    }
}
