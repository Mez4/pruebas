using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.Referencias")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Referencias
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("numeroReferencia")]
        public int numeroReferencia { get; set; }
      
        
        [Column("nombre")]
        public string nombre { get; set; }
      
        
        [Column("primerApellido")]
        public string primerApellido { get; set; }
      
        
        [Column("segundoApellido")]
        public string segundoApellido { get; set; }
      
        
        [Column("parentesco")]
        public string parentesco { get; set; }
      
        
        [Column("celular")]
        public string celular { get; set; }
      
        
        [Column("domicilio")]
        public string domicilio { get; set; }
      
        
        [Column("edad")]
        public string edad { get; set; }
      
        
        [Column("status")]
        public string status { get; set; }
      
        
        [Column("idDistribuidora")]
        public int? idDistribuidora { get; set; }


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
