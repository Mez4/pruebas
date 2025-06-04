using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ValerasCosto")]
    [ExplicitColumns]
    [PrimaryKey("ValeraCostoID")]
    public class ValerasCosto
    {
              
        
        [Column("ValeraCostoID")]
        public int ValeraCostoID { get; set; }
      
        
        [Column("Costo")]
        public decimal Costo { get; set; }
      
        
        [Column("FechaRegistra")]
        public DateTime FechaRegistra { get; set; }
      
        
        [Column("PersonaRegistraID")]
        public Int64 PersonaRegistraID { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }
      
        
        [Column("FechaModifica")]
        public DateTime? FechaModifica { get; set; }
      
        
        [Column("PersonaModificaID")]
        public Int64? PersonaModificaID { get; set; }
      
        
        [Column("UsuarioModificaID")]
        public int? UsuarioModificaID { get; set; }


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
