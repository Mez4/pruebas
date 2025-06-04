using NPoco;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
	[ExplicitColumns]
	public class ProcesoProspecto
    {
		[Column("StatusProcesoID")]
		public int StatusProcesoID { get; set; }
		[Column("Descripcion")]
		public string Descripcion { get; set; }
		[Column("PersonaID")]
		public int PersonaID { get; set; }
		[Column("TipoPersonaID")]
		public int TipoPersonaID { get; set; }
		[Column("Resultado")]
		public string Resultado { get; set; }

		[Column("Validado")]
		public bool? Validado { get; set; }
		[Column("CapturaObligatoria")]
		public bool? CapturaObligatoria { get; set; }
		[Column("DictamenObligatorio")]
		public bool? DictamenObligatorio { get; set; }
		[Column("ProductoID")]
		public int? ProductoID { get; set; }
		[Column("rn")]
		public int rn { get; set; }
	}
}
