using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
	[ExplicitColumns]
	public class ObtenerDocsDistibuidor
    {
		[Column("NombrePersona")]
		public string NombrePersona { get; set; }
		[Column("TipoDocumentoID")]
		public int TipoDocumentoID { get; set; }
		[Column("NombreDocumento")]
		public string NombreDocumento { get; set; }
		[Column("Clave")]
		public string Clave { get; set; }
		[Column("Descripcion")]
		public string Descripcion { get; set; }
		 
		[Column("PersonasDocID")]
		public int PersonasDocID { get; set; }


		[Column("PersonaID")]
		public int PersonaID { get; set; }
		
		[Column("Ruta")]
		public string Ruta { get; set; }
		
	}
}
