using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.ConsultaOrdenes")]
    [ExplicitColumns]
    [PrimaryKey("OrdenID")]
    public class ConsultaOrdenes
    {
              
        
        [Column("OrdenID")]
        public int OrdenID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("TipoConsulta")]
        public int TipoConsulta { get; set; }
      
        
        [Column("FechaConsultada")]
        public DateTime? FechaConsultada { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################
        
        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################
        
    }
}
