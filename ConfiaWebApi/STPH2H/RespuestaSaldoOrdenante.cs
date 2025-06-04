using System.Collections.Generic;
public class SaldoCuenta
{
    public decimal cargosPendientes { get; set; }
    public decimal saldo { get; set; }
}

public class ResultadoSaldoOrdenante
{
    public int id { get; set; }
    public SaldoCuenta saldoCuenta { get; set; }
    public string descripcionError { get; set; }
}

public class RespuestaSaldoOrdenante
{
    public ResultadoSaldoOrdenante resultado { get; set; }
}

