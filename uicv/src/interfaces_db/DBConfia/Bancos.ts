export namespace DBConfia_Bancos {
        
    export interface IAgrupaciones {
              
        AgrupacionID: number
      
        Clave: string
      
        Descripcion: string
      
        Activo: boolean
      
        EmpresaID: number

    }
    export interface ICatalogoBancos {
              
        BancoID: number
      
        Nombre: string
      
        Activo: boolean
      
        ArchivoDispersionID: number
      
        Logo?: any
      
        TipoBancoId: number
      
        Desembolso?: boolean
      
        Cobranza?: boolean
      
        BancoStpID?: number

    }
    export interface ICatalogoConvenios {
              
        ConvenioID: number
      
        descripcion: string
      
        ProductoID: number
      
        convenio: string
      
        fhRegistro: string
      
        nombreComercialEmpresa: string
      
        cuentaBancaria: string
      
        activo: boolean
      
        BancoID: number

    }
    export interface ICatalogoCuentasBancos {
              
        CuentaBancoID: number
      
        NumeroCuenta: string
      
        CuentaID: number
      
        Activo: boolean
      
        DispersionConvenio?: string
      
        Global: boolean
      
        PuedeDispersar: boolean
      
        SaldoMinimo: number
      
        SaldoMaximo: number
      
        ExcedenteSaldo: number
      
        AgrupacionID?: number
      
        SaldoActual: number
      
        InstitucionOperante?: string
      
        InstitucionContraparte?: string
      
        DescripcionCuenta?: string
      
        CobranzaConvenio?: string
      
        ProductoID: number
      
        Disponible: boolean
      
        EsBoveda: boolean
      
        SucursalID: number
      
        CuentaBancariaPrincipalID: number
      
        BancoID?: number
      
        PuedeGenGastos?: boolean
      
        Activado: boolean
      
        bitConcentradora: boolean
      
        SaldosMovs_Sin_Balance?: number
      
        FechaHoraUltMov?: string
      
        BalanceVinculado?: number

    }
    export interface ICatalogoCuentasBancos_VW {
              
        CuentaBancariaPrincipalID: number
      
        TipoCuenta?: string
      
        NumeroCuentaPrincipal?: string
      
        DescripcionCuentaPrincipal?: string
      
        CuentaBancoID: number
      
        NumeroCuenta: string
      
        DescripcionCuenta?: string
      
        CuentaContableID?: number
      
        Cuenta?: string
      
        Nombre?: string
      
        BancoID?: number
      
        NombreBanco?: string
      
        CuentaBancoActiva: boolean
      
        DispersionConvenio?: string
      
        CobranzaConvenio?: string
      
        Global: boolean
      
        PuedeDispersar: boolean
      
        SaldoMinimo: number
      
        SaldoMaximo: number
      
        ExcedenteSaldo: number
      
        SaldoActual: number
      
        ProductoID: number
      
        Activo: boolean
      
        EsBoveda: boolean
      
        Disponible: boolean
      
        Producto?: string
      
        sucursalId?: number
      
        sucursal?: string

    }
    export interface ICatalogoCuentasBancosSucursales {
              
        ProductoID: number
      
        SucursalID: number
      
        CuentaBancoID: number
      
        Activo?: boolean
      
        RegistraPersonaId?: number
      
        RegistraUsuarioId?: number
      
        RegistraFecha?: string
      
        ActualizaPersonaId?: number
      
        ActualizaUsuarioId?: number
      
        ActualizaFecha?: string

    }
    export interface ICatalogoTipoBanco {
              
        TipoBancoId: number
      
        Clave?: string
      
        Descripcion: string

    }
    export interface ICNB {
              
        CveBancoRef: number
      
        NombreBanco: string

    }
    export interface ICorresponsalesPago {
              
        CorresponsalId: number
      
        CorresponsalDesc: string
      
        comision: number
      
        ordenEnTabla: number
      
        mostrarEnTabla: boolean
      
        montoMaximoPago: number

    }
    export interface ICuentasBancariasPrincipal {
              
        CuentaBancariaPrincipalID: number
      
        NumeroCuenta: string
      
        EsReal: boolean
      
        BancoID: number
      
        Activa: boolean
      
        TipoCuentaBancoID: number
      
        DescripcionCuenta: string

    }
    export interface ICuentasBancariasPrincipal_VW {
              
        CuentaBancariaPrincipalID: number
      
        NumeroCuenta: string
      
        DescripcionCuenta: string
      
        EsReal: boolean
      
        CuentaActiva: boolean
      
        TipoCuentaBancoID?: number
      
        TipoCuenta?: string
      
        BancoID?: number
      
        BancoNombre?: string
      
        BancoActivo?: boolean

    }
    export interface ICuentasDesembolsosTipos {
              
        Id: number
      
        cuentaId: number
      
        tipoDesembolsoId: number
      
        activo: boolean

    }
    export interface IMovimientos {
              
        MovimientoID: number
      
        CuentaID: number
      
        SucursalId: number
      
        CuentaDestinoID?: number
      
        FechaAfectacion?: string
      
        FechaCaptura: string
      
        Importe: number
      
        Observaciones: string
      
        TipoMovimientoID: number
      
        ProductoId?: number
      
        RefApl?: number
      
        gastoSucursal?: number
      
        movimientoIdTraspaso?: number
      
        cancelacionObservacion?: string
      
        cancelacionUsuario?: number
      
        cancelacionImporte?: number
      
        cancelacionFhRegistro?: string
      
        cancelacionTipMovimiento?: number
      
        PolizaId?: number
      
        Estatus?: string
      
        Contabilizado?: boolean
      
        CajaId?: number
      
        PersonaIDRegistro?: number
      
        PeriodoID: number
      
        ObservacionesUsuario?: string
      
        CatEstatusMovID: number
      
        FechaCancelacion?: string
      
        UsuarioIDRegistra: number
      
        MovimientoBoveda: boolean
      
        Bal_Apl?: number
      
        BovedaID?: number
      
        bitAplicado?: boolean
      
        bitAplicadoResto?: boolean
      
        restoDNI?: number
      
        AplicacionAfecta?: number
      
        AplicacionAfectaResto?: number

    }
    export interface IMovimientos_VW {
              
        MovimientoID: number
      
        CuentaID: number
      
        SucursalId: number
      
        CuentaDestinoID?: number
      
        FechaAfectacion?: string
      
        FechaCaptura: string
      
        Importe: number
      
        Observaciones: string
      
        TipoMovimientoID: number
      
        ProductoId?: number
      
        RefApl?: number
      
        gastoSucursal?: number
      
        movimientoIdTraspaso?: number
      
        cancelacionObservacion?: string
      
        cancelacionUsuario?: number
      
        cancelacionImporte?: number
      
        cancelacionFhRegistro?: string
      
        cancelacionTipMovimiento?: number
      
        PolizaId?: number
      
        Estatus?: string
      
        Contabilizado?: boolean
      
        CajaId?: number
      
        PersonaIDRegistro?: number
      
        PeriodoID: number
      
        Bal_Apl?: number
      
        ObservacionesUsuario?: string
      
        CatEstatusMovID: number
      
        FechaCancelacion?: string
      
        UsuarioIDRegistra: number
      
        MovimientoBoveda: boolean
      
        CveMovimientoID: string
      
        TipoMovimiento: string
      
        EstDsc: string
      
        Distribuidor?: string
      
        DistribuidorID?: number
      
        bitAplicado?: boolean
      
        bitAplicadoResto?: boolean
      
        restoDNI?: number
      
        NombreSucursal: string
      
        NombrePersonaRegistro?: string

    }
    export interface IMovimientosAgrupa {
              
        MovAgrupaId: number
      
        Clave: string
      
        Nombre: string
      
        Estatus: boolean

    }
    export interface IMovimientosBancarios {
              
        MovBancarioID: number
      
        CatTipoMovID: number
      
        CuentaBancoID: number
      
        Concepto: string
      
        Conciliado: boolean
      
        Consecutivo: number
      
        Beneficiario: string
      
        PolizaID: number
      
        CreditoID: number
      
        PersonaID: number
      
        UsuarioID: number

    }
    export interface IMovimientosDetalle {
              
        MovimientoID: number
      
        MovimientoDetalleID: number
      
        CreditoID?: number
      
        NoPago?: number
      
        Capital: number
      
        Interes: number
      
        Comision: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        Importe?: number
      
        noPagoCan?: number
      
        capitalCan?: number
      
        interesCan?: number
      
        comisionCan?: number
      
        manejoCuentaCan?: number
      
        seguroCan?: number
      
        cargoCan?: number
      
        IVACan?: number
      
        PolizaMovId?: number

    }
    export interface IMovimientosTraspasos {
              
        TraspasoID: number
      
        SucursalID: number
      
        CajaID: number
      
        FechaTraspaso: string
      
        Accion: string
      
        PersonaID: number
      
        UsuarioID: number
      
        CuentaOrigenID: number
      
        CuentaDestinoID: number
      
        Monto: number
      
        SaldoOrigenAnt: number
      
        SaldoOrigenNvo: number
      
        SaldoDestinoAnt: number
      
        SaldoDestinoNvo: number
      
        Concepto?: string

    }
    export interface IMovimientosTraspasos_VW {
              
        TraspasoID: number
      
        SucursalID: number
      
        SucursalNombre: string
      
        CajaID: number
      
        NombreCaja: string
      
        Monto: number
      
        SaldoOrigenNvo: number
      
        SaldoDestinoNvo: number
      
        Concepto?: string
      
        CuentaOrigenID: number
      
        NumeroCuentaOrigen: string
      
        CuentaDestinoID: number
      
        NumeroCuentaDestino: string
      
        UsuarioID: number
      
        FechaTraspaso: string
      
        NombreCompleto: string

    }
    export interface IOrdenantes {
              
        ID: number
      
        OrdenanteID: string
      
        Ordenante: string
      
        EmpresaFiscalID: number

    }
    export interface IstpBancos {
              
        RefBancoID: number
      
        CveBancoRef: number
      
        NombreBanco: string

    }
    export interface IstpEmpresas {
              
        EmpresaStpID: number
      
        EmpresaDesc: string
      
        NumCuentaRef: string
      
        ClaveOrdenante: string

    }
    export interface ITiposCuentaBancarias {
              
        TipoCuentaBancoID: number
      
        TipoCuenta: string

    }
    export interface ITiposDesembolso {
              
        TipoDesembolsoID: number
      
        TipoDesembolso: string
      
        Activo: boolean
      
        TipoMovimientoID: number
      
        FormatoImpresionExtra: boolean
      
        datoTipoID: number
      
        RequiereDatosBancarios?: boolean
      
        EsEnApp?: boolean
      
        iconoDesembolsoTipo?: string
      
        Modificable?: boolean

    }
    export interface ITiposDesembolsoSucursal {
              
        ProductoID: number
      
        SucursalId: number
      
        TipoDesembolsoID: number
      
        RegistroUsuarioId: number
      
        RegistroFecha: string
      
        ModificaUsuarioId?: number
      
        ModificaFecha?: string
      
        OcultarEnCanje: boolean

    }
    export interface ITiposDesembolsoSucursal_VW {
              
        SucursalID: number
      
        Nombre: string
      
        TipoDesembolsoID: number
      
        TipoDesembolso: string
      
        ProductoID: number
      
        Producto: string
      
        RegistroUsuarioId: number
      
        RegistroFecha: string
      
        ModificaUsuarioId?: number
      
        ModificaFecha?: string

    }
    export interface ITiposMovimientos {
              
        Id: number
      
        CveMovimientoID: string
      
        TipoMovimiento: string
      
        Cargo: boolean
      
        Factor: number
      
        usuario?: boolean
      
        CorresponsalId?: number
      
        gastosRubroID?: number
      
        AceptaDepositos?: boolean
      
        AceptaRetiros?: boolean
      
        AplicaIva?: boolean
      
        ManejaCuentasdeOrden?: boolean
      
        AplicaIde?: boolean
      
        PagaInteres?: boolean
      
        TasaInteres?: number
      
        RetieneIsr?: boolean
      
        MontoApertura?: number
      
        MontoMaximo?: number
      
        AplicaComision?: boolean
      
        MontoComision?: number
      
        RetiroId?: number
      
        DepositoId?: number
      
        ComisionId?: number
      
        IvaId?: number
      
        Activa: boolean
      
        MovAgrupaID: number
      
        ProductoId?: number
      
        Transfiere?: boolean
      
        DeSistema: boolean
      
        ManejaEfectivo?: boolean
      
        GenerarBalance: boolean
      
        AfectaCaja?: boolean

    }
    export interface ITiposMovs_VW {
              
        Id: number
      
        CveMovimientoID: string
      
        TipoMovimiento: string
      
        Cargo: boolean
      
        AceptaDepositos?: boolean
      
        AceptaRetiros?: boolean
      
        MovAgrupaID: number
      
        Activa: boolean
      
        MovAgrupa?: string
      
        ManejaEfectivo?: boolean

    }
    export interface ITiposMovsActivos_VW {
              
        ProductoIDMov?: number
      
        ProductoMovimiento?: string
      
        tipoMovID: number
      
        tipoMovimientoID: string
      
        tipoMovimiento: string

    }
}