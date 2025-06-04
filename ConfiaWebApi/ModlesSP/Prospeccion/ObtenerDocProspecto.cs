using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
    [ExplicitColumns]
    public class ObtenerDocProspecto
    {
		[Column("TipoDocumentoID")]
		public int TipoDocumentoID { get; set; }
		[Column("NombreDocumento")]
		public string NombreDocumento { get; set; }
		[Column("Clave")]
		public string Clave { get; set; }
		[Column("Descripcion")]
		public string Descripcion { get; set; }
		[Column("Orden")]
		public string Orden { get; set; }
		[Column("DocumentoID")]
		public int DocumentoID { get; set; }
		[Column("PersonaID")]
		public int PersonaID { get; set; }
		[Column("TipoPersonaID")]
		public int TipoPersonaID { get; set; }
		[Column("Ruta")]
		public string Ruta { get; set; }
		[Column("Autorizado")]
		public bool? Autorizado { get; set; }
		[Column("ConsultaBuro")]
		public bool? ConsultaBuro { get; set; }
		[Column("rn")]
		public int rn { get; set; }
	}
}
