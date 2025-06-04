using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.DistribuidoresDiasAtrasos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DistribuidoresDiasAtrasos_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("DistribuidorDesc")]
        public string DistribuidorDesc { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("SucursalDesc")]
        public string SucursalDesc { get; set; }
      
        
        [Column("Sucursal")]
        public string Sucursal { get; set; }
      
        
        [Column("DiasAtraso")]
        public int DiasAtraso { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ProductoIDGrupo")]
        public int? ProductoIDGrupo { get; set; }
      
        
        [Column("GestorId")]
        public Int64 GestorId { get; set; }
      
        
        [Column("GestorDesc")]
        public string GestorDesc { get; set; }
      
        
        [Column("ColorAsignaGestor")]
        public string ColorAsignaGestor { get; set; }
      
        
        [Column("ColorReferencias")]
        public string ColorReferencias { get; set; }
      
        
        [Column("ColorReferenciasAvales")]
        public string ColorReferenciasAvales { get; set; }
      
        
        [Column("ColorAsignaCobranza")]
        public string ColorAsignaCobranza { get; set; }
      
        
        [Column("Grupo")]
        public string Grupo { get; set; }
      
        
        [Column("ClasificadorGrupoID")]
        public int? ClasificadorGrupoID { get; set; }
      
        
        [Column("TipoCobranzaID")]
        public int TipoCobranzaID { get; set; }
      
        
        [Column("TipoCobranzaDescCorto")]
        public string TipoCobranzaDescCorto { get; set; }
      
        
        [Column("TipoCobranzaDescLargo")]
        public string TipoCobranzaDescLargo { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("AsignGestorMesaCobranzaID")]
        public int AsignGestorMesaCobranzaID { get; set; }
      
        
        [Column("AsignGestorMesaCobranzaDesc")]
        public string AsignGestorMesaCobranzaDesc { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int MesaCobranzaID { get; set; }
      
        
        [Column("MesaCobranzaDesc")]
        public string MesaCobranzaDesc { get; set; }
      
        
        [Column("MotivoID")]
        public int MotivoID { get; set; }
      
        
        [Column("Motivo")]
        public string Motivo { get; set; }
      
        
        [Column("idRelMesaCredProd")]
        public int? idRelMesaCredProd { get; set; }
      
        
        [Column("FechaHoraAsignacion")]
        public DateTime? FechaHoraAsignacion { get; set; }


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
