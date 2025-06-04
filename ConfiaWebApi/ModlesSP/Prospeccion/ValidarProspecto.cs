using NPoco;

namespace ConfiaWebApi.ModlesSP.Prospeccion
{
    [ExplicitColumns]
    public class ValidarProspecto
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }
    }
}
