using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.TiposMovimiento
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int ArchivoDispersionID { get; set; }

    }

    public class Add
    {
        [Required]
        [MaxLength(4)]
        public string cveMovimientoID { get; set; }

        [Required]
        [MaxLength(50)]
        public string tipoMovimiento { get; set; }

        [Required]
        public bool cargo { get; set; }

        [Required]
        public int factor { get; set; }

        [Required]
        public bool usuario { get; set; }

        public int CorresponsalId { get; set; }

        public int gastosRubroID { get; set; }

        public bool aceptaDepositos { get; set; }

        public bool aceptaRetiros { get; set; }

        public bool aplicaIva { get; set; }

        public bool manejaCuentasdeOrden { get; set; }

        public bool aplicaIDE { get; set; }

        public bool pagaInteres { get; set; }

        public decimal tasaInteres { get; set; }

        public bool retieneISR { get; set; }

        public decimal montoApertura { get; set; }


        public decimal montoMaximo { get; set; }


        public bool aplicaComision { get; set; }


        public decimal montoComision { get; set; }

        public int retiroID { get; set; }

        public int depositoID { get; set; }

        public int comisionID { get; set; }

        public int ivaID { get; set; }

        public bool activa { get; set; }

        public int movAgrupaID { get; set; }

        public int productoID { get; set; }

    }


    public class Update : Add
    {


    }

}
