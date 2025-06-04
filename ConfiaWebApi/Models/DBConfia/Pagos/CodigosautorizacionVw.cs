using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Pagos
{
    [TableName("Pagos.CodigosAutorizacion_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CodigosAutorizacion_VW
    {
              
        
        [Column("CodigoAutorizacionID")]
        public Int64 CodigoAutorizacionID { get; set; }
      
        
        [Column("FHGeneracion")]
        public DateTime FHGeneracion { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("CODIGO")]
        public string CODIGO { get; set; }
      
        
        [Column("Cancelado")]
        public bool Cancelado { get; set; }
      
        
        [Column("Utilizado")]
        public bool Utilizado { get; set; }
      
        
        [Column("UsuarioIDUtiliza")]
        public int? UsuarioIDUtiliza { get; set; }
      
        
        [Column("FHUtilizacion")]
        public DateTime? FHUtilizacion { get; set; }
      
        
        [Column("Referencia")]
        public Int64? Referencia { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("USUGenera")]
        public int USUGenera { get; set; }
      
        
        [Column("AutorizacionTipo")]
        public string AutorizacionTipo { get; set; }
      
        
        [Column("AutorizacionTipoID")]
        public int AutorizacionTipoID { get; set; }
      
        
        [Column("Creo")]
        public string Creo { get; set; }
      
        
        [Column("Utiliza")]
        public string Utiliza { get; set; }


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
