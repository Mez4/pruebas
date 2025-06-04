using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Responsables
{
    [ExplicitColumns]
    public class ResponsablesActivos
    {
        [Column("ResponsableId")]
        public Int64 ResponsableId { get; set; }
        
        [Column("ResponsableNombre")]
        public string ResponsableNombre { get; set; }
        
        [Column("Usuario")]
        public string Usuario { get; set; }

        [Column("UsuarioID")]
        public Int64 UsuarioID { get; set; }
    }
    public class ResponsablesAsignacion
    {
        [Column("UsuarioID")]
        public Int64 UsuarioID { get; set; }

        [Column("GrupoID")]
        public int GrupoID { get; set; }
        
        [Column("GestorID")]
        public Int64 GestorID { get; set; }
    }
    
    public class Responsables
    {

        [Column("ResponsableId")]
        public Int64 ResponsableId { get; set; }
        [Column("CoordinacionId")]
        public string CoordinacionId { get; set; }
        [Column("ResponsableNombre")]
        public string ResponsableNombre { get; set; }
        [Column("Asesor")]
        public string Asesor { get; set; }
        [Column("CoordinadorValeID")]
        public Int64 CoordinadorValeID { get; set; }
        [Column("CveCli")]
        public string CveCli { get; set; }
        [Column("cveenc")]
        public string cveenc { get; set; }
        [Column("FhAlta")]
        public DateTime FhAlta { get; set; }
        [Column("empleadoID")]
        public Int64 empleadoID { get; set; }
        [Column("TipoResponsableId")]
        public int TipoResponsableId { get; set; }
        [Column("UsuarioId")]
        public Int64 UsuarioId { get; set; }
        [Column("Activo")]
        public bool Activo { get; set; }
        [Column("visibleReportes")]
        public bool visibleReportes { get; set; }
        [Column("UserID")]
        public Int64 UserID { get; set; }
        [Column("RutaId")]
        public Int64 RutaId { get; set; }
        [Column("metaBase")]
        public decimal metaBase { get; set; }
        [Column("Alias")]
        public string Alias { get; set; }
        [Column("empleadoIdSac")]
        public Int64 empleadoIdSac { get; set; }
        [Column("Identificador")]
        public int Identificador { get; set; }
        [Column("Estatus")]
        public string Estatus { get; set; }
        [Column("DiaVisita")]
        public int DiaVisita { get; set; }
    }
}
