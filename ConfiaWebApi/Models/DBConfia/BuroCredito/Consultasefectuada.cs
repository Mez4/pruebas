using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.BuroCredito
{
    [TableName("BuroCredito.ConsultasEfectuada")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class ConsultasEfectuada
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("idConsulta")]
        public int idConsulta { get; set; }
      
        
        [Column("FechaConsulta")]
        public Int64 FechaConsulta { get; set; }
      
        
        [Column("IdentificacionBuro")]
        public Int64 IdentificacionBuro { get; set; }
      
        
        [Column("ClaveOtorgante")]
        public string ClaveOtorgante { get; set; }
      
        
        [Column("NombreOtorgante")]
        public string NombreOtorgante { get; set; }
      
        
        [Column("TelefonoOtorgante")]
        public Int64 TelefonoOtorgante { get; set; }
      
        
        [Column("TipoContrato")]
        public string TipoContrato { get; set; }
      
        
        [Column("ClaveUnidadMonetaria")]
        public string ClaveUnidadMonetaria { get; set; }
      
        
        [Column("ImporteContrato")]
        public Int64 ImporteContrato { get; set; }
      
        
        [Column("IndicadorTipoResponsabilidad")]
        public string IndicadorTipoResponsabilidad { get; set; }
      
        
        [Column("ConsumidorNuevo")]
        public string ConsumidorNuevo { get; set; }
      
        
        [Column("ResultadoFinal")]
        public string ResultadoFinal { get; set; }
      
        
        [Column("IdentificadorOrigenConsulta")]
        public string IdentificadorOrigenConsulta { get; set; }


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
