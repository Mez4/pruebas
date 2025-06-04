using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Pagos
{
    [TableName("Pagos.VW_rpmmxSTPResponse")]
    [ExplicitColumns]
    // View, no primary key needed
    public class VW_rpmmxSTPResponse
    {
              
        
        [Column("rmpmxSTPresponseId")]
        public Int64 rmpmxSTPresponseId { get; set; }
      
        
        [Column("reference")]
        public string reference { get; set; }
      
        
        [Column("barCode")]
        public string barCode { get; set; }
      
        
        [Column("payFormat")]
        public string payFormat { get; set; }
      
        
        [Column("message")]
        public string message { get; set; }
      
        
        [Column("error")]
        public string error { get; set; }
      
        
        [Column("folio")]
        public Int64? folio { get; set; }
      
        
        [Column("dateResponse")]
        public DateTime dateResponse { get; set; }
      
        
        [Column("clabeInterbancaria")]
        public string clabeInterbancaria { get; set; }
      
        
        [Column("account")]
        public string account { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime fhRegistro { get; set; }
      
        
        [Column("usuario")]
        public string usuario { get; set; }
      
        
        [Column("empresa")]
        public string empresa { get; set; }
      
        
        [Column("expirationDate")]
        public DateTime expirationDate { get; set; }
      
        
        [Column("refapl")]
        public int? refapl { get; set; }


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
