export namespace DBConfia_Tesoreria {
        
    export interface IArchivoDispersion2 {
              
        ArchivoDispersionID: number
      
        Fecha?: string
      
        ProductoID: number
      
        EstatusArchivoID: number
      
        TipoDesembolso: number
      
        Impresa: number
      
        UsuarioRealiza: number

    }
    export interface IArchivoDispersionDetalle {
              
        DetalleDispersionID: number
      
        FechaRegistro: string
      
        ConsecutivoDia: number
      
        TotalDispersion: number
      
        CantidadMovimientos: number
      
        Estatus: number
      
        CatConciliacionID: number
      
        CreditoID: number
      
        ArchivoDispersionID: number
      
        Clave_Rastreo: string
      
        Concepto_Pago: string
      
        Cuenta_Beneficiario: string
      
        Email_Benificiario: string
      
        Empresa: string
      
        Institucion_Contraparte: string
      
        Institucion_Operante: string
      
        Monto: number
      
        Nombre_Beneficiario: string
      
        Referencia_Numerica: string
      
        Rfc_Curp_Beneficiario: string
      
        Tipo_Cuenta_Beneficiario: string
      
        Tipo_Pago: string
      
        Reasignado: boolean
      
        Observaciones?: string
      
        ObservacionesDevuelta?: string
      
        FechaAplicacion?: string
      
        FechaReasignado?: string

    }
    export interface IArqueos {
              
        ArqueoID: number
      
        Fecha?: string
      
        UsuarioRealiza: string
      
        CajaID: number

    }
    export interface IArqueoSaldosCuentas {
              
        RegistroID: number
      
        ArqueoID: number
      
        FechaCaptura?: string
      
        CuentaBancoID: number
      
        SaldoCierre: number
      
        UsuarioID: number
      
        TipoMovimiento: number
      
        NumeroCuenta: string
      
        Producto?: string
      
        CveMovDesc?: string
      
        ProductoID?: number
      
        SaldoInicial?: number

    }
    export interface IArqueosBovedas {
              
        ArqueoBovedaID: number
      
        Fecha?: string
      
        UsuarioRealiza: string
      
        BovedaID: number
      
        FechaCaptura: string
      
        UsuarioID?: number

    }
    export interface IArqueosBovedas_VW {
              
        ArqueoBovedaID: number
      
        NombreBoveda?: string
      
        UsuarioID?: number
      
        Nombre?: string
      
        NumeroCuenta?: string
      
        SaldoActual?: number
      
        BovedaID: number
      
        FechaCaptura: string

    }
    export interface IArqueosBovedas2 {
              
        ArqueoBovedaID: number
      
        Fecha?: string
      
        UsuarioRealiza: string
      
        CajaID: number

    }
    export interface IArqueosBovedasDetalle {
              
        RegistroID: number
      
        MovimientoID: number
      
        ArqueoBovedaID: number
      
        CuentaBancoID: number
      
        FechaCaptura: string
      
        BovedaID?: number

    }
    export interface IArqueosBovedasDetalle2 {
              
        ArqueoBovedaDetalleID: number
      
        CatDenomEfectivoID: number
      
        TotalXEfectivo?: number
      
        CajaID: number
      
        Fecha?: string
      
        ArqueoBovedaID?: number
      
        CuentaBancoID?: number
      
        Cantidad?: number

    }
    export interface IArqueosBovedasSaldos {
              
        RegistroID: number
      
        ArqueoBovedaID: number
      
        BovedaID?: number
      
        CuentaBancoID: number
      
        SaldoCuenta: number
      
        FechaCaptura: string
      
        TipoMovimiento: string

    }
    export interface IArqueosBovedasSaldosCierre {
              
        RegistroID: number
      
        ArqueoBovedaID: number
      
        CuentaBancoID: number
      
        FechaCaptura: string
      
        SaldoCierre: number

    }
    export interface IArqueosBovedasSaldosCuentas {
              
        RegistroID: number
      
        ArqueoBovedaID: number
      
        FechaCaptura?: string
      
        CuentaBancoID: number
      
        SaldoCierre: number
      
        UsuarioID: number
      
        TipoMovimiento: number
      
        NumeroCuenta: string
      
        Producto?: string
      
        CveMovDesc?: string
      
        ProductoID?: number
      
        SaldoInicial?: number

    }
    export interface IArqueosDesembolso {
              
        ArqueosDesembolsoID: number
      
        SucursalID: number
      
        ValesCapturados: number
      
        ValesDesembolsados: number
      
        DiferenciaVales: number
      
        FechaReporte: string
      
        ImporteDesembolsado: number
      
        ImporteDesembolsadoSistema: number
      
        DiferenciaImporte: number
      
        Observaciones?: string
      
        UsuarioRegistraID: number
      
        PersonaRegistraID: number
      
        FechaRegistra: string
      
        ProductoID: number

    }
    export interface IArqueosDesembolso_VW {
              
        ArqueosDesembolsoID: number
      
        SucursalID: number
      
        Nombre?: string
      
        ValesCapturados: number
      
        ValesDesembolsados: number
      
        DiferenciaVales: number
      
        FechaReporte: string
      
        ImporteDesembolsado: number
      
        ImporteDesembolsadoSistema: number
      
