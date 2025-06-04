using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.SucursalesFisicas_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SucursalesFisicas_VW
    {
              
        
        [Column("SucursalFisicaID")]
        public int SucursalFisicaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("DireccionID")]
        public Int64 DireccionID { get; set; }
      
        
        [Column("AsentamientoID")]
        public Int64? AsentamientoID { get; set; }
      
        
        [Column("NombreVialidad")]
        public string NombreVialidad { get; set; }
      
        
        [Column("Asentamiento")]
        public string Asentamiento { get; set; }
      
        
        [Column("NumeroInterior")]
        public string NumeroInterior { get; set; }
      
        
        [Column("NumeroExterior")]
        public string NumeroExterior { get; set; }
      
        
        [Column("Estado")]
        public string Estado { get; set; }
      
        
        [Column("Municipio")]
        public string Municipio { get; set; }
      
        
        [Column("Ciudad")]
        public string Ciudad { get; set; }
      
        
        [Column("CodigoPostal")]
        public int? CodigoPostal { get; set; }
      
        
        [Column("vialidadTipoId")]
        public int vialidadTipoId { get; set; }
      
        
        [Column("vialidadTipo")]
        public string vialidadTipo { get; set; }
      
        
        [Column("orientacionVialidadTipoId")]
        public int? orientacionVialidadTipoId { get; set; }
      
        
        [Column("orientacionVialidadTipo")]
        public string orientacionVialidadTipo { get; set; }
      
        
        [Column("oficina_postal")]
        public string oficina_postal { get; set; }
      
        
        [Column("zona")]
        public string zona { get; set; }
      
        
        [Column("ViviendaTipoId")]
        public int? ViviendaTipoId { get; set; }
      
        
        [Column("ViviendaTipo")]
        public string ViviendaTipo { get; set; }
      
        
        [Column("Telefono")]
        public string Telefono { get; set; }
      
        
        [Column("ReferenciasGeograficas")]
        public string ReferenciasGeograficas { get; set; }


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
