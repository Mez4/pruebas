using NPoco;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
    public class ObtenerProcesosProducto
    {
		[Column("StatusProcesoID")]
		public int StatusProcesoID { get; set; }

		[Column("Descripcion")]
		public string Descripcion { get; set; }

		[Column("Activo")]
		public bool Activo { get; set; }

		[Column("MatrizProcesosID")]
		public int MatrizProcesosID { get; set; }

		[Column("MatrizProcesosDetalleID")]
		public int MatrizProcesosDetalleID { get; set; }

		[Column("CapturaObligatoria")]
		public bool? CapturaObligatoria { get; set; }

		[Column("Notificacion")]
		public bool? Notificacion { get; set; }

		[Column("NotaObligatoria")]
		public bool? NotaObligatoria { get; set; }

		[Column("DictamenObligatorio")]
		public bool? DictamenObligatorio { get; set; }

		[Column("ProductoID")]
		public int ProductoID { get; set; }

		[Column("rn")]
		public int rn { get; set; }
	}
}
