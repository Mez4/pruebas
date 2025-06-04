using System.Collections.Generic; 
namespace AplicadorPagosContext.AplicadorPagos.Custom.Conekta{ 

    public class Charges
    {
        public string @object { get; set; }
        public bool has_more { get; set; }
        public int total { get; set; }
        public List<Datum> data { get; set; }
    }

}