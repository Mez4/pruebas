using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.CodigosTiendita")]
    [ExplicitColumns]
    [PrimaryKey("CodigoID")]
    public class CodigosTiendita
    {
              
        
        [Column("CodigoID")]
        public int CodigoID { get; set; }
      
        [Column("Codigo")]
        public string Codigo { get; set; }
        
        [Column("SKU")]
        public Int64 SKU { get; set; }
      
        
        [Column("Descuento")]
        public int Descuento { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }
      
        
        [Column("Motivo")]
        public string Motivo { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("PersonaRegistraID")]
        public Int64 PersonaRegistraID { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }
      
        
        [Column("FechaRegistra")]
        public DateTime FechaRegistra { get; set; }
      
        
        [Column("PersonaModificaID")]
        public Int64? PersonaModificaID { get; set; }
      
        
        [Column("UsuarioModificaID")]
        public int? UsuarioModificaID { get; set; }
      
        
        [Column("FechaModifica")]
        public DateTime? FechaModifica { get; set; }
      
        
        [Column("PersonaCancelaID")]
        public Int64? PersonaCancelaID { get; set; }
      
        
        [Column("UsuarioCancelaID")]
        public int? UsuarioCancelaID { get; set; }
      
        
        [Column("FechaCancela")]
        public DateTime? FechaCancela { get; set; }


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