        DiferenciaImporte: number
      
        Observaciones?: string
      
        UsuarioRegistraID: number
      
        NombreCompleto?: string
      
        PersonaRegistraID: number
      
        FechaRegistra: string
      
        ProductoID: number

    }
    export interface IArqueosDesembolsoDetalle {
              
        ArqueoDesembolsoDetalleID: number
      
        ArqueosDesembolsoID: number
      
        CreditoID: number

    }
    export interface IArqueosDesembolsoDetalle_VW {
              
        ArqueoDesembolsoDetalleID: number
      
        ArqueosDesembolsoID: number
      
        CreditoID: number
      
        ClienteID?: number
      
        NombreCompleto?: string
      
        ValeCanje?: number
      
        EstatusID?: string
      
        EstatusNombre?: string
      
        TipoDesembolsoID?: number
      
        TipoDesembolso?: string
      
        Capital?: number
      
        fechaHoraActivacion?: string
      
        NombreCompletoRegistra?: string
      
        FechaHoraRegistro?: string
      
        DistribuidorID?: number
      
        Distribuidor?: string

    }
    export interface IArqueosDetalle {
              
        ArqueoDetalleID: number
      
        CatDenomEfectivoID: number
      
        Cantidad: number
      
        TotalXEfectivo?: number
      
        CajaID: number
      
        Fecha?: string
      
        ArqueoID?: number
      
        CuentaBancoID?: number

    }
    export interface IArqueosMovimientosCajas_VW {
              
        ArqueoID: number
      
        NumeroCuentaPrincipal?: string
      
        Producto?: string
      
        CuentaBancoID?: number
      
        CajaID: number
      
        NumeroCuenta?: string
      
        Total: number
      
        TipoMovimiento?: string

    }
    export interface IArqueosMovsDetalle {
              
        RegistroID: number
      
        ArqueoID: number
      
        MovimientoID: number
      
        CuentaBancoID: number
      
        Total: number
      
        FechaCaptura: string
      
        CajaID: number

    }
    export interface IArqueosSaldos {
              
        SaldoArqueoID: number
      
        TipoMovimiento: string
      
        Cuenta?: string
      
        Producto?: string
      
        Total: number
      
        ArqueoID: number
      
        CveMovDesc?: string

    }
    export interface IBalanceTemp {
              
        BalanceTempID: number
      
        Nombre: string
      
        FechaCaptura?: string
      
        CantidadMovs: number
      
        UsuarioID?: number
      
        Aceptado: boolean
      
        ResultadoBalance?: string
      
        DiferenciaBalance?: string
      
        Cartera090?: string
      
        Cartera90?: string
      
        BalanceVinculado?: number

    }
    export interface IBalanceTempDetalle {
              
        RegistroID: number
      
        BalanceTempID: number
      
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
      
        SaldoActual: number
      
        MovimientoBoveda: boolean

    }
    export interface IBalanza {
              
        BalanzaID: number
      
        FechaCaptura?: string
      
        UsuarioRealiza: string
      
        FechaInicio: string
      
        FechaFin: string

    }
    export interface IBalanzaDetalle {
              
        BalanzaDetalleID: number
      
        BalanzaID: number
      
        CuentaBancoID: number
      
        CuentacontableID: number
      
        Factor?: number
      
        CtaBanco: string
      
        Ctacontable: string
      
        Producto: string
      
        TipoMovimiento: string
      
        SaldoImporte: number
      
        Observaciones: string
      
        CuentaDestino: string
      
        FechaAfectacion: string
      
        FechaCaptura: string

    }
    export interface IBovedaXSucursal_VW {
              
        Boveda?: string
      
        BovedaID: number
      
        SucursalID?: number

    }
    export interface ICajaCuentasBancos {
              
        CajaCuentaID: number
      
        CajaID: number
      
        CuentaBancoID: number
      
        Disponible: boolean

    }
    export interface ICajasActivas_VW {
              
        CajaID: number
      
        Descripcion: string
      
        SucursalID: number
      
        Estatus: boolean
      
        Nombre: string
      
        Clave: string
      
        BovedaID: number
      
        CuentaID?: number
      
        PersonaID: number
      
        ResponsableID?: number
      
        IdCuentaODP?: number
      
        IdCuentaSpei?: number
      
        UsuarioID: number
      
        Cerrada: boolean
      
        CanalesCobranza?: boolean
      
        Convenia?: boolean
      
        Restructura?: boolean

    }
    export interface ICajasActivasSinCuentas_VW {
              
        CajaID: number
      
        Descripcion: string
      
        SucursalID: number
      
        Estatus: boolean
      
        Nombre: string
      
        Clave: string
      
        BovedaID: number
      
        CuentaID?: number
      
        PersonaID: number
      
        ResponsableID?: number
      
        IdCuentaODP?: number
      
        IdCuentaSpei?: number
      
        UsuarioID: number
      
        Cerrada: boolean
      
        CanalesCobranza?: boolean
      
        Convenia?: boolean
      
        Restructura?: boolean

    }
    export interface ICajasOperando_VW {
              
        CajaID: number
      
        Descripcion: string
      
        SucursalID: number
      
        Estatus: boolean
      
        Nombre: string
      
