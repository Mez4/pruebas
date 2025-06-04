using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.doctos_uni")]
    [ExplicitColumns]
    [PrimaryKey("docto_uni_id")]
    public class doctos_uni
    {
              
        
        [Column("docto_uni_id")]
        public int docto_uni_id { get; set; }
      
        
        [Column("tipo_docto")]
        public string tipo_docto { get; set; }
      
        
        [Column("estatus")]
        public string estatus { get; set; }
      
        
        [Column("descripcion")]
        public string descripcion { get; set; }
      
        
        [Column("usuario_id_registra")]
        public int? usuario_id_registra { get; set; }
      
        
        [Column("fecha_registro")]
        public DateTime? fecha_registro { get; set; }
      
        
        [Column("usuario_id_aprobacion")]
        public int? usuario_id_aprobacion { get; set; }
      
        
        [Column("fecha_aprobacion")]
        public DateTime? fecha_aprobacion { get; set; }
      
        
        [Column("usuario_id_cancelacion")]
        public int? usuario_id_cancelacion { get; set; }
      
        
        [Column("fecha_cancelacion")]
        public DateTime? fecha_cancelacion { get; set; }
      
        
        [Column("usuario_id_ult_modificacion")]
        public int? usuario_id_ult_modificacion { get; set; }
      
        
        [Column("fecha_ult_modificacion")]
        public DateTime? fecha_ult_modificacion { get; set; }


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
