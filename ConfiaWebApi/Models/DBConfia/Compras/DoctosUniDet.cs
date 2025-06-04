using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.doctos_uni_det")]
    [ExplicitColumns]
    [PrimaryKey("docto_uni_id_det")]
    public class doctos_uni_det
    {
              
        
        [Column("docto_uni_id_det")]
        public int docto_uni_id_det { get; set; }
      
        
        [Column("docto_uni_id")]
        public int? docto_uni_id { get; set; }
      
        
        [Column("tipo_id")]
        public int? tipo_id { get; set; }
      
        
        [Column("corte_id")]
        public int? corte_id { get; set; }
      
        
        [Column("talla_id")]
        public int? talla_id { get; set; }
      
        
        [Column("color_id")]
        public int? color_id { get; set; }
      
        
        [Column("cantidad_solicitada")]
        public int? cantidad_solicitada { get; set; }
      
        
        [Column("cantidad_aprobada")]
        public int? cantidad_aprobada { get; set; }
      
        
        [Column("cantidad_recepcion")]
        public int? cantidad_recepcion { get; set; }


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
