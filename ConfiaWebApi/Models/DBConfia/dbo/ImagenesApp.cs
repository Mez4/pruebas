using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.imagenes_app")]
    [ExplicitColumns]
    // No primary key detected
    public class imagenes_app
    {
              
        
        [Column("id_empresa")]
        public string id_empresa { get; set; }
      
        
        [Column("tabla")]
        public string tabla { get; set; }
      
        
        [Column("movimiento")]
        public string movimiento { get; set; }
      
        
        [Column("renglon")]
        public int? renglon { get; set; }
      
        
        [Column("fecha")]
        public DateTime? fecha { get; set; }
      
        
        [Column("id_usuario")]
        public string id_usuario { get; set; }
      
        
        [Column("foto")]
        public byte[] foto { get; set; }
      
        
        [Column("fum")]
        public DateTime? fum { get; set; }


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
