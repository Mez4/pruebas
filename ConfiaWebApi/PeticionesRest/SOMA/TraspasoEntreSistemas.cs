using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.TraspasoEntreSistemas
{
    public class GetCuentasOrigen
    {
        public int SistemaOrigenID { get; set;}
    }

    public class GetCuentasDestino
    {
        public int SistemaDestinoID { get; set;}
    }

    public class GetSaldosOrigen
    {
        public int CuentaOrigenID { get; set;}
        public int SistemaOrigenID {get; set;}
    }

    public class GetSaldosDestino
    {
        public int CuentaDestinoID { get; set;}
        public int SistemaDestinoID {get; set;}
    }

    public class Add
    {
        public int CuentaDestinoID { get; set;}
        public int SistemaDestinoID {get; set;}
        public int CuentaOrigenID { get; set;}
        public int SistemaOrigenID {get; set;}
        public string Observaciones { get; set;}
        public decimal Monto { get; set;}
        public string Json { get; set;}
    }

    public class Item
        {
            public int sistemaID { get; set; }
            public string nombre { get; set; }
        }

        public class ApiResponse
        {
            public List<Item> data { get; set; }
            public int error { get; set; }
            public string resultado { get; set; }
        }
        public class Cuentas
        {
            public string cuenta { get; set; }
            public string nombre { get; set; }
        }

        public class ApiResponseCuentas
        {
            public List<Cuentas> data { get; set; }
            public int error { get; set; }
            public string resultado { get; set; }
        }

        public class Saldos
        {
            public decimal total { get; set; }
        }

        public class ApiResponseSaldos
        {
            public List<Saldos> data { get; set; }
            public int error { get; set; }
            public string resultado { get; set; }
        }

        public class Movimiento
        {
            public int regresa { get; set; }
            public string msj { get; set; }
            public Int64 movimientoID { get; set; }
        }

        public class ApiResponseMovimiento
        {
            public List<Movimiento> data { get; set; }
            public int error { get; set; }
            public string resultado { get; set; }
        }
}