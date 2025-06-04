using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ContratosRPM")]
    [ExplicitColumns]
    [PrimaryKey("ContratoID")]
    public class ContratosRPM
    {
              
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("empresaId")]
        public int empresaId { get; set; }
      
        
        [Column("ContratoRPM")]
        public int ContratoRPM { get; set; }
      
        
        [Column("RazonSocial")]
        public string RazonSocial { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }
      
        
        [Column("UsuarioModificaID")]
        public int? UsuarioModificaID { get; set; }
      
        
        [Column("FechaAlta")]
        public DateTime FechaAlta { get; set; }
      
        
        [Column("FechaModifica")]
        public DateTime? FechaModifica { get; set; }


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
