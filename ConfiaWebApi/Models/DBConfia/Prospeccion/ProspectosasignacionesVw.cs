using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.ProspectosAsignaciones_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProspectosAsignaciones_VW
    {
              
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("ProspectoNombre")]
        public string ProspectoNombre { get; set; }
      
        
        [Column("PromotorUsuarioID")]
        public int PromotorUsuarioID { get; set; }
      
        
        [Column("PromotorPersonaID")]
        public Int64 PromotorPersonaID { get; set; }
      
        
        [Column("PromotorNombre")]
        public string PromotorNombre { get; set; }
      
        
        [Column("AnalistaBuroUsuarioID")]
        public int? AnalistaBuroUsuarioID { get; set; }
      
        
        [Column("AnalistaBuroPersonaID")]
        public Int64? AnalistaBuroPersonaID { get; set; }
      
        
        [Column("AnalistaBuroNombre")]
        public string AnalistaBuroNombre { get; set; }
      
        
        [Column("AnalistaMesaUsuarioID")]
        public int? AnalistaMesaUsuarioID { get; set; }
      
        
        [Column("AnalistaMesaPersonaID")]
        public Int64? AnalistaMesaPersonaID { get; set; }
      
        
        [Column("AnalistaMesaNombre")]
        public string AnalistaMesaNombre { get; set; }
      
        
        [Column("AnalistaLlamadaUsuarioID")]
        public int? AnalistaLlamadaUsuarioID { get; set; }
      
        
        [Column("AnalistaLlamadaPersonaID")]
        public Int64? AnalistaLlamadaPersonaID { get; set; }
      
        
        [Column("AnalistaLlamadaNombre")]
        public string AnalistaLlamadaNombre { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }


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
