using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{
    [TableName("AppVale.AppDistribuidores_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AppDistribuidores_VW
    {


        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }


        [Column("primerNombre")]
        public string primerNombre { get; set; }


        [Column("segundoNombre")]
        public string segundoNombre { get; set; }


        [Column("primerApellido")]
        public string primerApellido { get; set; }


        [Column("segundoApellido")]
        public string segundoApellido { get; set; }


        [Column("FechaNacimiento")]
        public DateTime FechaNacimiento { get; set; }


        [Column("CURP")]
        public string CURP { get; set; }


        [Column("RFC")]
        public string RFC { get; set; }


        [Column("edad")]
        public int? edad { get; set; }


        [Column("categoriaId")]
        public int? categoriaId { get; set; }


        [Column("telefonoId")]
        public int telefonoId { get; set; }


        [Column("telefonoTipo")]
        public string telefonoTipo { get; set; }


        [Column("telefono")]
        public string telefono { get; set; }


        [Column("DistribuidoresEstatusID")]
        public string DistribuidoresEstatusID { get; set; }


        [Column("DistribuidoresEstatus")]
        public string DistribuidoresEstatus { get; set; }


        [Column("SexoID")]
        public string SexoID { get; set; }


        [Column("CorreoElectronico")]
        public string CorreoElectronico { get; set; }


        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }


        [Column("fechaAutorizado")]
        public DateTime? fechaAutorizado { get; set; }


        [Column("ProductoID")]
        public int ProductoID { get; set; }


        [Column("PrimerCanjeDig")]
        public bool PrimerCanjeDig { get; set; }

        [Column("SucursalID")]
        public int SucursalID { get; set; }


        [Column("Estatus")]
        public bool Estatus { get; set; }


        [Column("DistAntNumero")]
        public int? DistAntNumero { get; set; }


        [Column("DistAntNumero2")]
        public int? DistAntNumero2 { get; set; }


        [Column("EmpresaId")]
        public int EmpresaId { get; set; }


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
