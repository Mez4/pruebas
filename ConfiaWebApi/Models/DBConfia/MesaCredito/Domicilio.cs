using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.Domicilio")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Domicilio
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("calle")]
        public string calle { get; set; }
      
        
        [Column("numeroInterior")]
        public string numeroInterior { get; set; }
      
        
        [Column("numeroExterior")]
        public string numeroExterior { get; set; }
      
        
        [Column("colonia")]
        public string colonia { get; set; }
      
        
        [Column("localidad")]
        public string localidad { get; set; }
      
        
        [Column("cp")]
        public string cp { get; set; }
      
        
        [Column("municipio")]
        public string municipio { get; set; }
      
        
        [Column("estado")]
        public string estado { get; set; }


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
