using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
  [ExplicitColumns]
  public class LogTiemposPeriodo
  {
    [Column("res")]
    public int res { get; set; }

    [Column("msj")]
    public string msj { get; set; }
    //s


  }
  public class LogTiemposPeriodoGet
  {
    [Column("ID")]
    public int ID { get; set; }

    [Column("Pantalla")]
    public int Pantalla { get; set; }
    [Column("ProspectoID")]
    public int ProspectoID { get; set; }
    [Column("Prospecto")]
    public string Prospecto { get; set; }
    [Column("RevisionTiempo")]
    public string RevisionTiempo { get; set; }
    [Column("LlamadasTiempo")]
    public string LlamadasTiempo { get; set; }
    [Column("ExpedienteTiempo")]
    public string ExpedienteTiempo { get; set; }




  }
}
