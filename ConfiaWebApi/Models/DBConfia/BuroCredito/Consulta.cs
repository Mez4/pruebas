using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.Consulta")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Consulta
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idDatosPersonales")]
        public int idDatosPersonales { get; set; }
      
        
        [Column("rutaConsulta")]
        public string rutaConsulta { get; set; }
      
        
        [Column("rutaRespuesta")]
        public string rutaRespuesta { get; set; }
      
        
        [Column("error")]
        public string error { get; set; }
      
        
        [Column("DeclaracionConsumidor")]
        public string DeclaracionConsumidor { get; set; }
      
        
        [Column("comentario")]
        public string comentario { get; set; }


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
