using NPoco;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
    public class ObtenerDocumentosProducto
    {
        [Column("TipoDocumentoID")]
        public int? TipoDocumentoID { get; set; }

        [Column("CatalogoTipoDocumentoID")]
        public int CatalogoTipoDocumentoID { get; set; }

        [Column("Orden")]
        public int? Orden { get; set; }

        [Column("Activo")]
        public bool Activo { get; set; }

        [Column("ProductoID")]
        public int? ProductoID { get; set; }

        [Column("NombreDocumento")]
        public string NombreDocumento { get; set; }

        [Column("ConsultaBuro")]
        public bool ConsultaBuro { get; set; }

        [Column("rn")]
        public int rn { get; set; }
    }
}