        Clave: string
      
        BovedaID: number
      
        CuentaID?: number
      
        PersonaID: number
      
        ResponsableID?: number
      
        IdCuentaODP?: number
      
        IdCuentaSpei?: number
      
        UsuarioID: number
      
        Cerrada: boolean
      
        CanalesCobranza?: boolean
      
        Convenia?: boolean
      
        Restructura?: boolean

    }
    export interface ICajaTipoOperacion {
              
        CajaTipoOperacionID: number
      
        CajaID: number
      
        TipoMovimientoID: number
      
        Activa?: boolean
      
        CuentaBancoId?: number
      
        PuedeSacar?: boolean
      
        PuedeRecibir?: boolean

    }
    export interface ICajaTipoOperacion_VW {
              
        CajaID?: number
      
        Nombre?: string
      
        CuentaBancoID?: number
      
        NumeroCuentaCB?: string
      
        ProductoID?: number
      
        Producto?: string
      
        PuedeGenGastos?: boolean
      
        CuentaBancariaPrincipalID?: number
      
        NumeroCuentaCBP?: string
      
        Id?: number
      
        CveMovimientoID?: string
      
        TipoMovimiento?: string
      
        ManejaEfectivo?: boolean
      
        EsBoveda?: boolean
      
        SucursalID?: number

    }
    export interface ICatalogoBoveda {
              
        BovedaID: number
      
        Nombre: string
      
        Clave?: string
      
        FechaHora: string
      
        Activa?: boolean
      
        CuentaID: number
      
        PersonaID: number
      
        BancoID?: number
      
        UsuarioID: number
      
        Cerrada: boolean
      
        SucursalID: number

    }
    export interface ICatalogoBoveda_VW {
              
        BovedaID: number
      
        BancoID?: number
      
        PersonaID: number
      
        NombreBoveda: string
      
        Clave?: string
      
        Activa?: boolean
      
        CuentaID?: number
      
        NombreCuentaContable?: string
      
        NombreSucursal?: string
      
        SucursalID?: number
      
        NombreResponsble?: string
      
        Cerrada: boolean

    }
    export interface ICatalogoCajas {
              
        CajaID: number
      
        Descripcion: string
      
        SucursalID: number
      
        Estatus: boolean
      
        Nombre: string
      
        Clave: string
      
        BovedaID: number
      
        CuentaID?: number
      
        PersonaID: number
      
        ResponsableID?: number
      
        IdCuentaODP?: number
      
        IdCuentaSpei?: number
      
        UsuarioID: number
      
        Cerrada: boolean
      
        CanalesCobranza?: boolean
      
        Convenia?: boolean
      
        Restructura?: boolean

    }
    export interface ICatalogoCajas_VW {
              
        UsuarioIDSeg?: number
      
        UsuarioNombre?: string
      
        CajaTieneGasto?: number
      
        BovedaNombre?: string
      
        CajaID: number
      
        Descripcion: string
      
        SucursalID: number
      
        Estatus: boolean
      
        Nombre: string
      
        Clave: string
      
        BovedaID: number
      
        CuentaID?: number
      
        PersonaID: number
      
        ResponsableID?: number
      
        IdCuentaODP?: number
      
        IdCuentaSpei?: number
      
        UsuarioID: number
      
        Cerrada: boolean
      
        CanalesCobranza?: boolean
      
        Convenia?: boolean
      
        Restructura?: boolean
      
        Responsable?: string
      
        Encargado?: string
      
        NombreSucursal?: string

    }
    export interface ICatalogoCajasUsuarios {
              
        CajaID: number
      
        UsuarioID: number
      
        FechaRegistro: string
      
        UsuarioRegistroID: number
      
        FechaModifico?: string
      
        UsuarioModificoID?: number
      
        Activo: boolean
      
        PuedeDesembolsar: boolean

    }
    export interface ICatalogoCajasUsuarios_VW {
              
        UsuarioID: number
      
        CajaID: number
      
        Descripcion: string
      
        SucursalID: number
      
        ZonaID: number
      
        Estatus: boolean
      
        Nombre: string
      
        Clave: string
      
        BovedaID: number
      
        CuentaID?: number
      
        PersonaID: number
      
        ResponsableID?: number
      
        IdCuentaODP?: number
      
        IdCuentaSpei?: number
      
        Cerrada: boolean
      
        CanalesCobranza?: boolean
      
        Convenia?: boolean
      
        Restructura?: boolean
      
        Sucursal: string
      
        Activo: boolean
      
        PuedeDesembolsar: boolean
      
        NumeroCuenta: string
      
        ProductoID: number

    }
    export interface ICatalogoCajasUsuariosSaldos_VW {
              
        UsuarioID: number
      
        CajaID: number
      
        Descripcion: string
      
        SucursalID: number
      
        Estatus: boolean
      
        Nombre: string
      
        Clave: string
      
        BovedaID: number
      
        CuentaID?: number
      
        PersonaID: number
      
        ResponsableID?: number
      
        IdCuentaODP?: number
      
        IdCuentaSpei?: number
      
        Cerrada: boolean
      
        CanalesCobranza?: boolean
      
        Convenia?: boolean
      
        Restructura?: boolean
      
        Sucursal: string
      
