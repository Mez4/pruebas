using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.InformacionLaboral")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class InformacionLaboral
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("tipoPersona")]
        public string tipoPersona { get; set; }
      
        
        [Column("empresa")]
        public string empresa { get; set; }
      
        
        [Column("puesto")]
        public string puesto { get; set; }
      
        
        [Column("sueldo")]
        public decimal sueldo { get; set; }
      
        
        [Column("antiguedad")]
        public string antiguedad { get; set; }
      
        
        [Column("telefono")]
        public string telefono { get; set; }
      
        
        [Column("calle")]
        public string calle { get; set; }
      
        
        [Column("numeroInterior")]
        public string numeroInterior { get; set; }
      
        
        [Column("numeroExterior")]
        public string numeroExterior { get; set; }
      
        
        [Column("idAsentamiento")]
        public int idAsentamiento { get; set; }
      
        
        [Column("localidad")]
        public string localidad { get; set; }
      
        
        [Column("cp")]
        public string cp { get; set; }


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
