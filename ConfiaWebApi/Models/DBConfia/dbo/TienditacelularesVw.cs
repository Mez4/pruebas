using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.TienditaCelulares_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class TienditaCelulares_VW
    {
              
        
        [Column("id_empresa")]
        public int id_empresa { get; set; }
      
        
        [Column("id_sku")]
        public int id_sku { get; set; }
      
        
        [Column("id_padre")]
        public int id_padre { get; set; }
      
        
        [Column("id_estructura")]
        public int id_estructura { get; set; }
      
        
        [Column("marca")]
        public string marca { get; set; }
      
        
        [Column("estilo")]
        public string estilo { get; set; }
      
        
        [Column("color")]
        public string color { get; set; }
      
        
        [Column("id_composicion")]
        public int id_composicion { get; set; }
      
        
        [Column("id_corrida")]
        public int id_corrida { get; set; }
      
        
        [Column("id_talla")]
        public int id_talla { get; set; }
      
        
        [Column("id_tipo_category")]
        public int id_tipo_category { get; set; }
      
        
        [Column("fecha_captura")]
        public DateTime fecha_captura { get; set; }
      
        
        [Column("fecha_llegada")]
        public DateTime fecha_llegada { get; set; }
      
        
        [Column("sw_estatus")]
        public int sw_estatus { get; set; }
      
        
        [Column("codigo_barras")]
        public string codigo_barras { get; set; }
      
        
        [Column("referencia")]
        public string referencia { get; set; }
      
        
        [Column("iva")]
        public decimal iva { get; set; }
      
        
        [Column("fum")]
        public DateTime fum { get; set; }


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