        Activo: boolean
      
        ProductoID: number
      
        SaldoActual?: number

    }
    export interface ICatalogoConciliacion {
              
        CatConciliacionID: number
      
        Estatus: string
      
        Descripcion: string

    }
    export interface ICatalogoDenomEfectivo {
              
        CatDenomEfectivoID: number
      
        Clave: string
      
        Concepto: string
      
        ValorMonetario: number

    }
    export interface ICatalogoDenomEfectivo_VW {
              
        CatDenomEfectivoID: number
      
        Clave: string
      
        Concepto: string
      
        ValorMonetario: number
      
        Total: number
      
        Cantidad: number

    }
    export interface ICatalogoMovimientosCaja {
              
        MovimientoCajaID: number
      
        MovimientoClave: string
      
        Descripcion: string
      
        VistaEnSaldo: boolean
      
        AceptaDepositos: boolean
      
        AceptaRetiros: boolean
      
        AplicaIva: boolean
      
        ManejaCuentasDeOrden: boolean
      
        AplicaIde: boolean
      
        PagaInteres: boolean
      
        TasaInteres?: number
      
        RetieneIsr: boolean
      
        MontoApertura?: number
      
        MontoMaximo?: number
      
        AplicaComision: boolean
      
        MontoComision: number
      
        SaldosComision?: number
      
        Retiro?: number
      
        Deposito?: number
      
        Comision?: number
      
        Iva?: number
      
        Activa: boolean

    }
    export interface ICatalogoTipoMovimiento {
              
        CatTipoMovID: number
      
        Clave: string
      
        Descripcion: string

    }
    export interface IContratosHist {
              
        IdSucursal: number
      
        IdContrato: number
      
        ContDesc?: string
      
        CostoRenta?: number
      
        FechaIniCont?: string
      
        FechaFinCont?: string
      
        FechaCarga?: string
      
        DOcCont?: string
      
        NombreSuc?: string

    }
    export interface IContratoSucursalRenta {
              
        LadoFrontal: string
      
        LadoTrasero: string
      
        ContratoID: number

    }
    export interface IConvenio {
              
        ConvenioID: number
      
        NombreConvenio?: string
      
        CodigoConvenio?: string
      
        Usuario?: string
      
        Contrasena?: string

    }
    export interface ICorresponsales {
              
        CorresponsalID: number
      
        Nombre: string
      
        TipoConciliacion: string
      
        Activo?: boolean
      
        Creado: string
      
        Modificado?: string
      
        TipoComisionID?: number
      
        Porcentaje?: number
      
        MontoFijo?: number
      
        MontoCorte?: number

    }
    export interface ICorresponsales_View {
              
        CorresponsalID: number
      
        Nombre: string
      
        TipoConciliacion: string
      
        Activo?: boolean
      
        Creado: string
      
        Modificado?: string
      
        MontoFijo?: number
      
        MontoCorte?: number
      
        TipoComisionID: number
      
        TipoComision: string
      
        TipoPorcentaje: boolean
      
        TipoMontoFijo: boolean
      
        TipoMontoCorte: boolean

    }
    export interface ICorresponsalesTipoComision {
              
        TipoComisionID: number
      
        TipoComision: string
      
        TipoPorcentaje: boolean
      
        TipoMontoFijo: boolean
      
        TipoMontoCorte: boolean

    }
    export interface ICuentaNominaSucursal_VW {
              
        SucursalID?: number
      
        Nombre?: string
      
        Activo: boolean
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        Id?: number
      
        CveMovimientoID?: string
      
        TipoMovimiento?: string

    }
    export interface ICuentaNominaSucusal {
              
        CuentaNominaID: number
      
        Activo: boolean
      
        CuentaBancoID: number
      
        SucursalID: number
      
        TipoMovID: number

    }
    export interface ICuentasAsignadasCaja_VW {
              
        Estatus: number
      
        SucursalID?: number
      
        NombreCaja?: string
      
        CajaId: number
      
        Disponible: boolean
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        ProductoID: number
      
        Producto: string

    }
    export interface ICuentasBancariasGastosXSuc_VW {
              
        CuentaBancoID?: number
      
        PuedeGenGastos?: boolean
      
        NumeroCuenta?: string
      
        DescripcionCuenta?: string
      
        CuentaBancariaPrincipalID?: number
      
        NumeroCuentaPrincipal?: string
      
        CajaID: number
      
        NombreCaja?: string

    }
    export interface ICuentasBancariasLibre_VW {
              
        TipoCuenta?: string
      
        CuentaBancariaPrincipalID?: number
      
        CuentaBancariaP?: string
      
        CuentaBancoID: number
      
        NumeroCuenta: string
      
        Activo: boolean
      
        ProductoID?: number
      
        Producto?: string

    }
    export interface ICuentasBancariasPrincipal_VW {
              
        CuentaBancariaPrincipalID: number
      
        NumeroCuenta: string
      
        DescripcionCuenta: string
      
        EsReal: boolean
      
        CuentaActiva: boolean
      
        TipoCuentaBancoID?: number
      
        TipoCuenta?: string
      
        BancoNombre?: string
      
        BancoActivo?: boolean

    }
    export interface ICuentasBancoDisponibles_VW {
              
