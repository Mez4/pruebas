using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.General
{
	[TableName("Sistema.ConsultasReportes")]
	[ExplicitColumns]
	public class ConsultasReportes
    {
		[Column("ReporteID")]
		public Int64 ReporteID { get; set; }

		[Column("PantallaID")]
		public Int64 PantallaID { get; set; }

		[Column("Nombre")]
		public string Nombre { get; set; }

		[Column("Activo")]
		public bool Activo { get; set; }

		[Column("SQL")]
		public string SQL { get; set; }
		 
		[Column("Especial")]
		public bool Especial { get; set; }

		[Column("Exportar")]
		public bool Exportar { get; set; }

		[Column("PermisoID")]
		public int PermisoID { get; set; }
		
	}
}