using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Global_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Global_VW
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("GrupoID")]
        public int GrupoID { get; set; }
      
        
        [Column("EstatusDetalleGrupo")]
        public bool EstatusDetalleGrupo { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("ClasificadorGrupoID")]
        public int ClasificadorGrupoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64 CoordinadorID { get; set; }
      
        
        [Column("Coordinador")]
        public string Coordinador { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("ZonaID")]
        public int ZonaID { get; set; }
      
        
        [Column("ZonaNombre")]
        public string ZonaNombre { get; set; }
      
        
        [Column("PersonaResponsableID")]
        public Int64? PersonaResponsableID { get; set; }
      
        
        [Column("DirectorID")]
        public Int64 DirectorID { get; set; }
      
        
        [Column("NombreDirector")]
        public string NombreDirector { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("DistribuidorNivel")]
        public string DistribuidorNivel { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistribuidoresEstatus")]
        public string DistribuidoresEstatus { get; set; }
      
        
        [Column("LimiteDeCredito")]
        public decimal LimiteDeCredito { get; set; }
      
        
        [Column("Disponible")]
        public decimal? Disponible { get; set; }
      
        
        [Column("PorcColocacionLimite")]
        public decimal? PorcColocacionLimite { get; set; }
      
        
        [Column("CreditosActivos")]
        public int CreditosActivos { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("Cartera")]
        public decimal? Cartera { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal? SaldoAtrasado { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("PagosAtrasados")]
        public int? PagosAtrasados { get; set; }
      
        
        [Column("CreditosAtrasados")]
        public int? CreditosAtrasados { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }
      
        
        [Column("Colocado")]
        public decimal? Colocado { get; set; }
      
        
        [Column("Interes")]
        public decimal? Interes { get; set; }
      
        
        [Column("Seguro")]
        public decimal? Seguro { get; set; }
      
        
        [Column("CapLiquidado")]
        public decimal? CapLiquidado { get; set; }
      
        
        [Column("CarteraEnRiesgo")]
        public decimal? CarteraEnRiesgo { get; set; }
      
        
        [Column("saldoEnRiesgo")]
        public decimal? saldoEnRiesgo { get; set; }
      
        
        [Column("DiasDesdeUltPago")]
        public int? DiasDesdeUltPago { get; set; }
      
        
        [Column("FechaUltimoPago")]
        public DateTime? FechaUltimoPago { get; set; }
      
        
        [Column("numCreditosPersonales")]
        public int numCreditosPersonales { get; set; }
      
        
        [Column("saldoPresPersonal")]
        public int saldoPresPersonal { get; set; }
      
        
        [Column("UltimaRelacionFecha")]
        public DateTime? UltimaRelacionFecha { get; set; }
      
        
        [Column("UltRelacionImporte")]
        public decimal? UltRelacionImporte { get; set; }
      
        
        [Column("fechaUltimoVale")]
        public DateTime? fechaUltimoVale { get; set; }
      
        
        [Column("Recuperado")]
        public decimal? Recuperado { get; set; }
      
        
        [Column("DistEstColor")]
        public string DistEstColor { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("EmpresaId")]
        public int EmpresaId { get; set; }
      
        
        [Column("CortesAtrasados")]
        public int? CortesAtrasados { get; set; }
      
        
        [Column("CapitalLiq")]
        public decimal? CapitalLiq { get; set; }
      
        
        [Column("PagadoCorte")]
        public decimal? PagadoCorte { get; set; }


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
