using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.ErrorAR")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class ErrorAR
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idConsulta")]
        public int idConsulta { get; set; }
      
        
        [Column("ReferenciaOperador")]
        public string ReferenciaOperador { get; set; }
      
        
        [Column("SujetoNoAutenticado")]
        public string SujetoNoAutenticado { get; set; }
      
        
        [Column("ClaveOPasswordErroneo")]
        public string ClaveOPasswordErroneo { get; set; }
      
        
        [Column("ErrorSistemaBC")]
        public string ErrorSistemaBC { get; set; }
      
        
        [Column("EtiquetaSegmentoErronea")]
        public string EtiquetaSegmentoErronea { get; set; }
      
        
        [Column("FaltaCampoRequerido")]
        public string FaltaCampoRequerido { get; set; }
      
        
        [Column("ErrorReporteBloqueado")]
        public string ErrorReporteBloqueado { get; set; }


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
