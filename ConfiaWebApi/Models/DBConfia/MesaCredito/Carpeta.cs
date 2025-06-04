using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.Carpeta")]
    [ExplicitColumns]
    // No primary key detected
    public class Carpeta
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("carpeta")]
        public string carpeta { get; set; }
      
        
        [Column("productoId")]
        public int productoId { get; set; }
      
        
        [Column("estatusCreditoId")]
        public int estatusCreditoId { get; set; }
      
        
        [Column("solicitudCreditoId")]
        public int solicitudCreditoId { get; set; }
      
        
        [Column("fechaAlta")]
        public DateTime fechaAlta { get; set; }
      
        
        [Column("fechaMod")]
        public DateTime fechaMod { get; set; }
      
        
        [Column("fechaBaja")]
        public DateTime fechaBaja { get; set; }
      
        
        [Column("usuarioID")]
        public int usuarioID { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }


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
