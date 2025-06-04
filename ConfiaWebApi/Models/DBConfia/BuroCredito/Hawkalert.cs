using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.HawkAlert")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class HawkAlert
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idConsulta")]
        public int idConsulta { get; set; }
      
        
        [Column("tipoHawAlert")]
        public string tipoHawAlert { get; set; }
      
        
        [Column("FechaReporte")]
        public string FechaReporte { get; set; }
      
        
        [Column("CodigoClave")]
        public string CodigoClave { get; set; }
      
        
        [Column("TipoInstitucion")]
        public string TipoInstitucion { get; set; }
      
        
        [Column("Mensaje")]
        public string Mensaje { get; set; }


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
