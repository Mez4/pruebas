using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.LogArchivados")]
    [ExplicitColumns]
    [PrimaryKey("LogID", AutoIncrement=true)]
    public class LogArchivados
    {
        [Column("LogID")]
        public int LogID { get; set; }  

        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }

        [Column("Descripcion")]
        public string Descripcion { get; set; }   

        [Column("TipoArchivadoID")]
        public Int64 TipoArchivadoID { get; set; }

        [Column("Motivo")]
        public string Motivo { get; set; }   

        [Column("FechaRegistra")]
        public DateTime FechaRegistra { get; set; } 

        [Column("UsuarioIDRegistra")]
        public int UsuarioIDRegistra { get; set; }

        [Column("PersonaIDRegistra")]
        public Int64 PersonaIDRegistra { get; set; }
        
    }
}
