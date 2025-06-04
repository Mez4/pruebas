using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.LogMensajesNoLeidosProspectoApp_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class LogMensajesNoLeidosProspectoApp_VW
    {
              
        
        [Column("NoLeidos")]
        public int? NoLeidos { get; set; }
      
        
        [Column("NombreProspecto")]
        public string NombreProspecto { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("PromotorPersonaID")]
        public Int64 PromotorPersonaID { get; set; }
      
        
        [Column("PromotorUsuarioID")]
        public int PromotorUsuarioID { get; set; }
      
        
        [Column("PersonaAnalistaID")]
        public Int64? PersonaAnalistaID { get; set; }
      
        
        [Column("UsuarioAnalistaID")]
        public int? UsuarioAnalistaID { get; set; }
      
        
        [Column("PersonaAnalistaBUROID")]
        public Int64? PersonaAnalistaBUROID { get; set; }
      
        
        [Column("UsuarioAnalistaBuroID")]
        public int? UsuarioAnalistaBuroID { get; set; }
      
        
        [Column("PersonaAnalistaLlamadasID")]
        public Int64? PersonaAnalistaLlamadasID { get; set; }
      
        
        [Column("UsuarioAnalistaLlamadasID")]
        public int? UsuarioAnalistaLlamadasID { get; set; }


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
