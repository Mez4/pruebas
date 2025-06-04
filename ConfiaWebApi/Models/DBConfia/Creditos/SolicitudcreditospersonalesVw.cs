using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.SolicitudCreditosPersonales_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SolicitudCreditosPersonales_VW
    {
              
        
        [Column("SolicitudCreditosPersonalesID")]
        public int SolicitudCreditosPersonalesID { get; set; }
      
        
        [Column("ProductoId")]
        public int ProductoId { get; set; }
      
        
        [Column("SucursalId")]
        public int SucursalId { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }
      
        
        [Column("DistribuidorId")]
        public Int64 DistribuidorId { get; set; }
      
        
        [Column("PersonaNombre")]
        public string PersonaNombre { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("Plazos")]
        public int Plazos { get; set; }
      
        
        [Column("TipoDesembolsoID")]
        public int TipoDesembolsoID { get; set; }
      
        
        [Column("TipoDesembolso")]
        public string TipoDesembolso { get; set; }
      
        
        [Column("Estatus")]
        public bool? Estatus { get; set; }
      
        
        [Column("FechaSolicita")]
        public DateTime FechaSolicita { get; set; }
      
        
        [Column("UsuarioSolicitaID")]
        public int UsuarioSolicitaID { get; set; }
      
        
        [Column("UsuarioSolicita")]
        public string UsuarioSolicita { get; set; }
      
        
        [Column("PersonaSolicitaID")]
        public Int64 PersonaSolicitaID { get; set; }
      
        
        [Column("PersonaSolicita")]
        public string PersonaSolicita { get; set; }


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
