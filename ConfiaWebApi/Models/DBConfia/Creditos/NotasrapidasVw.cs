using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.NotasRapidas_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class NotasRapidas_VW
    {
              
        
        [Column("NotaRapidaID")]
        public int NotaRapidaID { get; set; }
      
        
        [Column("TipoNotasDesc")]
        public string TipoNotasDesc { get; set; }
      
        
        [Column("DistribuidorID")]
        public int? DistribuidorID { get; set; }
      
        
        [Column("Emisor")]
        public string Emisor { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }
      
        
        [Column("UsuarioRegistra")]
        public int? UsuarioRegistra { get; set; }


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
