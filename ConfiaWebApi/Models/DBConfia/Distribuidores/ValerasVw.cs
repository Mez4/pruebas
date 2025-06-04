using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.Valeras_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Valeras_VW
    {
              
        
        [Column("ValeraID")]
        public Int64 ValeraID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("serieId")]
        public Int64 serieId { get; set; }
      
        
        [Column("serie")]
        public string serie { get; set; }
      
        
        [Column("serieDesc")]
        public string serieDesc { get; set; }
      
        
        [Column("FolioInicial")]
        public Int64 FolioInicial { get; set; }
      
        
        [Column("FolioFinal")]
        public Int64 FolioFinal { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("RegistroFecha")]
        public DateTime RegistroFecha { get; set; }
      
        
        [Column("RegistroUsuarioId")]
        public int RegistroUsuarioId { get; set; }
      
        
        [Column("AsignaSucursalId")]
        public int? AsignaSucursalId { get; set; }
      
        
        [Column("AsignaSucursalUsuarioId")]
        public int? AsignaSucursalUsuarioId { get; set; }
      
        
        [Column("ReciboSucursalUsuarioId")]
        public int? ReciboSucursalUsuarioId { get; set; }
      
        
        [Column("AsignaDistribudiorUsuarioId")]
        public int? AsignaDistribudiorUsuarioId { get; set; }
      
        
        [Column("CanceladoUsuarioId")]
        public int? CanceladoUsuarioId { get; set; }
      
        
        [Column("ValeraTrackingEstatusID")]
        public int ValeraTrackingEstatusID { get; set; }
      
        
        [Column("TrackingEstatus")]
        public string TrackingEstatus { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Color")]
        public string Color { get; set; }
      
        
        [Column("EnvioSucursalNota")]
        public string EnvioSucursalNota { get; set; }
      
        
        [Column("ReciboSucursalNota")]
        public string ReciboSucursalNota { get; set; }
      
        
        [Column("CodigoBarras")]
        public string CodigoBarras { get; set; }
      
        
        [Column("SucursalEnviaValera")]
        public int? SucursalEnviaValera { get; set; }
      
        
        [Column("SucNombre")]
        public string SucNombre { get; set; }
      
        
        [Column("DiasDeEntregaAprox")]
        public int? DiasDeEntregaAprox { get; set; }
      
        
        [Column("EnvioSucursalFecha")]
        public DateTime? EnvioSucursalFecha { get; set; }
      
        
        [Column("SucEnviaNombre")]
        public string SucEnviaNombre { get; set; }
      
        
        [Column("ValeraCabeceraID")]
        public Int64 ValeraCabeceraID { get; set; }


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
