using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Pagos
{
    [TableName("Pagos.referenciaOxxo")]
    [ExplicitColumns]
    [PrimaryKey("solicitudRefID")]
    public class referenciaOxxo
    {
              
        
        [Column("solicitudRefID")]
        public Int64 solicitudRefID { get; set; }
      
        
        [Column("nombre")]
        public string nombre { get; set; }
      
        
        [Column("referencia")]
        public string referencia { get; set; }
      
        
        [Column("telefono")]
        public string telefono { get; set; }
      
        
        [Column("email")]
        public string email { get; set; }
      
        
        [Column("corporate")]
        public bool corporate { get; set; }
      
        
        [Column("expires_at")]
        public DateTime expires_at { get; set; }
      
        
        [Column("tipProducto")]
        public int tipProducto { get; set; }
      
        
        [Column("referenciaProducto")]
        public Int64 referenciaProducto { get; set; }
      
        
        [Column("url_barcode")]
        public string url_barcode { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime fhRegistro { get; set; }
      
        
        [Column("fhActualizacion")]
        public DateTime fhActualizacion { get; set; }
      
        
        [Column("parent_id")]
        public string parent_id { get; set; }
      
        
        [Column("id_oxxo")]
        public string id_oxxo { get; set; }
      
        
        [Column("estatusID")]
        public string estatusID { get; set; }
      
        
        [Column("intentos")]
        public int intentos { get; set; }


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