        SucursalID?: number
      
        CuentaContableID?: number
      
        CuentaBancoID: number
      
        NumeroCuenta: string
      
        EsBoveda: boolean
      
        Producto?: string

    }
    export interface ICuentasBoveda {
              
        CtasBovedaId: number
      
        BovedaId: number
      
        CuentaBancoId: number

    }
    export interface ICuentasCaja {
              
        CtasCajaId: number
      
        CajaId: number
      
        CuentaBancoId: number
      
        Disponible: boolean

    }
    export interface ICuentasContables {
              
        CuentaID: number
      
        Cuenta: string
      
        AcumulaCuentaID?: number
      
        Nombre: string
      
        TipoID: number
      
        NaturalezaID: number
      
        RubroID: number
      
        EmpresaID: number
      
        CatMonedaSatID: number
      
        Activa: boolean
      
        FechaRegistro: string
      
        TipoBancoId?: number
      
        Dispersa?: boolean
      
        SucursalID: number

    }
    export interface ICuentasContables_VW {
              
        Nombre: string
      
        Cuenta: string
      
        Activa: boolean
      
        TipoID: number
      
        FechaRegistro: string
      
        TipoBancoId?: number
      
        Dispersa?: boolean
      
        SucursalID: number
      
        NaturalezaID: number
      
        RubroID: number
      
        EmpresaID: number
      
        CatMonedaSatID: number
      
        CuentaID: number
      
        AcumulaCuentaID?: number
      
        NombreAcumulaCuenta?: string
      
        SucursalNombre?: string

    }
    export interface ICuentasOpCaja_VW {
              
        CajaID?: number
      
        Nombre?: string
      
        Id?: number
      
        TipoMovimiento?: string
      
        ProductoID?: number
      
        Producto?: string
      
        CuentaBancoID: number
      
        NumeroCuenta: string
      
        DescripcionCuenta?: string
      
        SaldoActual: number

    }
    export interface ICuentasPBovedaDisponibles_VW {
              
        CuentaID: number
      
        Cuenta: string
      
        Nombre: string
      
        TipoID: number

    }
    export interface ICuentasProducto {
              
        CuentaProductoid: number
      
        Capital: number
      
        InteresNormal: number
      
        InteresMoratorio: number
      
        Iva: number
      
        InteresNormalDeudor: number
      
        InteresNormalAcreedor: number
      
        InteresMoratorioDeudor: number
      
        InteresMoratorioAcreedor: number

    }
    export interface ICuentasXCaja_VW {
              
        CajaID?: number
      
        NombreCaja?: string
      
        CuentaBancoID: number
      
        CuentaBanco?: string
      
        Disponible: boolean
      
        CuentaBancoDesc?: string

    }
    export interface IDatosDeDispersion_VW {
              
        ProductoID: number
      
        DistribuidorID?: number
      
        ClienteID: number
      
        SucursalID: number
      
        SerieId?: number
      
        ValeCanje?: number
      
        Capital: number
      
        Plazos: number
      
        PersonaIDRegistro: number
      
        TipoDesembolsoID: number
      
        CreditoID: number

    }
    export interface IDesembolsosFiniquitos {
              
        Id: number
      
        Cia: number
      
        IDSB: number
      
        ProductoID: number
      
        SucursalID: number
      
        PersonaID: number
      
        CuentaBancoID: number
      
        Desembolsado: boolean
      
        Cancelado: boolean
      
        Importe: number
      
        MovimientoID?: number
      
        UsuarioCreoId: number
      
        FechaCreo: string
      
        UsuarioDesembolsoId?: number
      
        FechaDesembolso?: string
      
        UsuarioCanceloId?: number
      
        FechaCancelo?: string

    }
    export interface IDesembolsosFiniquitos_VW {
              
        Id: number
      
        Cia: number
      
        IDSB: number
      
        SucursalID: number
      
        PersonaID: number
      
        CuentaBancoID: number
      
        Desembolsado: boolean
      
        Cancelado: boolean
      
        Importe: number
      
        MovimientoID?: number
      
        UsuarioCreoId: number
      
        FechaCreo: string
      
        UsuarioDesembolsoId?: number
      
        FechaDesembolso?: string
      
        UsuarioCanceloId?: number
      
        FechaCancelo?: string
      
        Sucursal: string
      
        NombreCompleto: string
      
        NumeroCuenta: string
      
        SACId?: number
      
        ProductoID: number

    }
    export interface IDocumentosGastos {
              
        DocumentoID: number
      
        SolicitudGastoID: number
      
        SolicitudDetalleID: number
      
        Ruta: string
      
        Autorizado: boolean
      
        Cotizacion: boolean
      
        FechaSubida: string

    }
    export interface IEstatusArchivoDispersion {
              
        EstatusArchivoID: number
      
        Estatus: string
      
        Descripcion: string

    }
    export interface IEstatusMovimiento {
              
        CatEstatusMovID: number
      
        Caracter: string
      
        Descripcion: string

    }
    export interface IEstatusSolicitudesGastos {
              
        EstatusSolicitudID: number
      
        Estatus: string
      
        Descripcion: string

    }
    export interface IGastosXSolicitud_VW {
              
        Clave?: string
      
        Descripcion?: string
      
