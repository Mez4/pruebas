using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.CatTipoBanco
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public string TipoBancoId { get; set; }
    }

    public class Add
    {

        [Required]
        [MinLength(1)]
        [MaxLength(25)]
        public string descripcion { get; set; }

    }

    public class SaldoReal
    {
        public int ProductoId { get; set; }

        public int Id { get; set; }

        public string TipoMovimiento { get; set; }

        public int CajaId { get; set; }

        public string NombreCaja { get; set; }

        public int SucursalId { get; set; }

        public string SucursalNombre { get; set; }

        public decimal Total { get; set; }

        public string Producto { get; set; }
        public decimal SaldoFinal { get; set; }

    }
    public class SaldoReal2
    {


        public int CajaID { get; set; }



    }

    public class SaldosSP
    {
        public int ProductoId { get; set; }
        public int Id { get; set; }
        public string TipoMovimiento { get; set; }
        public int CajaId { get; set; }
        public string NombreCaja { get; set; }
        public decimal Caja { get; set; }
        public decimal Boveda { get; set; }
        public decimal ODP { get; set; }
        public decimal SaldoReal { get; set; }
        public string Producto { get; set; }

        public decimal Total { get; set; }
        public decimal SaldoFinal { get; set; }


    }

    public class Update : Add
    {


    }
}
