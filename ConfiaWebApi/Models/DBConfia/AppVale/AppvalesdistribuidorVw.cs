using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.AppValesDistribuidor_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AppValesDistribuidor_VW
    {
              
        
        [Column("ValeraID")]
        public Int64 ValeraID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("serieId")]
        public Int64 serieId { get; set; }
      
        
        [Column("FolioInicial")]
        public Int64 FolioInicial { get; set; }
      
        
        [Column("FolioFinal")]
        public Int64 FolioFinal { get; set; }
      
        
        [Column("EstatusValera")]
        public string EstatusValera { get; set; }
      
        
        [Column("RegistroFecha")]
        public DateTime RegistroFecha { get; set; }
      
        
        [Column("AsignaSucursalId")]
        public int? AsignaSucursalId { get; set; }
      
        
        [Column("AsignaSucursalFecha")]
        public DateTime? AsignaSucursalFecha { get; set; }
      
        
        [Column("ReciboSucursalFecha")]
        public DateTime? ReciboSucursalFecha { get; set; }
      
        
        [Column("AsignaDistribudiorFecha")]
        public DateTime? AsignaDistribudiorFecha { get; set; }
      
        
        [Column("CanceladoFecha")]
        public DateTime? CanceladoFecha { get; set; }
      
        
        [Column("ValeraTrackingEstatusID")]
        public int ValeraTrackingEstatusID { get; set; }
      
        
        [Column("RegistroPersonaID")]
        public Int64 RegistroPersonaID { get; set; }
      
        
        [Column("ValeraCabeceraID")]
        public Int64 ValeraCabeceraID { get; set; }
      
        
        [Column("AsignaSucursalPersonaID")]
        public Int64? AsignaSucursalPersonaID { get; set; }
      
        
        [Column("ReciboSucursalPersonaID")]
        public Int64? ReciboSucursalPersonaID { get; set; }
      
        
        [Column("AsignaDistribudiorPersonaID")]
        public Int64? AsignaDistribudiorPersonaID { get; set; }
      
        
        [Column("CanceladoUsuarioIdPersonaID")]
        public Int64? CanceladoUsuarioIdPersonaID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("EnvioSucursalPersonaID")]
        public Int64? EnvioSucursalPersonaID { get; set; }
      
        
        [Column("EnvioSucursalFecha")]
        public DateTime? EnvioSucursalFecha { get; set; }
      
        
        [Column("EnvioSucursalNota")]
        public string EnvioSucursalNota { get; set; }
      
        
        [Column("ReciboSucursalNota")]
        public string ReciboSucursalNota { get; set; }
      
        
        [Column("CodigoBarras")]
        public string CodigoBarras { get; set; }
      
        
        [Column("SubidaArchivoPersonaID")]
        public Int64? SubidaArchivoPersonaID { get; set; }
      
        
        [Column("SubidaArchivoFecha")]
        public DateTime? SubidaArchivoFecha { get; set; }
      
        
        [Column("SucursalEnviaValera")]
        public int? SucursalEnviaValera { get; set; }
      
        
        [Column("SubidaArchivoPath")]
        public string SubidaArchivoPath { get; set; }
      
        
        [Column("AsignaDistribudiorUsuarioId")]
        public int? AsignaDistribudiorUsuarioId { get; set; }
      
        
        [Column("AsignaSucursalUsuarioId")]
        public int? AsignaSucursalUsuarioId { get; set; }
      
        
        [Column("CanceladoUsuarioId")]
        public int? CanceladoUsuarioId { get; set; }
      
        
        [Column("EnvioSucursalUsuarioId")]
        public int? EnvioSucursalUsuarioId { get; set; }
      
        
        [Column("ReciboSucursalUsuarioId")]
        public int? ReciboSucursalUsuarioId { get; set; }
      
        
        [Column("RegistroUsuarioId")]
        public int RegistroUsuarioId { get; set; }
      
        
        [Column("SubidaArchivoUsuarioId")]
        public int? SubidaArchivoUsuarioId { get; set; }
      
        
        [Column("Folio")]
        public Int64 Folio { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("DigitalFolio")]
        public string DigitalFolio { get; set; }
      
        
        [Column("DigitalImporte")]
        public decimal DigitalImporte { get; set; }
      
        
        [Column("DigitalPlazo")]
        public int DigitalPlazo { get; set; }
      
        
        [Column("DigitalTipoDesembolsoId")]
        public int? DigitalTipoDesembolsoId { get; set; }
      
        
        [Column("AdicProductoId")]
        public int? AdicProductoId { get; set; }
      
        
        [Column("AdicImporte")]
        public decimal AdicImporte { get; set; }
      
        
        [Column("CanjeFecha")]
        public DateTime? CanjeFecha { get; set; }
      
        
        [Column("CanjePersonaID")]
        public Int64? CanjePersonaID { get; set; }
      
        
        [Column("CanceladoPersonaID")]
        public Int64? CanceladoPersonaID { get; set; }
      
        
        [Column("CanjeUsuarioId")]
        public int? CanjeUsuarioId { get; set; }
      
        
        [Column("ValeDigital")]
        public bool ValeDigital { get; set; }


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