        SolicitudDetalleID: number
      
        SolicitudGastoID: number
      
        RubroGastosID: number
      
        Total: number
      
        Revisado: boolean
      
        Aceptado: boolean

    }
    export interface IMonedaSAT {
              
        MonedaSatID: number
      
        NombreMoneda: string
      
        TipoCambio: number
      
        Fecha: string
      
        ClaveMonedaSat: string

    }
    export interface IMovCargosAbonos {
              
        MovimientoID: number
      
        NumeroCuenta: string
      
        Sucursal: string
      
        FechaAfectacion?: string
      
        Importe: number
      
        TipoMovimientoID: number
      
        TipoMovimiento: string
      
        Observaciones: string
      
        CatEstatusMovID: number

    }
    export interface IMovimientopolizas {
              
        MovimientoPolizaID: number
      
        PolizaID: number
      
        Descripcion: string
      
        CuentaID: number
      
        Referencia?: string
      
        CatEstatusMovID: number
      
        Debe: number
      
        Haber: number
      
        PeriodoID: number

    }
    export interface IMovimientosArqueos_VW {
              
        MovimientoID?: number
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        DescripcionCuenta?: string
      
        Importe?: number
      
        TipoMovimiento?: string
      
        Observaciones?: string
      
        FechaCaptura?: string
      
        CajaID: number

    }
    export interface IMovimientosCuentasDepositos_VW {
              
        Id?: number
      
        CveMovimientoID?: string
      
        TipoMovimiento?: string
      
        AceptaRetiros?: boolean
      
        AceptaDepositos?: boolean
      
        DeSistema?: boolean
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        empresaId?: number
      
        empresaNombre?: string
      
        ProductoID?: number
      
        Producto?: string
      
        CajaID?: number
      
        Descripcion?: string
      
        Estatus?: boolean
      
        SucursalID?: number
      
        Nombre?: string

    }
    export interface IMovimientosCuentasRetiros {
              
        Id?: number
      
        CveMovimientoID?: string
      
        TipoMovimiento?: string
      
        AceptaRetiros?: boolean
      
        AceptaDepositos?: boolean
      
        DeSistema?: boolean
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        ProductoID?: number
      
        Producto?: string
      
        CajaID?: number
      
        Descripcion?: string
      
        Estatus?: boolean
      
        SucursalID?: number
      
        Nombre?: string

    }
    export interface IMovimientosCuentasRetiros_VW {
              
        Id?: number
      
        CveMovimientoID?: string
      
        TipoMovimiento?: string
      
        AceptaRetiros?: boolean
      
        AceptaDepositos?: boolean
      
        DeSistema?: boolean
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        empresaId?: number
      
        empresaNombre?: string
      
        ProductoID?: number
      
        Producto?: string
      
        CajaID?: number
      
        Descripcion?: string
      
        Estatus?: boolean
      
        SucursalID?: number
      
        Nombre?: string

    }
    export interface IMultisaldos_MovimientosVW {
              
        MovimientoID: number
      
        CuentaID: number
      
        NumeroCuenta: string
      
        SucursalId: number
      
        SucursalNombre: string
      
        Importe: number
      
        Observaciones: string
      
        TipoMovimientoID: number
      
        TipoMovimiento: string
      
        ProductoId?: number
      
        CajaId?: number
      
        CajaNombre: string
      
        PeriodoID: number
      
        UsuarioIDRegistra: number
      
        FechaCaptura: string
      
        NombreCompleto: string

    }
    export interface IMultiSaldosBovedas {
              
        MultiSaldoBovedaID: number
      
        FechaGenerado: string
      
        UsuarioID: number
      
        Job?: boolean

    }
    export interface IMultiSaldosBovedasDetalle {
              
        MultiSaldosDetalleBovedaID: number
      
        MultiSaldoBovedaID: number
      
        ProductoID: number
      
        Producto: string
      
        SucursalID: number
      
        NombreSucursal: string
      
        CuentaBancariaPrincipalID: number
      
        NumCuentaPR: string
      
        DescCuentaPR: string
      
        CajaID: number
      
        NombreCaja: string
      
        CuentaBancoID: number
      
        NumeroCuenta: string
      
        DescripcionCuenta: string
      
        SaldoActual: number
      
        SaldoMinimo: number
      
        SaldoMaximo: number
      
        ExcedenteSaldo: number

    }
    export interface INaturaleza {
              
        NaturalezaID: number
      
        Descripcion: string

    }
    export interface IPeriodo {
              
        PeriodoID: number
      
        NumeroPeriodo: number
      
        FechaApertura: string
      
        FechaCierre?: string
      
        Estatus: string
      
        Ejercicio: string
      
        AgrupacionID: number
      
        UsuarioIDApertura: number
      
        UsuarioIDCierre?: number

    }
    export interface IPeriodo2 {
              
        PeriodoID: number
      
        NumeroPeriodo: number
      
        FechaApertura: string
      
        FechaCierre?: string
      
        FechaInicio: string
      
        DiasGracia: number
      
        FechaFin?: string
      
        Estatus: string
      
        Ejercicio: string
      
        AgrupacionID: number
      
        PersonaIDCierre?: number
      
        PersonaIDApertura: number
      
