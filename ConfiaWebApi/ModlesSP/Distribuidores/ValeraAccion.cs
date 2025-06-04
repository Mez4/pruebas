using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Distribuidores
{
    [ExplicitColumns]
    public class ValeraAccion
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("ValeraID")]
        public int ValeraID { get; set; }

        [Column("producto")]
        public int producto { get; set; }

        [Column("DistribuidorID")]
        public int DistribuidorID { get; set; }

        [Column("serie")]
        public int serie { get; set; }

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

        [Column("AsignaSucursalId")]
        public int AsignaSucursalId { get; set; }

        [Column("AsignaSucursalFecha")]
        public DateTime AsignaSucursalFecha { get; set; }

        [Column("AsignaSucursalUsuarioId")]
        public int AsignaSucursalUsuarioId { get; set; }

        [Column("ReciboSucursalFecha")]
        public DateTime ReciboSucursalFecha { get; set; }

        [Column("ReciboSucursalUsuarioId")]
        public int ReciboSucursalUsuarioId { get; set; }

        [Column("AsignaDistribudiorFecha")]
        public DateTime AsignaDistribudiorFecha { get; set; }

        [Column("AsignaDistribudiorUsuarioId")]
        public int AsignaDistribudiorUsuarioId { get; set; }

        [Column("CanceladoFecha")]
        public DateTime CanceladoFecha { get; set; }

        [Column("CanceladoUsuarioId")]
        public int CanceladoUsuarioId { get; set; }

        [Column("valeraTrackingEstatus")]
        public int valeraTrackingEstatus { get; set; }

        [Column("EnvioSucursalNota")]
        public string EnvioSucursalNota { get; set; }

        [Column("ReciboSucursalNota")]
        public string ReciboSucursalNota { get; set; }

        [Column("CodigoBarras")]
        public string CodigoBarras { get; set; }

        [Column("SucursalEnviaValera")]
        public int SucursalEnviaValera { get; set; }

        [Column("SucNombre")]
        public string SucNombre { get; set; }

        [Column("Ruta")]
        public string Ruta { get; set; }
    }
}
