using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ValeraCostos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ValeraCostos_VW
    {
              
        
        [Column("ValeraCostoID")]
        public int ValeraCostoID { get; set; }
      
        
        [Column("Costo")]
        public decimal Costo { get; set; }
      
        
        [Column("FechaRegistra")]
        public DateTime FechaRegistra { get; set; }
      
        
        [Column("PersonaRegistraID")]
        public Int64 PersonaRegistraID { get; set; }
      
        
        [Column("PersonaRegistra")]
        public string PersonaRegistra { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }
      
        
        [Column("UsuarioRegistra")]
        public string UsuarioRegistra { get; set; }
      
        
        [Column("FechaModifica")]
        public DateTime? FechaModifica { get; set; }
      
        
        [Column("PersonaModificaID")]
        public Int64? PersonaModificaID { get; set; }
      
        
        [Column("PersonaModifica")]
        public string PersonaModifica { get; set; }
      
        
        [Column("UsuarioModificaID")]
        public int? UsuarioModificaID { get; set; }
      
        
        [Column("UsuarioModifica")]
        public string UsuarioModifica { get; set; }


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
