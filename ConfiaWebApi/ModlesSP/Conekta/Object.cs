namespace AplicadorPagosContext.AplicadorPagos.Custom.Conekta{ 

    public class Object
    {
        public bool livemode { get; set; }
        public int amount { get; set; }
        public string currency { get; set; }
        public string payment_status { get; set; }
        public int amount_refunded { get; set; }
        public CustomerInfo customer_info { get; set; }
        public string @object { get; set; }
        public string id { get; set; }
        public Metadata metadata { get; set; }
        public int created_at { get; set; }
        public int updated_at { get; set; }
        public Charges charges { get; set; }
    }

}