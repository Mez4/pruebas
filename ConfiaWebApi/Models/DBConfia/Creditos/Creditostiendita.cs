using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.CreditosTiendita")]
    [ExplicitColumns]
    [PrimaryKey("CreditoID,id_sku", AutoIncrement=false)]
    public class CreditosTiendita
    {
              
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("id_sku")]
        public Int64 id_sku { get; set; }
      
        
        [Column("id_ticket")]
        public Int64 id_ticket { get; set; }
      
        
        [Column("UsuarioRegistroID")]
        public int UsuarioRegistroID { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }
      
        
        [Column("UsuarioCancelacionID")]
        public int? UsuarioCancelacionID { get; set; }
      
        
        [Column("FechaHoraCancelacion")]
        public DateTime? FechaHoraCancelacion { get; set; }


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
