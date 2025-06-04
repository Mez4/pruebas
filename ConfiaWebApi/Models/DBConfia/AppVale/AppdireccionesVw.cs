using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.AppDirecciones_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AppDirecciones_VW
    {
              
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("calle")]
        public string calle { get; set; }
      
        
        [Column("numExterior")]
        public string numExterior { get; set; }
      
        
        [Column("numInterior")]
        public string numInterior { get; set; }
      
        
        [Column("colonia")]
        public string colonia { get; set; }
      
        
        [Column("CodigoPostal")]
        public int CodigoPostal { get; set; }
      
        
        [Column("Municipio")]
        public string Municipio { get; set; }
      
        
        [Column("Ciudad")]
        public string Ciudad { get; set; }
      
        
        [Column("Estado")]
        public string Estado { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }


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
