using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.InformacionOtraVivienda")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class InformacionOtraVivienda
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idPersona")]
        public int idPersona { get; set; }
      
        
        [Column("idTipoPersona")]
        public int idTipoPersona { get; set; }
      
        
        [Column("idTipoVivienda")]
        public int idTipoVivienda { get; set; }
      
        
        [Column("idAsentamiento")]
        public int idAsentamiento { get; set; }
      
        
        [Column("calle")]
        public string calle { get; set; }
      
        
        [Column("numero")]
        public string numero { get; set; }
      
        
        [Column("localidad")]
        public string localidad { get; set; }
      
        
        [Column("direccion")]
        public string direccion { get; set; }
      
        
        [Column("valorAproximado")]
        public decimal valorAproximado { get; set; }


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