        ReAbierto?: number
      
        ProductoID: number
      
        UsuarioIDApertura: number
      
        UsuarioIDCierre?: number

    }
    export interface IPeriodosConBalance {
              
        Estatus: string
      
        ReAbierto?: number
      
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
    export interface IPolizas {
              
        PolizaID: number
      
        Referencia?: number
      
        Numero?: number
      
        Fecha: string
      
        Concepto: string
      
        CatEstatusMovID?: number
      
        TipoPolizaID?: number
      
        PersonaID: number
      
        UsuarioID: number

    }
    export interface IProductosMovimiento {
              
        ProdMovId: number
      
        MovimientoID: number
      
        ProductoID: number

    }
    export interface IReferenciasPersona {
              
        ReferenciaID: number
      
        Referencia?: string
      
        ClabeSpei?: string
      
        PersonaID?: number
      
        FechaGeneracion?: string

    }
    export interface IRentaLocalDetalle {
              
        SucursalId: number
      
        Nombre_suc?: string
      
        Monto?: number
      
        Fecha_inicio?: string
      
        Fecha_Fin?: string
      
        EstatusSucursal: boolean
      
        DiasRestantes?: number
      
        DetalleSuc: string
      
        ContratoID: number
      
        DocContrato?: string

    }
    export interface IRubro {
              
        RubroID: number
      
        Descripcion: string

    }
    export interface IRubrosGastos {
              
        RubroGastosID: number
      
        Clave: string
      
        Descripcion: string
      
        Activo: boolean
      
        RegistraID: number
      
        AfectaUtilidad: boolean
      
        GastoCorporativo: boolean
      
        Cargo: boolean
      
        Factor: number

    }
    export interface IRubrosGastos_VW {
              
        Nombre?: string
      
        RubroGastosID: number
      
        Clave: string
      
        Descripcion: string
      
        Activo: boolean
      
        RegistraID: number
      
        AfectaUtilidad: boolean
      
        GastoCorporativo: boolean
      
        Cargo: boolean
      
        Factor: number

    }
    export interface ISaldosBovedas_VW {
              
        SucursalID?: number
      
        NombreSucursal?: string
      
        BovedaID: number
      
        Activa?: boolean
      
        Nombre: string
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        ProductoID?: number
      
        Producto?: string
      
        SaldoActual?: number

    }
    export interface ISaldosCajaPorProducto_VW {
              
        CajaID?: number
      
        Nombre?: string
      
        TipoMovimiento?: string
      
        ProductoID?: number
      
        Producto?: string
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        SaldoActual?: number

    }
    export interface ISaldosCajas_VW {
              
        Estatus: boolean
      
        Cerrada: boolean
      
        SucursalID?: number
      
        NombreSucursal?: string
      
        CajaID: number
      
        Nombre: string
      
        EnOperacion: number
      
        BovedaID?: number
      
        NombreBoveda?: string
      
        TotalCaja?: number

    }
    export interface ISaldosCuentas {
              
        RegistroID: number
      
        CuentaBancoID: number
      
        NumeroCuenta: string
      
        TotalMovsA: number
      
        TotalMovsC: number
      
        Total: number
      
        FechaCaptura: string
      
        CajaID?: number
      
        SaldoAnterior: number
      
        EsBoveda: boolean
      
        Apertura: boolean

    }
    export interface ISaldosCuentasArqueos {
              
        CajaID: number
      
        CuentaBancoId?: number
      
        NumeroCuenta?: string
      
        Producto?: string
      
        SaldoCierre?: number
      
        CveMovDesc?: string

    }
    export interface ISaldosCuentasBoveda_VW {
              
        ProductoID?: number
      
        Producto?: string
      
        SucursalID?: number
      
        NombreSucursal?: string
      
        CuentaBancariaPrincipalID?: number
      
        NumCuentaPR?: string
      
        DescCuentaPR?: string
      
        CajaID?: number
      
        NombreCaja?: string
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        DescripcionCuenta?: string
      
        SaldoActual?: number
      
        SaldoMinimo?: number
      
        SaldoMaximo?: number
      
        ExcedenteSaldo?: number

    }
    export interface ISaldosCuentasCierre {
              
        RegistroID: number
      
        BalanceTempID: number
      
        CuentaBancoID: number
      
        SaldoCierre: number

    }
    export interface ISaldosCuentasTemporal {
              
        RegistroID: number
      
        BalanceTempID: number
      
        TipoCuenta: string
      
        Producto: string
      
        CuentaBancariaPrincipalID: number
      
        NumeroCuenta: string
      
        DescripcionCuenta: string
      
        TipoMovimiento: string
      
        CajaID: number
      
        CajaNombre: string
      
        Operacion: string
      
        CuentaBancoID: number
      
        DescripcionCuentaF: string
      
        NumeroCuentaF: string
      
        SaldoAceptado: number
      
        SaldoActual: number
      
        MovimientoEntSal: boolean
      
        SaldoCierreAnterior: number

    }
    export interface ISaldosInicialesMigracion {
              
        SaldoInicialID: number
      
        CajaID: number
      
        Caja: number
      
        Boveda?: number
      
        ODP?: number

    }
    export interface ISaldosOperacionesCaja_VW {
              
