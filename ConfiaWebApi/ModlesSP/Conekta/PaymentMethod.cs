namespace AplicadorPagosContext.AplicadorPagos.Custom.Conekta{ 

    public class PaymentMethod
    {
        public string service_name { get; set; }
        public string barcode_url { get; set; }
        public string store { get; set; }
        public int auth_code { get; set; }
        public string @object { get; set; }
        public string type { get; set; }
        public int expires_at { get; set; }
        public string store_name { get; set; }
        public string reference { get; set; }
    }

}