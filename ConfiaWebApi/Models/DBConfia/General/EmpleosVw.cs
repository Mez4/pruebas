using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.General
{
    [TableName("General.Empleos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Empleos_VW
    {
              
        
        [Column("EmpleoID")]
        public Int64 EmpleoID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("OcupacionID")]
        public int OcupacionID { get; set; }
      
        
        [Column("Empresa")]
        public string Empresa { get; set; }
      
        
        [Column("Puesto")]
        public string Puesto { get; set; }
      
        
        [Column("Telefono")]
        public string Telefono { get; set; }
      
        
        [Column("DireccionID")]
        public Int64 DireccionID { get; set; }
      
        
        [Column("FechaIngreso")]
        public DateTime FechaIngreso { get; set; }
      
        
        [Column("FechaTermino")]
        public DateTime? FechaTermino { get; set; }
      
        
        [Column("SueldoMensual")]
        public decimal SueldoMensual { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("CreacionFecha")]
        public DateTime CreacionFecha { get; set; }
      
        
        [Column("CreacionPersonaID")]
        public Int64 CreacionPersonaID { get; set; }
      
        
        [Column("CreacionUsuarioID")]
        public int CreacionUsuarioID { get; set; }
      
        
        [Column("Direccion_AsentamientoID")]
        public Int64? Direccion_AsentamientoID { get; set; }
      
        
        [Column("Direccion_NombreVialidad")]
        public string Direccion_NombreVialidad { get; set; }
      
        
        [Column("Direccion_Asentamiento")]
        public string Direccion_Asentamiento { get; set; }
      
        
        [Column("Direccion_NumeroInterior")]
        public string Direccion_NumeroInterior { get; set; }
      
        
        [Column("Direccion_NumeroExterior")]
        public string Direccion_NumeroExterior { get; set; }
      
        
        [Column("Direccion_Estado")]
        public string Direccion_Estado { get; set; }
      
        
        [Column("Direccion_Municipio")]
        public string Direccion_Municipio { get; set; }
      
        
        [Column("Direccion_Ciudad")]
        public string Direccion_Ciudad { get; set; }
      
        
        [Column("Direccion_CodigoPostal")]
        public int? Direccion_CodigoPostal { get; set; }
      
        
        [Column("Direccion_vialidadTipoId")]
        public int? Direccion_vialidadTipoId { get; set; }
      
        
        [Column("Direccion_vialidadTipo")]
        public string Direccion_vialidadTipo { get; set; }
      
        
        [Column("Direccion_orientacionVialidadTipoId")]
        public int? Direccion_orientacionVialidadTipoId { get; set; }
      
        
        [Column("Direccion_orientacionVialidadTipo")]
        public string Direccion_orientacionVialidadTipo { get; set; }
      
        
        [Column("Direccion_oficina_postal")]
        public string Direccion_oficina_postal { get; set; }
      
        
        [Column("Direccion_zona")]
        public string Direccion_zona { get; set; }
      
        
        [Column("Direccion_ViviendaTipoId")]
        public int? Direccion_ViviendaTipoId { get; set; }
      
        
        [Column("Direccion_ViviendaTipo")]
        public string Direccion_ViviendaTipo { get; set; }


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