        CajaID: number
      
        CuentaBancoId?: number
      
        NumeroCuenta?: string
      
        SaldoActual?: number
      
        TipoMovimientoID: number
      
        TipoMovimiento?: string
      
        ProductoID?: number
      
        Producto?: string

    }
    export interface ISaldosPorBoveda_VW {
              
        SucursalID?: number
      
        NombreSucursal?: string
      
        CuentaID: number
      
        Nombre: string
      
        SaldoTotal?: number

    }
    export interface ISolicitudesGastos {
              
        SolicitudGastoID: number
      
        Observaciones?: string
      
        EstatusSolicitudID: number
      
        SolicitanteID: number
      
        AutorizadoID?: number
      
        RechazadoID?: number
      
        AplicadoID?: number
      
        CajaID: number
      
        CuentaBancoID: number
      
        FechaSolicitud: string
      
        FechaAutorizada?: string
      
        FechaRechazado?: string
      
        FechaAplicado?: string
      
        MontoSolicitado: number
      
        MontoAutorizado: number
      
        MovimientoID?: number
      
        AfectaSucursal?: boolean
      
        SucursalID?: number
      
        CanceladoID?: number
      
        FechaCancelado?: string
      
        DocumentosConfirmados: boolean
      
        ObservacionesTesoreria?: string
      
        FechaDocumentosCon?: string
      
        OrigenSucursalID: number
      
        ProrratearGasto: boolean
      
        Meses: number
      
        Util?: boolean

    }
    export interface ISolicitudesGastosXCaja_VW {
              
        SucursalCajaID?: number
      
        CanceladoID?: number
      
        RubroGastosID?: number
      
        DescGasto?: string
      
        EstatusSolicitudID: number
      
        FechaDocumentosCon?: string
      
        ObservacionesTesoreria?: string
      
        DocumentosConfirmados: boolean
      
        AutorizadoID?: number
      
        FechaCancelado?: string
      
        RechazadoID?: number
      
        AplicadoID?: number
      
        SolicitudGastoID: number
      
        FechaSolicitud: string
      
        CajaID: number
      
        EstatusClave?: string
      
        NombreCaja?: string
      
        NombreSucursal?: string
      
        NombreSucursalAfectada?: string
      
        CuentaBancoID?: number
      
        NumeroCuenta?: string
      
        MontoSolicitado: number
      
        MontoAutorizado: number
      
        SolicitanteID: number
      
        Solicitante?: string
      
        Observaciones?: string
      
        FechaAutorizada?: string
      
        FechaRechazado?: string
      
        FechaAplicado?: string
      
        SucursalAfecta?: string
      
        Estatus?: string
      
        Descripcion?: string

    }
    export interface ISolicitudGastosDetalle {
              
        SolicitudDetalleID: number
      
        SolicitudGastoID: number
      
        RubroGastosID: number
      
        Total: number
      
        Revisado: boolean
      
        Aceptado: boolean

    }
    export interface ISolicitudGastosDetalle_VW {
              
        SolicitudDetalleID: number
      
        Descripcion?: string
      
        Total: number
      
        Aceptado: boolean
      
        SolicitudGastoID: number

    }
    export interface ISucursalCajasOcupacion_VW {
              
        CajaID: number
      
        UsuarioID: number
      
        Activo: boolean
      
        SucursalID: number
      
        Estatus: boolean
      
        Nombre: string
      
        Descripcion: string
      
        PersonaID: number

    }
    export interface ITipoCuenta {
              
        TipoID: number
      
        Descripcion: string

    }
    export interface ITipoOperacion_VW {
              
        CajaTipoOperacionID: number
      
        CuentaBancoId?: number
      
        NumeroCuenta: string
      
        CajaID: number
      
        NombreCaja?: string
      
        Id?: number
      
        TipoMovimiento?: string
      
        CveMovimientoID?: string
      
        Cargo?: boolean
      
        usuario?: boolean
      
        Activa?: boolean
      
        PuedeRecibir: boolean
      
        PuedeSacar: boolean
      
        Estatus: number
      
        CuentaBancoIdNueva: number
      
        ProductoID: number
      
        ProductoIDMov?: number
      
        ProductoMovimiento?: string
      
        SucursalID?: number
      
        ZonaID?: number

    }
    export interface ITipoPoliza {
              
        TipoPolizaID: number
      
        Descripcion: string

    }
    export interface ITotalEfectivoCaja {
              
        TotalEfectivoCajaID: number
      
        CatDenomEfectivoID: number
      
        Cantidad: number
      
        TotalXEfectivo?: number
      
        CajaID: number
      
        Fecha?: string
      
        ArqueoID?: number

    }
    export interface IVistaCajasOperando_VW {
              
        CajaID: number
      
        Descripcion: string
      
        SucursalID: number
      
        Estatus: boolean
      
        Nombre: string
      
        Clave: string
      
        BovedaID: number
      
        CuentaID?: number
      
        PersonaID: number
      
        ResponsableID?: number
      
        IdCuentaODP?: number
      
        IdCuentaSpei?: number
      
        UsuarioID: number
      
        Cerrada: boolean
      
        CanalesCobranza?: boolean
      
        Convenia?: boolean
      
        Restructura?: boolean

    }
}