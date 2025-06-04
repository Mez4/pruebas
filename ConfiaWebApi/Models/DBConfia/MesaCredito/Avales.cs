using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.Avales")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class Avales
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idProspecto")]
        public int idProspecto { get; set; }
      
        
        [Column("nombre")]
        public string nombre { get; set; }
      
        
        [Column("primerApellido")]
        public string primerApellido { get; set; }
      
        
        [Column("rfc")]
        public string rfc { get; set; }
      
        
        [Column("segundoApellido")]
        public string segundoApellido { get; set; }
      
        
        [Column("fechaNacimiento")]
        public DateTime fechaNacimiento { get; set; }
      
        
        [Column("idSexo")]
        public string idSexo { get; set; }
      
        
        [Column("curp")]
        public string curp { get; set; }
      
        
        [Column("correo")]
        public string correo { get; set; }
      
        
        [Column("telefono")]
        public string telefono { get; set; }
      
        
        [Column("celular")]
        public string celular { get; set; }
      
        
        [Column("idEstadoCivil")]
        public int idEstadoCivil { get; set; }
      
        
        [Column("dependientesEconomicos")]
        public string dependientesEconomicos { get; set; }
      
        
        [Column("nombreConyuge")]
        public string nombreConyuge { get; set; }
      
        
        [Column("parentesco")]
        public string parentesco { get; set; }
      
        
        [Column("status")]
        public string status { get; set; }


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
