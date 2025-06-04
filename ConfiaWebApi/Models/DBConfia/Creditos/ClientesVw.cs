using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.Clientes_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Clientes_VW
    {
              
        
        [Column("ClienteID")]
        public Int64 ClienteID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("LineaCreditoPersonal")]
        public decimal? LineaCreditoPersonal { get; set; }
      
        
        [Column("PagareEstatusId")]
        public int? PagareEstatusId { get; set; }
      
        
        [Column("CanjeaVale")]
        public bool? CanjeaVale { get; set; }
      
        
        [Column("PagareCantidad")]
        public decimal? PagareCantidad { get; set; }
      
        
        [Column("CreacionPersonaID")]
        public Int64? CreacionPersonaID { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime? CreacionFecha { get; set; }
      
        
        [Column("IdentificadorAnterior")]
        public string IdentificadorAnterior { get; set; }
      
        
        [Column("CreacionUsuarioID")]
        public int? CreacionUsuarioID { get; set; }
      
        
        [Column("FechaUltimoCredito")]
        public DateTime? FechaUltimoCredito { get; set; }
      
        
        [Column("pagareEstatusDesc")]
        public string pagareEstatusDesc { get; set; }
      
        
        [Column("NombreDistribuidor")]
        public string NombreDistribuidor { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("ApellidoPaterno")]
        public string ApellidoPaterno { get; set; }
      
        
        [Column("ApellidoMaterno")]
        public string ApellidoMaterno { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }
      
        
        [Column("LugarNacimiento")]
        public string LugarNacimiento { get; set; }
      
        
        [Column("CURP")]
        public string CURP { get; set; }
      
        
        [Column("RFC")]
        public string RFC { get; set; }
      
        
        [Column("SexoID")]
        public string SexoID { get; set; }
      
        
        [Column("EstadoCivilID")]
        public string EstadoCivilID { get; set; }
      
        
        [Column("IngresosMensuales")]
        public decimal IngresosMensuales { get; set; }
      
        
        [Column("DependientesEconomicos")]
        public int? DependientesEconomicos { get; set; }
      
        
        [Column("TelefonoDomicilio")]
        public string TelefonoDomicilio { get; set; }
      
        
        [Column("TelefonoMovil")]
        public string TelefonoMovil { get; set; }
      
        
        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }
      
        
        [Column("NombreConyuge")]
        public string NombreConyuge { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("DistribuidorID")]
        public int? DistribuidorID { get; set; }
      
        
        [Column("EsttausId")]
        public bool? EsttausId { get; set; }
      
        
        [Column("Sexo")]
        public string Sexo { get; set; }
      
        
        [Column("Escolaridad")]
        public string Escolaridad { get; set; }
      
        
        [Column("EstadoCivil")]
        public string EstadoCivil { get; set; }
      
        
        [Column("EscolaridadID")]
        public int? EscolaridadID { get; set; }
      
        
        [Column("BuroInternoEstatusID")]
        public int? BuroInternoEstatusID { get; set; }
      
        
        [Column("BuroInternoEstatus")]
        public string BuroInternoEstatus { get; set; }
      
        
        [Column("BuroInternoEstatusPuedeCanjear")]
        public bool? BuroInternoEstatusPuedeCanjear { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("identificacionTipoId")]
        public int? identificacionTipoId { get; set; }
      
        
        [Column("identificacionTipo")]
        public string identificacionTipo { get; set; }
      
        
        [Column("identificacionNumero")]
        public string identificacionNumero { get; set; }
      
        
        [Column("canjeValeSolicitudId")]
        public Int64? canjeValeSolicitudId { get; set; }
      
        
        [Column("BuroInternoColor")]
        public string BuroInternoColor { get; set; }


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
