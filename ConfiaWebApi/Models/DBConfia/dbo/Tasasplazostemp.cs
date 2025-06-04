using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.tasasPlazosTemp")]
    [ExplicitColumns]
    [PrimaryKey("DetalleID")]
    public class tasasPlazosTemp
    {
              
        
        [Column("DetalleID")]
        public int DetalleID { get; set; }
      
        
        [Column("Renglon")]
        public int? Renglon { get; set; }
      
        
        [Column("TabuladorTasa")]
        public int TabuladorTasa { get; set; }
      
        
        [Column("IdentificadorId")]
        public int IdentificadorId { get; set; }
      
        
        [Column("Nivel")]
        public string Nivel { get; set; }
      
        
        [Column("plazosMin")]
        public int plazosMin { get; set; }
      
        
        [Column("plazosMax")]
        public int plazosMax { get; set; }
      
        
        [Column("importeMin")]
        public decimal importeMin { get; set; }
      
        
        [Column("importeMax")]
        public decimal importeMax { get; set; }
      
        
        [Column("tasa")]
        public decimal tasa { get; set; }
      
        
        [Column("seguroPlazo")]
        public decimal seguroPlazo { get; set; }
      
        
        [Column("cat")]
        public decimal cat { get; set; }
      
        
        [Column("activo")]
        public bool? activo { get; set; }
      
        
        [Column("plazosEspeciales")]
        public bool? plazosEspeciales { get; set; }


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
