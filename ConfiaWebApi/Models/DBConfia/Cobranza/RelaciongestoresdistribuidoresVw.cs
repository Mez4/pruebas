using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.RelacionGestoresDistribuidores_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RelacionGestoresDistribuidores_VW
    {
              
        
        [Column("GestorID")]
        public Int64 GestorID { get; set; }
      
        
        [Column("GestorDesc")]
        public string GestorDesc { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("DistribuidorDesc")]
        public string DistribuidorDesc { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("SucursaDesc")]
        public string SucursaDesc { get; set; }
      
        
        [Column("Grupo")]
        public string Grupo { get; set; }
      
        
        [Column("ClasificadorGrupoID")]
        public int? ClasificadorGrupoID { get; set; }
      
        
        [Column("FechaAsignacion")]
        public DateTime FechaAsignacion { get; set; }
      
        
        [Column("DiasAtrasoAsignado")]
        public int? DiasAtrasoAsignado { get; set; }
      
        
        [Column("DiasAtraso")]
        public int DiasAtraso { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ProductoIDGrupo")]
        public int? ProductoIDGrupo { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("ColorTicket")]
        public string ColorTicket { get; set; }
      
        
        [Column("ColorReferencias")]
        public string ColorReferencias { get; set; }
      
        
        [Column("ColorReferenciasAvales")]
        public string ColorReferenciasAvales { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("ConvenioID")]
        public Int64? ConvenioID { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("EstatusId")]
        public int? EstatusId { get; set; }
      
        
        [Column("EstatusDesc")]
        public string EstatusDesc { get; set; }
      
        
        [Column("ColorEstConv")]
        public string ColorEstConv { get; set; }
      
        
        [Column("EmpresaId")]
        public int EmpresaId { get; set; }
      
        
        [Column("empresaNombre")]
        public string empresaNombre { get; set; }


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
