export namespace DBConfia_Balances {
        
    export interface IBalance2 {
              
        BalanceID: number
      
        NombreBalance?: string
      
        SaldoTotalBalance: number
      
        Periodo: number
      
        Anio: number
      
        FechaCreacion: string
      
        Cerrado: boolean
      
        PeriodoID: number
      
        ProductoID: number
      
        UsuarioID: number
      
        BalanceTempID: number

    }
    export interface IBalanceMovimientoDetalle {
              
        BalanceMovDetalleID: number
      
        BalanceID: number
      
        MovimientoID: number
      
        SaldoSistema: number

    }
    export interface IBalanceMovimientoDetalle2 {
              
        BalanceMovDetalleID: number
      
        BalanceID: number
      
        MovimientoID: number
      
        SaldoSistema: number

    }
    export interface IBalanceResumen {
              
        BalanceResumenID: number
      
        BalanceID: number
      
        CtaBancaria: string
      
        CtaContable: string
      
        SaldoSistema: number
      
        SaldoEdoCuenta: number
      
        Diferencia: number

    }
    export interface IBalanceResumen2 {
              
        BalanceResumenID: number
      
        BalanceID: number
      
        CtaBancoId: number
      
        CtaBancaria: string
      
        CtaContable: string
      
        SaldoSistema: number
      
        SaldoEdoCuenta: number
      
        Diferencia: number

    }
    export interface IBalancesProductos {
              
        BalanceID: number
      
        ProductoID: number
      
        FechaCreacion?: string
      
        NombreBalance?: string
      
        NumeroBalance?: string
      
        ResponsableBalance?: number

    }
    export interface IBalanza {
              
        BalanzaID: number
      
        FechaCaptura?: string
      
        UsuarioRealiza: string
      
        FechaInicio: string
      
        FechaFin: string
      
        Producto?: string

    }
    export interface IBalanzaDetalle {
              
        BalanzaDetalleID: number
      
        BalanzaID: number
      
        CuentaBancoID: number
      
        CuentaContableID: number
      
        Factor?: number
      
        CtaBanco: string
      
        CtaContable: string
      
        Producto: string
      
        TipoMovimiento: string
      
        SaldoImporte: number
      
        Observaciones: string
      
        CuentaDestino: string
      
        FechaAfectacion: string
      
        FechaCaptura: string
      
        ProductoID?: number
      
        TipoMovimientoDesc?: string

    }
    export interface IMultiSaldos {
              
        MultiSaldoID: number
      
        FechaCaptura?: string
      
        UsuarioID: number
      
        ProductoID: number
      
        PMultiSaldoID?: number
      
        CierreDiario: boolean

    }
    export interface IMultiSaldosArqueos {
              
        MultiSaldoArqueoID: number
      
        FechaGeneracion: string
      
        UsuarioID: number

    }
    export interface IMultiSaldosArqueosBovedas {
              
        MultiSaldoArqueoBovedaID: number
      
        FechaGeneracion: string
      
        UsuarioID: number

    }
    export interface IMultiSaldosArqueosBovedasDetalle {
              
        MultiSaldoArqueoBovedaDetalleID: number
      
        MultiSaldoArqueoBovedaID: number
      
        SucursalID?: number
      
        NombreSucursal?: string
      
        CajaID: number
      
        NombreCaja?: string
      
        CuentaBancoID?: number
      
        NombreCuenta?: string
      
        ArqueoBovedaID?: number
      
        UsuarioRealiza?: string
      
        FechaUltimoArqueoBoveda?: string
      
        SaldoSistemaUltAB: number
      
        SaldoFisicoUltAB: number
      
        Diferencia?: number
      
        TipoMovID?: number
      
        TipoMovDesc?: string

    }
    export interface IMultiSaldosArqueosDetalle {
              
        MultiSaldoArqueoDetalleID: number
      
        MultiSaldoArqueoID: number
      
        IDT: number
      
        SucursalID: number
      
        NombreSucursal?: string
      
        CajaID: number
      
        NombreCaja?: string
      
        Cerrada: boolean
      
        Estatus: boolean
      
        CuentaBancoID?: number
      
        NombreCuenta?: string
      
        DescCuenta?: string
      
        ArqueoID?: number
      
        UsuarioRealiza?: string
      
        FechaUltimoArqueo?: string
      
        SaldoSistemaUltA: number
      
        SaldoFisicoUltA: number

    }
    export interface IMultisaldosCajaDetalle {
              
        MuiltisaldosCajaDetalleID: number
      
        MultisaldosCajaID: number
      
        CajaID: number
      
        NombreCaja?: string
      
        CuentaBancoID: number
      
        NumeroCuenta?: string
      
        DescripcionCuenta?: string
      
        FechaUltimoArqueo?: string
      
        SaldoArqueoAnterior: number
      
        SaldoFisico: number
      
        Diferencia: number
      
        TipoMovID: number
      
        TipoMovDesc: string

    }
    export interface IMultisaldosCajas {
              
        MultisaldosCajaID: number
      
        FechaGenerado: string
      
        UsuarioID: number

    }
    export interface IMultiSaldosDetalle {
              
        MultiSaldoDetalleID: number
      
        ProductoID: number
      
        FechaCaptura: string
      
        PeriodoID: string
      
        CuentaBancoID: number
      
        NombreBanco: string
      
        EsBoveda: boolean
      
        NumeroCuenta: string
      
        SaldoAceptado: number
      
        Abonos: number
      
        Cargos: number
      
        SaldoSinAceptar: number
      
        SaldoActual: number
      
        UsuarioID: number
      
        Impreso: boolean
      
        MultiSaldoID?: number
      
        IDT?: number
      
        Cont?: number

    }
    export interface IPMultiSaldos {
              
        MultiSaldoID: number
      
        FechaCaptura?: string
      
        UsuarioID: number
      
        ProductoID: number

    }
    export interface ISaldosCierreCuentasBalance {
              
        RegistroID: number
      
        NumeroCuenta: string
      
        SaldoCierre: number
      
        BalanceID: number
      
        FechaCreacion: string
      
        UsuarioID: number
      
        CuentaBancoID: number

    }
    export interface ISaldosCuentasBalance {
              
        SaldosCuentasBalanceID: number
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        DescripcionCuenta?: string
      
        BalanceID?: number
      
        Saldo?: number
      
        FechaCreacion: string

    }
    export interface IvSaldoPorMovBalanza {
              
        Factor?: number
      
        TipoMovimientoDesc?: string
      
        SaldoImporte: number

    }
}