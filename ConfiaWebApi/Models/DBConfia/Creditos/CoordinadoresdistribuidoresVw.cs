using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.CoordinadoresDistribuidores_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CoordinadoresDistribuidores_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("NoCreditosActivos")]
        public int NoCreditosActivos { get; set; }
      
        
        [Column("FechaHoraRegistro")]
        public DateTime FechaHoraRegistro { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int UsuarioIDRegistro { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("NumeroDist")]
        public string NumeroDist { get; set; }
      
        
        [Column("GestorID")]
        public Int64? GestorID { get; set; }
      
        
        [Column("ValidaContrato")]
        public bool ValidaContrato { get; set; }
      
        
        [Column("tipoRelacionID")]
        public int tipoRelacionID { get; set; }
      
        
        [Column("ReferenciaContable")]
        public int ReferenciaContable { get; set; }
      
        
        [Column("creditoPromotorId")]
        public Int64? creditoPromotorId { get; set; }
      
        
        [Column("validaContratoUsuarioId")]
        public int? validaContratoUsuarioId { get; set; }
      
        
        [Column("fechaHoraValidaContrato")]
        public DateTime? fechaHoraValidaContrato { get; set; }
      
        
        [Column("usuarioIdValidaContrato")]
        public int? usuarioIdValidaContrato { get; set; }
      
        
        [Column("numCreditosPersonales")]
        public int numCreditosPersonales { get; set; }
      
        
        [Column("PlazosEspeciales")]
        public bool? PlazosEspeciales { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("CoordinadorID")]
        public Int64 CoordinadorID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("fechaCorte")]
        public string fechaCorte { get; set; }
      
        
        [Column("saldoPlazo")]
        public decimal? saldoPlazo { get; set; }
      
        
        [Column("saldoAtrasado")]
        public decimal? saldoAtrasado { get; set; }
      
        
        [Column("pagosAtr")]
        public int? pagosAtr { get; set; }
        

        [Column("Cartera")]
        public decimal? Cartera { get; set; }

        [Column("MaxDiasAtr")]
        public int? MaxDiasAtr { get; set; }

        [Column("ResponsableNombre")]
        public string? ResponsableNombre { get; set; }


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
