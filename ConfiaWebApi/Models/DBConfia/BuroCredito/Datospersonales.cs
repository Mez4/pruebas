using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.DatosPersonales")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class DatosPersonales
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("rfc")]
        public string rfc { get; set; }
      
        
        [Column("fechaNacimiento")]
        public string fechaNacimiento { get; set; }
      
        
        [Column("apellidoMaterno")]
        public string apellidoMaterno { get; set; }
      
        
        [Column("apellidoPaterno")]
        public string apellidoPaterno { get; set; }
      
        
        [Column("primerNombre")]
        public string primerNombre { get; set; }
      
        
        [Column("segundoNombre")]
        public string segundoNombre { get; set; }
      
        
        [Column("nacionalidad")]
        public string nacionalidad { get; set; }
      
        
        [Column("sexo")]
        public string sexo { get; set; }
      
        
        [Column("residencia")]
        public string residencia { get; set; }


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
