using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [TableName("Creditos.SolicitudCreditosCV")]
    [ExplicitColumns]
    [PrimaryKey("SolicitudCreditoID")]
    public class SolicitudCreditosCV
    {

        [Column("SolicitudCreditoID")]
        public Int64 SolicitudCreditoID { get; set; }
        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
        [Column("SucursalID")]
        public int SucursalID { get; set; }
        [Column("Monto")]
        public decimal Monto { get; set; }
        [Column("EstatusID")]
        public string EstatusID { get; set; }
        [Column("FechaHoraRegistro")]
        public DateTime? FechaHoraRegistro { get; set; }
        [Column("FechaHoraAutoriza")]
        public DateTime? FechaHoraAutoriza { get; set; }
        [Column("FechaHoraCancela")]
        public DateTime? FechaHoraCancela { get; set; }
        [Column("UsuarioIDRegistra")]
        public int UsuarioIDRegistra { get; set; }
        [Column("UsuarioIDAutoriza")]
        public int UsuarioIDAutoriza { get; set; }
        [Column("UsuarioIDCancela")]
        public int UsuarioIDCancela { get; set; }
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
        [Column("CreditoProspectoID")]
        public Int64 CreditoProspectoID { get; set; }
        [Column("DatoBancarioID")]
        public string DatoBancarioID { get; set; }
        [Column("SistemaID")]
        public string SistemaID { get; set; }
        [Column("PagareDigitalID")]
        public Int64 PagareDigitalID { get; set; }
        [Column("FolioVale")]
        public string FolioVale { get; set; }
        [Column("FolioValeDig")]
        public string FolioValeDig { get; set; }
        [Column("Plazos")]
        public int Plazos { get; set; }
    }
}
