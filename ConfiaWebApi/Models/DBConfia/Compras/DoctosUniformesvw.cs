using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.doctos_uniformesvw")]
    [ExplicitColumns]
    // View, no primary key needed
    public class doctos_uniformesvw
    {
              
        
        [Column("docto_uni_id")]
        public int docto_uni_id { get; set; }
      
        
        [Column("usuario_id_registra")]
        public int? usuario_id_registra { get; set; }
      
        
        [Column("NombreRegistra")]
        public string NombreRegistra { get; set; }
      
        
        [Column("fecha_registro")]
        public DateTime? fecha_registro { get; set; }
      
        
        [Column("usuario_id_aprobacion")]
        public int? usuario_id_aprobacion { get; set; }
      
        
        [Column("NombreAprobacion")]
        public string NombreAprobacion { get; set; }
      
        
        [Column("fecha_aprobacion")]
        public DateTime? fecha_aprobacion { get; set; }
      
        
        [Column("usuario_id_cancelacion")]
        public int? usuario_id_cancelacion { get; set; }
      
        
        [Column("NombreCancela")]
        public string NombreCancela { get; set; }
      
        
        [Column("fecha_cancelacion")]
        public DateTime? fecha_cancelacion { get; set; }
      
        
        [Column("estatus")]
        public string estatus { get; set; }
      
        
        [Column("tipo_docto")]
        public string tipo_docto { get; set; }
      
        
        [Column("descripcion")]
        public string descripcion { get; set; }


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
