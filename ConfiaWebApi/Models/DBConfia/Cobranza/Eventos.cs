using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.Eventos")]
    [ExplicitColumns]
    [PrimaryKey("EventoID")]
    public class Eventos
    {
              
        
        [Column("EventoID")]
        public int EventoID { get; set; }
      
        
        [Column("ClaveEvento")]
        public string ClaveEvento { get; set; }
      
        
        [Column("DescripcionEvento")]
        public string DescripcionEvento { get; set; }
      
        
        [Column("UsuarioID")]
        public Int64 UsuarioID { get; set; }


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
