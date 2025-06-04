using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ValerasCabecera_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ValerasCabecera_VW
    {
              
        
        [Column("ValeraCabeceraID")]
        public Int64 ValeraCabeceraID { get; set; }
      
        
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
      
        
        [Column("RegistroPersonaID")]
        public Int64 RegistroPersonaID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("serieId")]
        public Int64 serieId { get; set; }
      
        
        [Column("serie")]
        public string serie { get; set; }
      
        
        [Column("ValerasFraccionID")]
        public int ValerasFraccionID { get; set; }
      
        
        [Column("Fraccion")]
        public int Fraccion { get; set; }
      
        
        [Column("ValeraTrackingEstatusID")]
        public int ValeraTrackingEstatusID { get; set; }
      
        
        [Column("TrackingEstatus")]
        public string TrackingEstatus { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Color")]
        public string Color { get; set; }


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
