using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.ErrorUR")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class ErrorUR
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idConsulta")]
        public int idConsulta { get; set; }
      
        
        [Column("NumeroReferenciaOperador")]
        public string NumeroReferenciaOperador { get; set; }
      
        
        [Column("SolicitudClienteErronea")]
        public string SolicitudClienteErronea { get; set; }
      
        
        [Column("VersionProporcionadaErronea")]
        public string VersionProporcionadaErronea { get; set; }
      
        
        [Column("ProductoSolicitadoErroneo")]
        public string ProductoSolicitadoErroneo { get; set; }
      
        
        [Column("PasswordOClaveErronea")]
        public string PasswordOClaveErronea { get; set; }
      
        
        [Column("SegmentoRequeridoNoProporcionado")]
        public string SegmentoRequeridoNoProporcionado { get; set; }
      
        
        [Column("UltimaInformacionValidaCliente")]
        public string UltimaInformacionValidaCliente { get; set; }
      
        
        [Column("InformacionErroneaParaConsulta")]
        public string InformacionErroneaParaConsulta { get; set; }
      
        
        [Column("ValorErroneoCampoRelacionado")]
        public string ValorErroneoCampoRelacionado { get; set; }
      
        
        [Column("ErrorSistemaBuroCredito")]
        public string ErrorSistemaBuroCredito { get; set; }
      
        
        [Column("EtiquetaSegmentoErronea")]
        public string EtiquetaSegmentoErronea { get; set; }
      
        
        [Column("OrdenErroneoSegmento")]
        public string OrdenErroneoSegmento { get; set; }
      
        
        [Column("NumeroErroneoSegmentos")]
        public string NumeroErroneoSegmentos { get; set; }
      
        
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
