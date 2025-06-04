export namespace DBConfia_Creditos {
        
    export interface IAbonos_VW {
              
        AplicacionID: number
      
        AbonoID: number
      
        CreditoID: number
      
        NoPago: number
      
        Fecha?: string
      
        FechaHoraAbono: string
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        Comision: number
      
        Abono: number
      
        PagoPPI?: number
      
        ImporteTotal?: number
      
        fechaCorte?: string
      
        FechaHoraUltimoPagoAnt?: string
      
        ProductoID: number
      
        Producto: string

    }
    export interface IAplicaciones {
              
        AplicacionID: number
      
        ProductoID: number
      
        SucursalID: number
      
        DistribuidorID: number
      
        ClienteID?: number
      
        FechaAplicacion: string
      
        MovimientoIdPago: number
      
        MovimientoIdComision?: number
      
        MovimientoIdDNI?: number
      
        ConvenioID?: number
      
        FechaHoraUltimoPagoAnt?: string
      
        CuentaID?: number
      
        Activo?: boolean
      
        UsuarioID: number
      
        PersonaID?: number
      
        FechaRegistro: string
      
        UsuarioCanceloID?: number
      
        FechaCancelacion?: string
      
        MotivoCancelacion?: string
      
        Pago?: number
      
        CajaID?: number
      
        MovimientoIdCancelacion?: number
      
        GestorCobranzaID?: number
      
        MesaCobranzaID?: number
      
        MovimientoIdPPI?: number
      
        CreditoPPIId?: number
      
        MovimientoIdPPIDSM?: number
      
        PagoAtrasado?: boolean
      
        PagoAnticipado?: boolean
      
        AbonoCliente?: boolean
      
        PagoOrigen?: number
      
        PagoMigrado?: boolean
      
        IDSysFechaPago?: string

    }
    export interface IAplicaciones_VW {
              
        AplicacionID: number
      
        ProductoID: number
      
        SucursalID: number
      
        cuentabancoid?: number
      
        NumeroCuenta?: string
      
        DescripcionCuenta?: string
      
        DistribuidorID: number
      
        ClienteID?: number
      
        FechaAplicacion: string
      
        MovimientoIdPago: number
      
        MovimientoIdComision?: number
      
        MovimientoIdDNI?: number
      
        ConvenioID?: number
      
        FechaHoraUltimoPagoAnt?: string
      
        CuentaID?: number
      
        Activo?: boolean
      
        UsuarioID: number
      
        PersonaID?: number
      
        FechaRegistro: string
      
        UsuarioCanceloID?: number
      
        FechaCancelacion?: string
      
        Sucursal: string
      
        Distribuidor: string
      
        Cliente?: string
      
        Pago?: number
      
        MovimientoIdCancelacion?: number
      
        PagoMigrado?: boolean
      
        Importe?: number
      
        ImporteBonificacion?: number
      
        ImporteDNI: number
      
        NombreCaptura?: string

    }
    export interface IAvales {
              
        CreditoId: number
      
        PersonaId: number

    }
    export interface ICanjesValeApp {
              
        CanjeAppId: number
      
        ProductoID: number
      
        DistribuidorID: number
      
        SucursalID: number
      
        ClienteID: number
      
        SerieId?: number
      
        Folio?: number
      
        Capital: number
      
        Plazos: number
      
        TipoDesembolsoID: number
      
        CreditoID?: number
      
        MovimientoID?: number
      
        personasDatosBancariosID?: number
      
        VentaId: number
      
        token?: string
      
        valeTipoId?: number
      
        telefono?: string
      
        valeDigital: boolean
      
        codigoValeDig?: string
      
        consecutivoDia: number
      
        estatus: string
      
        codigoValidacion?: string
      
        validado?: boolean
      
        destinoCreditoId?: number
      
        tipoUsuario?: string
      
        fecha: string
      
        fechaRegistro?: string
      
        fhValidacion?: string
      
        PersonaID?: number
      
        UsuarioID: number
      
        CajaID?: number
      
        fechaCancelacion: string
      
        idUsuarioCancelacion: number

    }
    export interface ICatalogoTipoCredito {
              
        TipoCreditoID: number
      
        Descripcion: string
      
        Clave: string

    }
    export interface IClasificadorGrupos {
              
        ClasificadorGrupoID: number
      
        Descripcion: string
      
        UsuarioCreoID: number
      
        Fecha: string
      
        UsuarioModID?: number
      
        FechaMod?: string

    }
    export interface IClientes {
              
        ClienteID: number
      
        PersonaID: number
      
        LineaCreditoPersonal: number
      
        PagareEstatusId: number
      
        PagareCantidad?: number
      
        CreacionPersonaID: number
      
        CreacionFecha: string
      
        IdentificadorAnterior?: string
      
        FechaUltimoCredito?: string
      
        CreacionUsuarioID: number
      
        AltaEnApp?: boolean
      
        CanjeaVale?: boolean
      
        FrenteINE?: string
      
        ReversoINE?: string

    }
    export interface IClientes_VW {
              
        ClienteID: number
      
        PersonaID: number
      
        LineaCreditoPersonal?: number
      
        PagareEstatusId?: number
      
        CanjeaVale?: boolean
      
        PagareCantidad?: number
      
        CreacionPersonaID?: number
      
        CreacionFecha?: string
      
        IdentificadorAnterior?: string
      
        CreacionUsuarioID?: number
      
        FechaUltimoCredito?: string
      
        pagareEstatusDesc?: string
      
        NombreDistribuidor?: string
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        NombreCompleto: string
      
        FechaNacimiento: string
      
        LugarNacimiento: string
      
        CURP: string
      
        RFC: string
      
        SexoID: string
      
        EstadoCivilID?: string
      
        IngresosMensuales: number
      
        DependientesEconomicos?: number
      
        TelefonoDomicilio?: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        NombreConyuge: string
      
        ProductoID?: number
      
        DistribuidorID?: number
      
        EsttausId?: boolean
      
        Sexo?: string
      
        Escolaridad?: string
      
        EstadoCivil?: string
      
        EscolaridadID?: number
      
        BuroInternoEstatusID?: number
      
        BuroInternoEstatus?: string
      
        BuroInternoEstatusPuedeCanjear?: boolean
      
        Observaciones?: string
      
        identificacionTipoId?: number
      
        identificacionTipo?: string
      
        identificacionNumero?: string
      
        canjeValeSolicitudId?: number
      
        BuroInternoColor?: string

    }
    export interface IClienteSaldo_VW {
              
        ClienteID: number
      
        CreditoID: number
      
        NombreCompleto: string
      
        FechaHoraUltimoPago?: string
      
        CapitalPagado: number
      
        SaldoActual?: number
      
        DistribuidorID?: number
      
        ProductoID: number

    }
    export interface IClientesCreditosVw {
              
        CreditoID: number
      
        ClienteID: number
      
        EstatusID: string
      
        Plazos: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal?: number
      
        NombreCompleto: string
      
        RFC: string
      
        FechaHoraRegistro: string

    }
    export interface ICodigosTiendita {
              
        CodigoID: number
      
        SKU: number
      
        Descuento: number
      
        SucursalID: number
      
        DistribuidorID: number
      
        ClienteID?: number
      
        Motivo: string
      
        Estatus: string
      
        PersonaRegistraID: number
      
        UsuarioRegistraID: number
      
        FechaRegistra: string
      
        PersonaModificaID?: number
      
        UsuarioModificaID?: number
      
        FechaModifica?: string
      
        PersonaCancelaID?: number
      
        UsuarioCancelaID?: number
      
        FechaCancela?: string

    }
    export interface IComisiones {
              
        ProductoID: number
      
        ComisionesID: number
      
        Descripcion: string
      
        Activo: boolean
      
        RegistroUsuarioId: number
      
        RegistroFecha: string
      
        PersonaIDRegistro?: number
      
        ModificaUsuarioId: number
      
        ModificaFecha: string

    }
    export interface IComisiones_VW {
              
        ComisionesID: number
      
        Descripcion: string
      
        Activo: boolean
      
        ProductoID: number
      
        Producto?: string
      
        RegistroUsuarioId: number
      
        ModificaUsuarioId: number
      
        RegistroFecha: string
      
        ModificaFecha: string
      
        identifier?: number

    }
    export interface IComisionesConvenios {
              
        ProductoID: number
      
        ComisionesID: number
      
        ConvenioID: number
      
        Activo: boolean
      
        RegistroUsuarioId: number
      
        RegistroFecha: string
      
        PersonaIDRegistro?: number
      
        ModificaUsuarioId?: number
      
        ModificaFecha?: string

    }
    export interface IComisionesConvenios_VW {
              
        ConvenioID: number
      
        descripcion: string
      
        ProductoID: number
      
        convenio: string
      
        fhRegistro: string
      
        nombreComercialEmpresa: string
      
        cuentaBancaria: string
      
        activo: boolean
      
        BancoID: number
      
        ComisionesID: number
      
        RegistroUsuarioId: number
      
        RegistroFecha: string
      
        PersonaIDRegistro?: number
      
        ModificaUsuarioId?: number
      
        ModificaFecha?: string

    }
    export interface IComisionesDetalle {
              
        ProductoID: number
      
        ComisionesID: number
      
        RenglonId: number
      
        DistribuidorNivelID: number
      
        DistribuidorNivelIDOrigen: number
      
        Activo: boolean
      
        DiasMin: number
      
        DiasMax: number
      
        PorcComision: number
      
        PorcComisionReal: number
      
        porcMonedero: number
      
        porcMonederoReal: number
      
        RegistroUsuarioId?: number
      
        fhRegitro: string
      
        PersonaIDRegistro?: number
      
        ModificaUsuarioId?: number
      
        fhMoficiacion: string
      
        DistribuidorNivelID2?: number

    }
    export interface IComisionesDetalle_VW2 {
              
        ProductoID: number
      
        ComisionesID: number
      
        RenglonId: number
      
        DistribuidorNivelID: number
      
        DistribuidorNivel?: string
      
        DistribuidoNivelrOrigenID?: number
      
        DistribuidorNivelOrigen?: string
      
        Activo: boolean
      
        DiasMin: number
      
        DiasMax: number
      
        PorcComision: number
      
        PorcComisionReal: number
      
        porcMonedero: number
      
        porcMonederoReal: number

    }
    export interface IComisionesDetalle_VW3 {
              
        DistribuidorNivelOrigen?: string
      
        DistribuidorNivel?: string
      
        ProductoID: number
      
        ComisionesID: number
      
        RenglonId: number
      
        DistribuidorNivelID: number
      
        DistribuidorNivelIDOrigen: number
      
        Activo: boolean
      
        DiasMin: number
      
        DiasMax: number
      
        PorcComision: number
      
        PorcComisionReal: number
      
        porcMonedero: number
      
        porcMonederoReal: number
      
        RegistroUsuarioId?: number
      
        fhRegitro: string
      
        PersonaIDRegistro?: number
      
        ModificaUsuarioId?: number
      
        fhMoficiacion: string
      
        DistribuidorNivelID2?: number

    }
    export interface IComisionesSucursal {
              
        ProductoID: number
      
        SucursalId: number
      
        ComisionesID: number
      
        RegistroUsuarioId: number
      
        RegistroFecha: string
      
        PersonaIDRegistro?: number
      
        ModificaUsuarioId: number
      
        ModificaFecha: string

    }
    export interface IComisionesSucursales_VW {
              
        ComisionesID: number
      
        SucursalId: number
      
        Nombre?: string
      
        ProductoID: number
      
        Producto?: string
      
        empresaNombre?: string
      
        Descripcion?: string
      
        UsuarioRegistro?: string
      
        RegistroFecha: string
      
        UsuarioModifica?: string
      
        ModificaFecha: string

    }
    export interface IConceptosReestructura {
              
        ConceptoReestructuraID: number
      
        Concepto?: string

    }
    export interface ICondiciones {
              
        ProductoID: number
      
        CondicionesID: number
      
        Descripcion: string
      
        Activo: boolean
      
        RegistroFecha: string
      
        RegistroUsuarioId: number
      
        PersonaIDRegistro?: number
      
        ModificoFecha: string
      
        ModificoUsuarioId: number

    }
    export interface ICondiciones_VW {
              
        CondicionesID: number
      
        Descripcion: string
      
        Activo: boolean
      
        ProductoID: number
      
        Producto?: string

    }
    export interface ICondicionesDetalle {
              
        ProductoID: number
      
        CondicionesID: number
      
        RenglonId: number
      
        DistribuidorNivelId: number
      
        DistribuidorNivelIdOri: number
      
        Activo: boolean
      
        PlazosMinimos: number
      
        PlazosMaximos: number
      
        ImporteMinimo: number
      
        ImporteMaximo: number
      
        ImporteMaximo1erCanje: number
      
        ImporteMaximo2doCanje: number
      
        PorcTasaPlazo: number
      
        SeguroPlazo: number
      
        PorcIVA: number
      
        Cargo: number
      
        ManejoCuenta: number
      
        PlazosFijos: number
      
        PorcTasaMensual: number
      
        PorcTasaAnual: number
      
        PagoXMilMinimo: number
      
        PagoXMilMaximo: number
      
        PorcCreditosActivosMax: number
      
        PlazosEspeciales: boolean
      
        CapitalCorte?: number
      
        UsuarioRegistro?: number
      
        fhRegistro: string
      
        UsuarioModifico?: number
      
        fhModificacion?: string
      
        PersonaIDRegistro?: number
      
        ImporteMaximo3erCanje?: number
      
        CostoAnualTotal?: number
      
        ImporteMinimo1erCanje?: number
      
        ImporteMinimo2doCanje?: number
      
        ImporteMinimo3erCanje?: number

    }
    export interface ICondicionesDetalle_VW {
              
        ProductoID: number
      
        CondicionesID: number
      
        Descripcion: string
      
        Activo: boolean
      
        RegistroFecha: string
      
        RegistroUsuarioId: number
      
        ModificoFecha: string
      
        ModificoUsuarioId: number
      
        SucursalId: number
      
        ModificaUsuarioId: number
      
        ModificaFecha: string
      
        RenglonId: number
      
        DistribuidorNivelId: number
      
        DistribuidorNivelOrigenID: number
      
        PlazosMinimos: number
      
        PlazosMaximos: number
      
        ImporteMinimo: number
      
        ImporteMaximo: number
      
        ImporteMaximo1erCanje: number
      
        ImporteMaximo2doCanje: number
      
        PorcTasaPlazo: number
      
        SeguroPlazo: number
      
        PorcIVA: number
      
        Cargo: number
      
        ManejoCuenta: number
      
        PlazosFijos: number
      
        fhRegistro: string
      
        fhModificacion?: string
      
        PorcTasaMensual: number
      
        PorcTasaAnual: number
      
        PagoXMilMinimo: number
      
        PagoXMilMaximo: number
      
        PlazosEspeciales: boolean
      
        DistribuidorID?: number
      
        DistribuidoresEstatusID?: string
      
        NoCreditosActivos?: number
      
        FechaHoraRegistro?: string
      
        UsuarioIDRegistro?: number
      
        NumeroDist?: string
      
        GestorID?: number
      
        ValidaContrato?: boolean
      
        tipoRelacionID?: number
      
        ReferenciaContable?: number
      
        numCreditosPersonales?: number
      
        DistribuidorNivel?: string
      
        PorcComisionBase?: number
      
        CapitalColocadoMinimo?: number
      
        CapitalColocadoMaximo?: number
      
        ImporteProteccionSaldo?: number
      
        importeMaxCanje?: number
      
        maximoPrestamoPersonal?: number
      
        maximoImporteCanjeCliente?: number
      
        maximoImporteCanjeAval?: number
      
        CapitalCorte?: number

    }
    export interface ICondicionesDetalle_VW2 {
              
        ProductoID: number
      
        CondicionesID: number
      
        RenglonId: number
      
        DistribuidorNivelId: number
      
        DistribuidorNivel?: string
      
        DistribuidorNivelOrigenID: number
      
        DistribuidorNivelOrigen?: string
      
        Activo: boolean
      
        PlazosMinimos: number
      
        PlazosMaximos: number
      
        ImporteMinimo: number
      
        ImporteMaximo: number
      
        ImporteMaximo1erCanje: number
      
        ImporteMaximo2doCanje: number
      
        ImporteMinimo1erCanje?: number
      
        ImporteMinimo2doCanje?: number
      
        ImporteMinimo3erCanje?: number
      
        PorcTasaPlazo: number
      
        SeguroPlazo: number
      
        PorcIVA: number
      
        fhModificacion?: string
      
        fhRegistro: string
      
        Cargo: number
      
        ManejoCuenta: number
      
        PlazosFijos: number
      
        PorcTasaMensual: number
      
        PorcTasaAnual: number
      
        PagoXMilMinimo: number
      
        PagoXMilMaximo: number
      
        PlazosEspeciales: boolean
      
        CapitalCorte?: number
      
        PorcCreditosActivosMax: number
      
        ImporteMaximo3erCanje?: number
      
        CostoAnualTotal?: number

    }
    export interface ICondicionesSucursal {
              
        ProductoID: number
      
        SucursalId: number
      
        CondicionesID: number
      
        RegistroUsuarioId: number
      
        RegistroFecha: string
      
        ModificaUsuarioId: number
      
        ModificaFecha: string
      
        PersonaIDRegistro?: number

    }
    export interface ICondicionessucursales_VW {
              
        CondicionesID: number
      
        SucursalId: number
      
        Nombre?: string
      
        ProductoID: number
      
        Producto?: string
      
        empresaNombre?: string
      
        Descripcion?: string
      
        UsuarioRegistro?: string
      
        RegistroFecha: string
      
        UsuarioModifica?: string
      
        ModificaFecha: string

    }
    export interface IContratos {
              
        ContratoID: number
      
        ProductoID: number
      
        Activo: boolean
      
        FechaHoraRegistro: string
      
        LineaCredito: number
      
        LineaCreditoDisponible?: number
      
        SaldoActual?: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        Abonos: number
      
        Comision: number
      
        ImporteTotal?: number
      
        DiasAtraso: number
      
        DiasAtrasoMaximo: number
      
        SaldoAtrasado: number
      
        CapitalPagado: number
      
        NoCreditosActivos: number
      
        PagosAtrasados: number
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        FechaHoraUltimoPago?: string
      
        PagoPuntualUltmoPago?: boolean
      
        Reestructura?: number
      
        CapitalPendiente?: number
      
        InteresPendiente?: number
      
        IVAPendiente?: number
      
        ManejoCuentaPendiente?: number
      
        SeguroPendiente?: number
      
        CargoPendiente?: number
      
        Ciclo: number
      
        PersonaId: number
      
        convenioTipoID: number
      
        capitalPendienteDisponible: number
      
        PersonaIDRegistro: number
      
        DistribuidorID?: number
      
        UsuarioIDRegistro: number
      
        FechaHoraUltimoIncremento?: string
      
        creditoPromotorId?: number
      
        validaContratoUsuarioId?: number
      
        fechaHoraValidaContrato?: string
      
        PlazosEspeciales?: boolean
      
        PersonaIDValidaContrato?: number
      
        solicitudRefID?: number
      
        usuarioIdValidaContrato?: number
      
        Validado: boolean

    }
    export interface IContratos_VW {
              
        ContratoID: number
      
        ProductoID: number
      
        Activo: boolean
      
        ProductoNombre?: string
      
        productoActivo?: boolean
      
        LineaCredito: number
      
        LineaCreditoDisponible?: number
      
        SaldoActual?: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        Abonos: number
      
        ImporteTotal?: number
      
        DiasAtraso: number
      
        DiasAtrasoMaximo: number
      
        SaldoAtrasado: number
      
        CapitalPagado: number
      
        NoCreditosActivos: number
      
        PagosAtrasados: number
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        FechaHoraUltimoPago?: string
      
        PagoPuntualUltmoPago?: boolean
      
        Reestructura?: number
      
        CapitalPendiente?: number
      
        InteresPendiente?: number
      
        IVAPendiente?: number
      
        ManejoCuentaPendiente?: number
      
        SeguroPendiente?: number
      
        CargoPendiente?: number
      
        Ciclo: number
      
        convenioTipoID: number
      
        convenioTipoNombre?: string
      
        convenioTipoActivo?: boolean
      
        DistribuidorID?: number
      
        DistribuidorNombre?: string
      
        FechaHoraRegistro: string
      
        PersonaIDRegistro: number
      
        CapitalColocadoMinimo?: number
      
        CapitalColocadoMaximo?: number
      
        IncrementoQuincena?: number
      
        EmpresaId?: number
      
        Principal?: boolean

    }
    export interface IContratosConveniosTipos {
              
        convenioTipoID: number
      
        convenioDesc: string
      
        factorBonificacion: number
      
        porcBonificacion?: number
      
        validaSaldo: boolean
      
        saldoMin: number
      
        saldoMax: number
      
        plazosFijos: number
      
        activo: boolean

    }
    export interface IContratosHistorico {
              
        Fecha: string
      
        ContratoID: number
      
        ProductoID: number
      
        FechaHoraRegistro: string
      
        UsuarioIDRegistro: number
      
        LineaCredito: number
      
        LineaCreditoDisponible: number
      
        SaldoActual: number
      
        Capital: number
      
        Interes: number
      
        Comision: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        Abonos: number
      
        ImporteTotal: number
      
        DiasAtraso: number
      
        DiasAtrasoMaximo: number
      
        SaldoAtrasado: number
      
        CapitalPagado: number
      
        NoCreditosActivos: number
      
        PagosAtrasados: number
      
        InteresPagado: number
      
        IVAPagado: number
      
        ComisionPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        FechaHoraUltimoPago?: string
      
        CapitalPendiente: number
      
        InteresPendiente: number
      
        IVAPendiente: number
      
        ComisionPendiente: number
      
        SeguroPendiente: number
      
        CargoPendiente: number
      
        Ciclo: number
      
        PersonaId: number
      
        coordinadorID: number
      
        convenioTipoID: number
      
        capitalPendienteDisponible: number
      
        DistribuidorID?: number

    }
    export interface IContratosLineasAdicionales {
              
        ContratoID: number
      
        LineaAdicionalTipoID: number
      
        LineaCredito: number
      
        LineaCreditoDisponible: number
      
        SaldoActual: number
      
        NoCreditosActivos: number
      
        CapitalColocado: number
      
        FechaHoraRegistro: string
      
        PersonaIDRegistro: number
      
        UsuarioIDRegistro: number

    }
    export interface IContratosLineasAdicionalesHistorico {
              
        fecha: string
      
        ContratoID: number
      
        LineaAdicionalTipoID: number
      
        LineaCredito: number
      
        LineaCreditoDisponible: number
      
        SaldoActual: number
      
        NoCreditosActivos: number
      
        CapitalColocado: number
      
        FechaHoraRegistro: string
      
        PersonaIDRegistro: number
      
        UsuarioIDRegistro: number

    }
    export interface IContratosLineasAdicionalesLogCambios {
              
        fhCambio: string
      
        ContratoID: number
      
        LineaAdicionalTipoID: number
      
        LineaCredito?: number
      
        FechaHoraRegistro?: string
      
        dbuser?: string
      
        sesionId?: number
      
        PersonaIDRegistro?: number
      
        PersonaIDCambio?: number
      
        UsuarioIDCambio?: number
      
        UsuarioIDRegistro?: number

    }
    export interface IContratosNotas {
              
        ContratoNotaId: number
      
        ContratoId: number
      
        FHRegistro?: string
      
        Nota: string
      
        PersonaID: number
      
        UsuarioID: number

    }
    export interface IContratosRPM {
              
        ContratoID: number
      
        empresaId: number
      
        ContratoRPM: number
      
        RazonSocial: string
      
        UsuarioRegistraID: number
      
        UsuarioModificaID?: number
      
        FechaAlta: string
      
        FechaModifica?: string

    }
    export interface ICoordinadores {
              
        CoordinadorID: number
      
        SucursalID: number
      
        GrupoID?: number
      
        CarteraVencida: boolean
      
        ImprimirRelacionesMasivas: boolean
      
        EstadoCoordinadorId: string
      
        CreacionFecha: string
      
        CreacionPersonaId?: number
      
        ModificacionFecha?: string
      
        ModificacionPersonaId?: number
      
        CreacionUsuarioId?: number
      
        ModificacionUsuarioId?: number

    }
    export interface ICoordinadores_Distribuidores {
              
        CoordinadorID: number
      
        fhRegistro: string
      
        fhModificacion: string
      
        DistribuidorID: number

    }
    export interface ICoordinadores_Distribuidores__EstatusVW {
              
        DistribuidorID: number
      
        DistribuidoresEstatusID?: string
      
        CoordinadorID: number
      
        SucursalID: number
      
        GrupoID?: number
      
        CarteraVencida: boolean
      
        ImprimirRelacionesMasivas: boolean
      
        EstadoCoordinadorId: string
      
        CreacionFecha: string
      
        CreacionPersonaId?: number
      
        ModificacionFecha?: string
      
        ModificacionPersonaId?: number
      
        CreacionUsuarioId?: number
      
        ModificacionUsuarioId?: number

    }
    export interface ICoordinadores_VW {
              
        CoordinadorID: number
      
        ZonaID?: number
      
        ZonaNombre?: string
      
        SucursalID: number
      
        SucursalNombre?: string
      
        CarteraVencida: boolean
      
        ImprimirRelacionesMasivas: boolean
      
        EstadoCoordinadorId: string
      
        EstadoCoordinadorNombre?: string
      
        EstadoCoordinadorColor?: string
      
        PersonaID?: number
      
        NombreCompleto?: string
      
        CURP?: string
      
        RFC?: string
      
        SexoID?: string
      
        Sexo?: string
      
        EstadoCivilID?: string
      
        EstadoCivil?: string
      
        EscolaridadID?: number
      
        Escolaridad?: string
      
        IngresosMensuales?: number
      
        DependientesEconomicos?: number
      
        TelefonoDomicilio?: string
      
        TelefonoMovil?: string
      
        CorreoElectronico?: string
      
        NombreConyuge?: string

    }
    export interface ICoordinadoresDistribuidores_VW {
              
        DistribuidorID: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidorNivelID?: number
      
        NoCreditosActivos: number
      
        FechaHoraRegistro: string
      
        UsuarioIDRegistro: number
      
        SucursalID: number
      
        NumeroDist: string
      
        GestorID?: number
      
        ValidaContrato: boolean
      
        tipoRelacionID: number
      
        ReferenciaContable: number
      
        creditoPromotorId?: number
      
        validaContratoUsuarioId?: number
      
        fechaHoraValidaContrato?: string
      
        usuarioIdValidaContrato?: number
      
        numCreditosPersonales: number
      
        PlazosEspeciales?: boolean
      
        NombreCompleto: string
      
        CoordinadorID: number
      
        ProductoID: number
      
        UsuarioID: number
      
        fechaCorte?: string
      
        saldoPlazo?: number
      
        saldoAtrasado?: number
      
        pagosAtr?: number

    }
    export interface ICoordinadoresDistribuidoresHistorico_VW {
              
        DistribuidorID: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidorNivelID: number
      
        NoCreditosActivos: number
      
        FechaHoraRegistro: string
      
        UsuarioIDRegistro: number
      
        SucursalID: number
      
        NumeroDist: string
      
        GestorID?: number
      
        ValidaContrato: boolean
      
        tipoRelacionID: number
      
        ReferenciaContable: number
      
        creditoPromotorId?: number
      
        validaContratoUsuarioId?: number
      
        fechaHoraValidaContrato?: string
      
        usuarioIdValidaContrato?: number
      
        numCreditosPersonales: number
      
        PlazosEspeciales?: boolean
      
        NombreCompleto: string
      
        CoordinadorID: number
      
        ProductoID: number
      
        UsuarioID: number
      
        fechaCorte?: string
      
        saldoPlazo?: number
      
        saldoAtrasado?: number
      
        pagosAtr?: number

    }
    export interface ICreditos {
              
        ContratoID: number
      
        CreditoID: number
      
        EstatusID: string
      
        ClienteID: number
      
        Plazos: number
      
        ProductoID: number
      
        CondicionesID: number
      
        CondicionesRenglonId: number
      
        SucursalID: number
      
        DistribuidorNivelID: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal?: number
      
        Abonos: number
      
        Comision?: number
      
        SaldoActual?: number
      
        DiasAtraso?: number
      
        DiasAtrasoMaximo: number
      
        SaldoAtrasado: number
      
        FechaHoraRegistro: string
      
        FechaHoraDesembolso?: string
      
        FechaHoraUltimoPago?: string
      
        SerieId?: number
      
        ValeCanje?: number
      
        CapitalPagado: number
      
        CapitalPendientes?: number
      
        UsuarioIDRegistro: number
      
        MovimientoID?: number
      
        PagosAtrasados: number
      
        TipoDesembolsoID?: number
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        PorcCapital?: number
      
        PorcInteres?: number
      
        PorcManejoCuenta?: number
      
        PorcCargo?: number
      
        PorcIVA?: number
      
        PorcSeguro?: number
      
        MotivoCancelacionID: number
      
        TasaInteres: number
      
        TasaIVA: number
      
        CostoSeguroPlazo: number
      
        DispersionID?: number
      
        PuedeDispersar: boolean
      
        CostoSeguroDistribuidorXMil: number
      
        PrimerVencimiento?: string
      
        UltimoVencimiento?: string
      
        PlazosAdicionales: number
      
        FHGeneracionPlazosAdicionales?: string
      
        LineaAdicionalTipoID?: number
      
        referenciaMigracion?: number
      
        creditoClasificacionId: number
      
        fechaPP?: string
      
        primaSeguro: number
      
        capitalPendienteDisponible: number
      
        fechaHoraActivacion?: string
      
        pagoModa?: number
      
        PersonaIDRegistro: number
      
        Reestructura?: boolean
      
        ReestructuraCreditoID?: number
      
        VentaId?: number
      
        ReferenciaODP?: string
      
        ConceptoODP?: string
      
        PrestamoNomina: boolean
      
        refMigracionSis?: number
      
        Observaciones?: string
      
        movCli?: number
      
        personasDatosBancariosID?: number
      
        FechaVencimientoActual?: string
      
        CreditoAnteriorID?: number
      
        ConvenioID?: number
      
        ReintentoDispersion: boolean
      
        ReintentosDeDispersion: number
      
        CajaID?: number
      
        Autorizado?: boolean
      
        UsuarioIDModifico?: number
      
        FechaHoraModificacion?: string
      
        MvCancelacion?: string
      
        NombreBeneficiario?: string
      
        ParentescoBeneficiario?: string
      
        FechaNacimientoBeneficiario?: string
      
        ApellidoPaternoBeneficiario?: string
      
        ApellidoMaternoBeneficiario?: string
      
        DistribuidorNivelOrigenID?: number
      
        TipoCancelacionID?: number
      
        Tiendita?: number
      
        TipoCreditoID?: number
      
        IDExterno?: string
      
        IDSisFecha?: string
      
        ref_ban?: number
      
        ODPBancomerEnvioID?: number

    }
    export interface ICreditos_VW {
              
        ContratoID: number
      
        CreditoID: number
      
        EstatusID: string
      
        ClienteID: number
      
        Plazos: number
      
        ProductoID: number
      
        CondicionesID: number
      
        CondicionesRenglonId: number
      
        SucursalID: number
      
        SucursalNombre: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        DistribuidorNivelID: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal: number
      
        Abonos: number
      
        SaldoActual: number
      
        DiasAtraso?: number
      
        DiasAtrasoMaximo: number
      
        SaldoAtrasado: number
      
        FechaHoraRegistro: string
      
        FechaHoraDesembolso: string
      
        FechaHoraUltimoPago: string
      
        ValeCanje?: number
      
        CapitalPagado: number
      
        CapitalPendientes?: number
      
        UsuarioIDRegistro: number
      
        MovimientoID: number
      
        Bal_Apl?: number
      
        EstatusMovimiento?: number
      
        EstatusDescMovimiento?: string
      
        PagosAtrasados: number
      
        TipoDesembolsoID?: number
      
        TipoDesembolso?: string
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        PorcCapital?: number
      
        PorcInteres?: number
      
        PorcManejoCuenta?: number
      
        PorcCargo?: number
      
        PorcIVA?: number
      
        PorcSeguro?: number
      
        MotivoCancelacionID: number
      
        TasaInteres: number
      
        TasaIVA: number
      
        CostoSeguroPlazo: number
      
        DispersionID: number
      
        PuedeDispersar: boolean
      
        CostoSeguroDistribuidorXMil: number
      
        PrimerVencimiento?: string
      
        UltimoVencimiento?: string
      
        PlazosAdicionales: number
      
        FHGeneracionPlazosAdicionales?: string
      
        LineaAdicionalTipoID?: number
      
        referenciaMigracion?: number
      
        creditoClasificacionId: number
      
        fechaPP?: string
      
        primaSeguro: number
      
        capitalPendienteDisponible: number
      
        fechaHoraActivacion?: string
      
        pagoModa?: number
      
        EmpresaId: number
      
        Producto: string
      
        Activo: boolean
      
        TasaTipoId: string
      
        TasaTipo?: string
      
        Descripcion?: string
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        FechaNacimiento: string
      
        LugarNacimiento: string
      
        CURP: string
      
        RFC: string
      
        SexoID: string
      
        Sexo?: string
      
        EstadoCivilID?: string
      
        EstadoCivil?: string
      
        EscolaridadID?: number
      
        Escolaridad?: string
      
        IngresosMensuales: number
      
        DependientesEconomicos?: number
      
        TelefonoDomicilio?: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        NombreConyuge: string
      
        BuroInternoEstatusID?: number
      
        BuroInternoEstatus?: string
      
        BuroInternoEstatusPuedeCanjear?: boolean
      
        Observaciones?: string
      
        identificacionTipoId?: number
      
        identificacionTipo?: string
      
        identificacionNumero?: string
      
        canjeValeSolicitudId: number
      
        PersonaID: number
      
        PagareCantidad: number
      
        PagareEstatusId: number
      
        pagareEstatusDesc: string
      
        LineaCreditoPersonal: number
      
        NombreCompleto: string
      
        AvalPersona?: number
      
        Aval: string
      
        AvalTelefono?: string
      
        NoCreditosActivos: number
      
        EstatusNombre?: string
      
        Distribuidor: string
      
        CelularDistribuidor: string
      
        empresaNombre?: string
      
        NombreBanco: string
      
        DispersionConvenio: string
      
        FormatoImpresionExtra?: boolean
      
        TipoMovimientoID?: number
      
        VentaId: number
      
        DistribuidorID: number
      
        CoordinadorID: number
      
        Comision?: number
      
        SerieId?: number
      
        PersonaIDRegistro: number
      
        Reestructura: boolean
      
        ReestructuraCreditoID: number
      
        BuroInternoColor: string
      
        RequiereGrupo: boolean
      
        Referencia: string
      
        Concepto: string
      
        Logo?: any
      
        LogoBanco?: any
      
        personasDatosBancariosID?: number
      
        Color?: string
      
        CajaID?: number
      
        Autorizado?: boolean
      
        Principal?: boolean
      
        PrestamoPersonal?: boolean
      
        EsReintento: boolean
      
        ReintentosDis: number
      
        EsNomina: boolean
      
        NombreCompletoRegistra: string
      
        MvCancelacion?: string
      
        NombreBeneficiario?: string
      
        ParentescoBeneficiario?: string
      
        FechaNacimientoBeneficiario?: string
      
        IDExterno?: string
      
        Tiendita?: number
      
        TipoCreditoDescripcion: string

    }
    export interface ICreditosApp {
              
        CreditosAppID: number
      
        Fecha: string
      
        CreditoID: number

    }
    export interface ICreditosCaja_VW {
              
        ContratoID: number
      
        CreditoID: number
      
        EstatusID: string
      
        ClienteID: number
      
        Plazos: number
      
        ProductoID: number
      
        CondicionesID: number
      
        CondicionesRenglonId: number
      
        SucursalID: number
      
        SucursalNombre: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        DistribuidorNivelID: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal: number
      
        Abonos: number
      
        SaldoActual: number
      
        DiasAtraso?: number
      
        DiasAtrasoMaximo: number
      
        SaldoAtrasado: number
      
        FechaHoraRegistro: string
      
        FechaHoraDesembolso: string
      
        FechaHoraUltimoPago: string
      
        ValeCanje?: number
      
        CapitalPagado: number
      
        CapitalPendientes?: number
      
        UsuarioIDRegistro: number
      
        MovimientoID: number
      
        EstatusMovimiento?: number
      
        EstatusDescMovimiento?: string
      
        PagosAtrasados: number
      
        TipoDesembolsoID?: number
      
        TipoDesembolso?: string
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        PorcCapital?: number
      
        PorcInteres?: number
      
        PorcManejoCuenta?: number
      
        PorcCargo?: number
      
        PorcIVA?: number
      
        PorcSeguro?: number
      
        MotivoCancelacionID: number
      
        TasaInteres: number
      
        TasaIVA: number
      
        CostoSeguroPlazo: number
      
        DispersionID: number
      
        PuedeDispersar: boolean
      
        CostoSeguroDistribuidorXMil: number
      
        PrimerVencimiento?: string
      
        UltimoVencimiento?: string
      
        PlazosAdicionales: number
      
        FHGeneracionPlazosAdicionales?: string
      
        LineaAdicionalTipoID?: number
      
        referenciaMigracion?: number
      
        creditoClasificacionId: number
      
        fechaPP?: string
      
        primaSeguro: number
      
        capitalPendienteDisponible: number
      
        fechaHoraActivacion?: string
      
        pagoModa?: number
      
        EmpresaId: number
      
        Producto: string
      
        Activo: boolean
      
        TasaTipoId: string
      
        TasaTipo?: string
      
        Descripcion?: string
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        FechaNacimiento: string
      
        LugarNacimiento: string
      
        CURP: string
      
        RFC: string
      
        SexoID: string
      
        Sexo?: string
      
        EstadoCivilID?: string
      
        EstadoCivil?: string
      
        EscolaridadID?: number
      
        Escolaridad?: string
      
        IngresosMensuales: number
      
        DependientesEconomicos?: number
      
        TelefonoDomicilio?: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        NombreConyuge: string
      
        BuroInternoEstatusID?: number
      
        BuroInternoEstatus?: string
      
        BuroInternoEstatusPuedeCanjear?: boolean
      
        Observaciones?: string
      
        identificacionTipoId?: number
      
        identificacionTipo?: string
      
        identificacionNumero?: string
      
        canjeValeSolicitudId: number
      
        PersonaID: number
      
        PagareCantidad: number
      
        PagareEstatusId: number
      
        pagareEstatusDesc: string
      
        LineaCreditoPersonal: number
      
        NombreCompleto: string
      
        Aval: string
      
        NoCreditosActivos: number
      
        EstatusNombre?: string
      
        Distribuidor: string
      
        CelularDistribuidor: string
      
        empresaNombre?: string
      
        NombreBanco: string
      
        DispersionConvenio: string
      
        FormatoImpresionExtra?: boolean
      
        TipoMovimientoID?: number
      
        VentaId: number
      
        DistribuidorID: number
      
        CoordinadorID: number
      
        Comision?: number
      
        SerieId?: number
      
        PersonaIDRegistro: number
      
        Reestructura: boolean
      
        ReestructuraCreditoID: number
      
        BuroInternoColor: string
      
        RequiereGrupo: boolean
      
        Referencia: string
      
        Concepto: string
      
        Logo?: any
      
        LogoBanco?: any
      
        personasDatosBancariosID?: number
      
        Color?: string
      
        CajaID?: number
      
        UsuarioID: number
      
        Autorizado?: boolean
      
        Principal?: boolean
      
        PrestamoPersonal?: boolean
      
        EsNomina: boolean
      
        NombreCompletoRegistra: string
      
        PPI?: boolean
      
        Tiendita?: number

    }
    export interface ICreditosPermisos_VW {
              
        UsuarioID: number
      
        ProductoID?: number
      
        ContratoID: number
      
        CreditoID: number
      
        EstatusID: string
      
        ClienteID: number
      
        Plazos: number
      
        CondicionesID: number
      
        CondicionesRenglonId: number
      
        SucursalID: number
      
        SucursalNombre: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        DistribuidorNivelID: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal: number
      
        Abonos: number
      
        SaldoActual: number
      
        DiasAtraso?: number
      
        DiasAtrasoMaximo: number
      
        SaldoAtrasado: number
      
        FechaHoraRegistro: string
      
        FechaHoraDesembolso: string
      
        FechaHoraUltimoPago: string
      
        ValeCanje?: number
      
        CapitalPagado: number
      
        CapitalPendientes?: number
      
        UsuarioIDRegistro: number
      
        MovimientoID: number
      
        PagosAtrasados: number
      
        TipoDesembolsoID?: number
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        PorcCapital?: number
      
        PorcInteres?: number
      
        PorcManejoCuenta?: number
      
        PorcCargo?: number
      
        PorcIVA?: number
      
        PorcSeguro?: number
      
        MotivoCancelacionID: number
      
        TasaInteres: number
      
        TasaIVA: number
      
        CostoSeguroPlazo: number
      
        DispersionID: number
      
        PuedeDispersar: boolean
      
        CostoSeguroDistribuidorXMil: number
      
        PrimerVencimiento?: string
      
        UltimoVencimiento?: string
      
        PlazosAdicionales: number
      
        FHGeneracionPlazosAdicionales?: string
      
        LineaAdicionalTipoID?: number
      
        referenciaMigracion?: number
      
        creditoClasificacionId: number
      
        fechaPP?: string
      
        primaSeguro: number
      
        capitalPendienteDisponible: number
      
        fechaHoraActivacion?: string
      
        pagoModa?: number
      
        EmpresaId: number
      
        Producto: string
      
        Activo: boolean
      
        TasaTipoId: string
      
        TasaTipo?: string
      
        Descripcion?: string
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        FechaNacimiento: string
      
        LugarNacimiento: string
      
        CURP: string
      
        RFC: string
      
        SexoID: string
      
        Sexo?: string
      
        EstadoCivilID?: string
      
        EstadoCivil?: string
      
        EscolaridadID?: number
      
        Escolaridad?: string
      
        IngresosMensuales: number
      
        DependientesEconomicos?: number
      
        TelefonoDomicilio?: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        NombreConyuge: string
      
        BuroInternoEstatusID?: number
      
        BuroInternoEstatus?: string
      
        BuroInternoEstatusPuedeCanjear?: boolean
      
        Observaciones?: string
      
        identificacionTipoId?: number
      
        identificacionTipo?: string
      
        identificacionNumero?: string
      
        canjeValeSolicitudId: number
      
        PersonaID: number
      
        PagareCantidad: number
      
        PagareEstatusId: number
      
        pagareEstatusDesc: string
      
        LineaCreditoPersonal: number
      
        NombreCompleto: string
      
        Aval: string
      
        NoCreditosActivos: number
      
        EstatusNombre?: string
      
        Distribuidor: string
      
        CelularDistribuidor: string
      
        empresaNombre?: string
      
        NombreBanco: string
      
        DispersionConvenio: string
      
        FormatoImpresionExtra?: boolean
      
        TipoMovimientoID?: number
      
        VentaId: number
      
        DistribuidorID: number
      
        CoordinadorID: number
      
        Comision?: number
      
        SerieId?: number
      
        PersonaIDRegistro: number
      
        Reestructura: boolean
      
        ReestructuraCreditoID: number
      
        BuroInternoColor: string
      
        RequiereGrupo: boolean
      
        Referencia: string
      
        Concepto: string
      
        Logo?: any
      
        LogoBanco?: any
      
        Color?: string

    }
    export interface ICreditosReestructuraClienteFinal {
              
        ReestructuraLiquidadosNuevosID: number
      
        ContratoID: number
      
        CreditoID?: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal?: number
      
        Abonos: number
      
        Comision?: number
      
        SaldoActual?: number
      
        SaldoAtrasado: number
      
        CapitalPagado: number
      
        CapitalPendientes?: number
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        PorcCapital?: number
      
        PorcInteres?: number
      
        PorcManejoCuenta?: number
      
        PorcCargo?: number
      
        PorcIVA?: number
      
        PorcSeguro?: number
      
        TasaInteres: number
      
        TasaIVA: number
      
        CostoSeguroPlazo: number
      
        CostoSeguroDistribuidorXMil: number
      
        PrimaSeguro: number
      
        CapitalPendienteDisponible: number
      
        DiasAtraso: number
      
        HDRID?: number

    }
    export interface ICreditosReestructuraLiquidados {
              
        ReestructuraLiquidadosID: number
      
        ContratoID: number
      
        CreditoID?: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal?: number
      
        Abonos: number
      
        Comision?: number
      
        SaldoActual?: number
      
        SaldoAtrasado: number
      
        CapitalPagado: number
      
        CapitalPendientes?: number
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        PorcCapital?: number
      
        PorcInteres?: number
      
        PorcManejoCuenta?: number
      
        PorcCargo?: number
      
        PorcIVA?: number
      
        PorcSeguro?: number
      
        TasaInteres: number
      
        TasaIVA: number
      
        CostoSeguroPlazo: number
      
        CostoSeguroDistribuidorXMil: number
      
        PrimaSeguro: number
      
        CapitalPendienteDisponible: number
      
        DiasAtraso: number
      
        HDRID?: number

    }
    export interface ICreditosReestructuraNuevos {
              
        ReestructuraLiquidadosNuevosID: number
      
        ContratoID: number
      
        CreditoID?: number
      
        ReestructuraLiquidadosID: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal?: number
      
        Abonos: number
      
        Comision?: number
      
        SaldoActual?: number
      
        SaldoAtrasado: number
      
        CapitalPagado: number
      
        CapitalPendientes?: number
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        PorcCapital?: number
      
        PorcInteres?: number
      
        PorcManejoCuenta?: number
      
        PorcCargo?: number
      
        PorcIVA?: number
      
        PorcSeguro?: number
      
        TasaInteres: number
      
        TasaIVA: number
      
        CostoSeguroPlazo: number
      
        CostoSeguroDistribuidorXMil: number
      
        PrimaSeguro: number
      
        CapitalPendienteDisponible: number
      
        DiasAtraso: number
      
        CreditosIDLiquidados?: number

    }
    export interface ICreditosTiendita {
              
        CreditoID: number
      
        id_sku: number
      
        id_ticket: number
      
        UsuarioRegistroID: number
      
        FechaHoraRegistro: string
      
        UsuarioCancelacionID?: number
      
        FechaHoraCancelacion?: string

    }
    export interface ICreditoTiendita {
              
        CreditoTienditaID: number
      
        CreditoID: number
      
        SKU: string
      
        Unidades: number
      
        PrecioUnitario: number
      
        Descripcion?: string
      
        FechaRegistra?: string
      
        UsuarioRegistra?: number
      
        PersonaRegistra?: number
      
        ImporteTotal?: number
      
        EstructuraID?: number

    }
    export interface IDispersarCreditos_Archivos_VW {
              
        ContratoID: number
      
        CreditoID: number
      
        EstatusID: string
      
        ClienteID: number
      
        Plazos: number
      
        ProductoID: number
      
        CondicionesID: number
      
        CondicionesRenglonId: number
      
        SucursalID: number
      
        SucursalNombre: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        DistribuidorNivelID: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal: number
      
        Abonos: number
      
        SaldoActual: number
      
        DiasAtraso?: number
      
        DiasAtrasoMaximo: number
      
        SaldoAtrasado: number
      
        FechaHoraRegistro: string
      
        FechaHoraDesembolso: string
      
        FechaHoraUltimoPago: string
      
        ValeCanje?: number
      
        CapitalPagado: number
      
        CapitalPendientes?: number
      
        UsuarioIDRegistro: number
      
        MovimientoID: number
      
        Bal_Apl?: number
      
        EstatusMovimiento?: number
      
        EstatusDescMovimiento?: string
      
        PagosAtrasados: number
      
        TipoDesembolsoID?: number
      
        TipoDesembolso?: string
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        PorcCapital?: number
      
        PorcInteres?: number
      
        PorcManejoCuenta?: number
      
        PorcCargo?: number
      
        PorcIVA?: number
      
        PorcSeguro?: number
      
        MotivoCancelacionID: number
      
        TasaInteres: number
      
        TasaIVA: number
      
        CostoSeguroPlazo: number
      
        DispersionID: number
      
        PuedeDispersar: boolean
      
        CostoSeguroDistribuidorXMil: number
      
        PrimerVencimiento?: string
      
        UltimoVencimiento?: string
      
        PlazosAdicionales: number
      
        FHGeneracionPlazosAdicionales?: string
      
        LineaAdicionalTipoID?: number
      
        referenciaMigracion?: number
      
        creditoClasificacionId: number
      
        fechaPP?: string
      
        primaSeguro: number
      
        capitalPendienteDisponible: number
      
        fechaHoraActivacion?: string
      
        pagoModa?: number
      
        EmpresaId: number
      
        Producto: string
      
        Activo: boolean
      
        TasaTipoId: string
      
        TasaTipo?: string
      
        Descripcion?: string
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        FechaNacimiento: string
      
        LugarNacimiento: string
      
        CURP: string
      
        RFC: string
      
        SexoID: string
      
        Sexo?: string
      
        EstadoCivilID?: string
      
        EstadoCivil?: string
      
        EscolaridadID?: number
      
        Escolaridad?: string
      
        IngresosMensuales: number
      
        DependientesEconomicos?: number
      
        TelefonoDomicilio?: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        NombreConyuge: string
      
        BuroInternoEstatusID?: number
      
        BuroInternoEstatus?: string
      
        BuroInternoEstatusPuedeCanjear?: boolean
      
        Observaciones?: string
      
        identificacionTipoId?: number
      
        identificacionTipo?: string
      
        identificacionNumero?: string
      
        canjeValeSolicitudId: number
      
        PersonaID: number
      
        PagareCantidad: number
      
        PagareEstatusId: number
      
        pagareEstatusDesc: string
      
        LineaCreditoPersonal: number
      
        NombreCompleto: string
      
        AvalPersona?: number
      
        Aval: string
      
        AvalTelefono?: string
      
        NoCreditosActivos: number
      
        EstatusNombre?: string
      
        Distribuidor: string
      
        CelularDistribuidor: string
      
        empresaNombre?: string
      
        NombreBanco: string
      
        DispersionConvenio: string
      
        FormatoImpresionExtra?: boolean
      
        TipoMovimientoID?: number
      
        VentaId: number
      
        DistribuidorID: number
      
        CoordinadorID: number
      
        Comision?: number
      
        SerieId?: number
      
        PersonaIDRegistro: number
      
        Reestructura: boolean
      
        ReestructuraCreditoID: number
      
        BuroInternoColor: string
      
        RequiereGrupo: boolean
      
        Referencia: string
      
        Concepto: string
      
        Logo?: any
      
        LogoBanco?: any
      
        personasDatosBancariosID?: number
      
        Color?: string
      
        CajaID?: number
      
        Autorizado?: boolean
      
        Principal?: boolean
      
        PrestamoPersonal?: boolean
      
        EsReintento: boolean
      
        ReintentosDis: number
      
        EsNomina: boolean
      
        NombreCompletoRegistra: string
      
        MvCancelacion?: string
      
        NombreBeneficiario?: string
      
        ParentescoBeneficiario?: string
      
        FechaNacimientoBeneficiario?: string
      
        IDExterno?: string
      
        Tiendita?: number
      
        TipoCreditoDescripcion: string
      
        datoTipoID?: number
      
        cveBancoRef?: number
      
        datoBancario?: string
      
        fechaRegistro?: string
      
        DatoActivo?: boolean
      
        NombreBancoClabe?: string
      
        BancoStpID?: number
      
        TipoDatoID?: number
      
        DatoTipoDesc?: string

    }
    export interface IDispersarCreditos_VW {
              
        HoraActual: string
      
        MinutosDiferencia?: number
      
        ContratoID: number
      
        CreditoID: number
      
        EstatusID: string
      
        ClienteID: number
      
        Plazos: number
      
        ProductoID: number
      
        CondicionesID: number
      
        CondicionesRenglonId: number
      
        SucursalID: number
      
        SucursalNombre: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        DistribuidorNivelID: number
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal: number
      
        Abonos: number
      
        SaldoActual: number
      
        DiasAtraso?: number
      
        DiasAtrasoMaximo: number
      
        SaldoAtrasado: number
      
        FechaHoraRegistro: string
      
        FechaHoraDesembolso: string
      
        FechaHoraUltimoPago: string
      
        ValeCanje?: number
      
        CapitalPagado: number
      
        CapitalPendientes?: number
      
        UsuarioIDRegistro: number
      
        MovimientoID: number
      
        Bal_Apl?: number
      
        EstatusMovimiento?: number
      
        EstatusDescMovimiento?: string
      
        PagosAtrasados: number
      
        TipoDesembolsoID?: number
      
        TipoDesembolso?: string
      
        InteresPagado: number
      
        IVAPagado: number
      
        ManejoCuentaPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number
      
        PorcCapital?: number
      
        PorcInteres?: number
      
        PorcManejoCuenta?: number
      
        PorcCargo?: number
      
        PorcIVA?: number
      
        PorcSeguro?: number
      
        MotivoCancelacionID: number
      
        TasaInteres: number
      
        TasaIVA: number
      
        CostoSeguroPlazo: number
      
        DispersionID: number
      
        PuedeDispersar: boolean
      
        CostoSeguroDistribuidorXMil: number
      
        PrimerVencimiento?: string
      
        UltimoVencimiento?: string
      
        PlazosAdicionales: number
      
        FHGeneracionPlazosAdicionales?: string
      
        LineaAdicionalTipoID?: number
      
        referenciaMigracion?: number
      
        creditoClasificacionId: number
      
        fechaPP?: string
      
        primaSeguro: number
      
        capitalPendienteDisponible: number
      
        fechaHoraActivacion?: string
      
        pagoModa?: number
      
        EmpresaId: number
      
        Producto: string
      
        Activo: boolean
      
        TasaTipoId: string
      
        TasaTipo?: string
      
        Descripcion?: string
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        FechaNacimiento: string
      
        LugarNacimiento: string
      
        CURP: string
      
        RFC: string
      
        SexoID: string
      
        Sexo?: string
      
        EstadoCivilID?: string
      
        EstadoCivil?: string
      
        EscolaridadID?: number
      
        Escolaridad?: string
      
        IngresosMensuales: number
      
        DependientesEconomicos?: number
      
        TelefonoDomicilio?: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        NombreConyuge: string
      
        BuroInternoEstatusID?: number
      
        BuroInternoEstatus?: string
      
        BuroInternoEstatusPuedeCanjear?: boolean
      
        Observaciones?: string
      
        identificacionTipoId?: number
      
        identificacionTipo?: string
      
        identificacionNumero?: string
      
        canjeValeSolicitudId: number
      
        PersonaID: number
      
        PagareCantidad: number
      
        PagareEstatusId: number
      
        pagareEstatusDesc: string
      
        LineaCreditoPersonal: number
      
        NombreCompleto: string
      
        AvalPersona?: number
      
        Aval: string
      
        AvalTelefono?: string
      
        NoCreditosActivos: number
      
        EstatusNombre?: string
      
        Distribuidor: string
      
        CelularDistribuidor: string
      
        empresaNombre?: string
      
        NombreBanco: string
      
        DispersionConvenio: string
      
        FormatoImpresionExtra?: boolean
      
        TipoMovimientoID?: number
      
        VentaId: number
      
        DistribuidorID: number
      
        CoordinadorID: number
      
        Comision?: number
      
        SerieId?: number
      
        PersonaIDRegistro: number
      
        Reestructura: boolean
      
        ReestructuraCreditoID: number
      
        BuroInternoColor: string
      
        RequiereGrupo: boolean
      
        Referencia: string
      
        Concepto: string
      
        Logo?: any
      
        LogoBanco?: any
      
        personasDatosBancariosID?: number
      
        Color?: string
      
        CajaID?: number
      
        Autorizado?: boolean
      
        Principal?: boolean
      
        PrestamoPersonal?: boolean
      
        EsReintento: boolean
      
        ReintentosDis: number
      
        EsNomina: boolean
      
        NombreCompletoRegistra: string
      
        MvCancelacion?: string
      
        NombreBeneficiario?: string
      
        ParentescoBeneficiario?: string
      
        FechaNacimientoBeneficiario?: string
      
        IDExterno?: string
      
        Tiendita?: number
      
        TipoCreditoDescripcion: string
      
        datoTipoID?: number
      
        cveBancoRef?: number
      
        datoBancario?: string
      
        DatoActivo?: boolean
      
        FechaRegistroDato?: string
      
        NombreBancoClabe?: string
      
        BancoStpID?: number
      
        DatoTipoDesc?: string
      
        TipoDatoID?: number

    }
    export interface IDistribuidoresClientesGlobalVW {
              
        ProductoGrupoID: number
      
        ProductoID: number
      
        SucursalID: number
      
        ClienteID: number
      
        DistribuidorID: number
      
        NombreCompleto: string
      
        MovCli?: number
      
        ImporteTotal?: number
      
        SaldoActual?: number
      
        PagosAtrasados?: number
      
        SaldoAtrasado?: number
      
        DiasAtraso?: number
      
        FechaHoraUltimoPago?: string
      
        Capital?: number
      
        Interes?: number
      
        Seguro?: number
      
        PagoMod?: number

    }
    export interface IDistribuidoresCreditos {
              
        ProductoID: number
      
        ContratoID: number
      
        SaldoActual?: number
      
        Cartera?: number
      
        SaldoAtrasado?: number
      
        DiasAtraso?: number
      
        PagosAtrasados?: number
      
        CreditosAtrasados?: number
      
        Capital?: number
      
        Colocado?: number
      
        Interes?: number
      
        Seguro?: number
      
        CapLiquidado?: number
      
        CarteraEnRiesgo?: number
      
        saldoEnRiesgo?: number
      
        DiasDesdeUltPago?: number
      
        FechaUltimoPago?: string
      
        EstatusID: string
      
        TipoDesembolsoID?: number

    }
    export interface IDistribuidoresCredPersonales {
              
        DistribuidorID: number
      
        numCreditosPersonales?: number
      
        saldoPresPersonal?: number

    }
    export interface IDistribuidoresInfo {
              
        DistribuidorID: number
      
        NombreCompleto: string
      
        DistribuidorNivelID: number
      
        DistribuidorNivel: string
      
        DistribuidoresEstatusID?: string
      
        DistribuidoresEstatus: string
      
        PersonaNombre: string
      
        DistEstColor: string
      
        DistribuidorNivelID2?: number
      
        DistribuidoresEstatusID2?: string
      
        EmpresaId: number
      
        ProductoID: number
      
        SucursalID: number
      
        GrupoID: number
      
        Estatus: boolean
      
        ClasificadorGrupoID: number
      
        Descripcion: string
      
        CoordinadorID: number
      
        Coordinador: string

    }
    export interface IDistribuidoresLimites {
              
        DistribuidorID?: number
      
        ContratoID: number
      
        LimiteDeCredito: number
      
        Disponible?: number
      
        PorcColocacionLimite?: number
      
        CreditosActivos: number
      
        ProductoID: number
      
        Activo: boolean
      
        EmpresaId: number
      
        PersonaResponsableID?: number
      
        Producto: string

    }
    export interface IDistribuidoresRelaciones {
              
        DistribuidorID?: number
      
        UltimaRelacionFecha?: string
      
        UltRelacionImporte?: number
      
        Recuperado?: number
      
        SucursalID?: number
      
        CortesAtrasados?: number
      
        Comision?: number
      
        SaldoAtrasado?: number
      
        DiasAtraso?: number

    }
    export interface IEstatus {
              
        EstatusID: string
      
        EstatusNombre?: string
      
        Color?: string

    }
    export interface IEstatusReestructura {
              
        EstatusReestructuraID: number
      
        Clave: string
      
        Estatus: string

    }
    export interface IFiltroGlobal_VW {
              
        ProductoID: number
      
        Producto: string
      
        GrupoID: number
      
        ClasificadorGrupoID: number
      
        Descripcion: string
      
        CoordinadorID: number
      
        Coordinador: string
      
        SucursalID: number
      
        Nombre: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        PersonaResponsableID?: number
      
        DirectorID: number
      
        NombreDirector: string
      
        DistribuidorID: number
      
        NombreCompleto: string
      
        DistribuidorNivel: string
      
        DistribuidoresEstatusID?: string
      
        DistribuidoresEstatus: string
      
        LimiteDeCredito: number
      
        Disponible?: number
      
        PorcColocacionLimite?: number
      
        CreditosActivos: number
      
        SaldoActual?: number
      
        Cartera?: number
      
        SaldoAtrasado?: number
      
        DiasAtraso?: number
      
        PagosAtrasados?: number
      
        CreditosAtrasados?: number
      
        Capital?: number
      
        Colocado?: number
      
        Interes?: number
      
        Seguro?: number
      
        CapLiquidado?: number
      
        CarteraEnRiesgo?: number
      
        saldoEnRiesgo?: number
      
        DiasDesdeUltPago?: number
      
        FechaUltimoPago?: string
      
        numCreditosPersonales: number
      
        saldoPresPersonal: number
      
        UltimaRelacionFecha?: string
      
        UltRelacionImporte?: number
      
        fechaUltimoVale?: string
      
        Recuperado?: number
      
        DistEstColor: string
      
        Activo: boolean
      
        EmpresaId: number

    }
    export interface IGestores {
              
        GestorID: number
      
        Gestor: string
      
        Activo: boolean
      
        UsuarioRegistro?: number
      
        UsuarioModifico?: number

    }
    export interface IGlobal_VW {
              
        ProductoID: number
      
        Producto: string
      
        GrupoID: number
      
        EstatusDetalleGrupo: boolean
      
        UsuarioID: number
      
        ClasificadorGrupoID: number
      
        Descripcion: string
      
        CoordinadorID: number
      
        Coordinador: string
      
        SucursalID: number
      
        Nombre: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        PersonaResponsableID?: number
      
        DirectorID: number
      
        NombreDirector: string
      
        DistribuidorID: number
      
        NombreCompleto: string
      
        DistribuidorNivel: string
      
        DistribuidoresEstatusID?: string
      
        DistribuidoresEstatus: string
      
        LimiteDeCredito: number
      
        Disponible?: number
      
        PorcColocacionLimite?: number
      
        CreditosActivos: number
      
        SaldoActual?: number
      
        Cartera?: number
      
        SaldoAtrasado?: number
      
        DiasAtraso?: number
      
        PagosAtrasados?: number
      
        CreditosAtrasados?: number
      
        Capital?: number
      
        Colocado?: number
      
        Interes?: number
      
        Seguro?: number
      
        CapLiquidado?: number
      
        CarteraEnRiesgo?: number
      
        saldoEnRiesgo?: number
      
        DiasDesdeUltPago?: number
      
        FechaUltimoPago?: string
      
        numCreditosPersonales: number
      
        saldoPresPersonal: number
      
        UltimaRelacionFecha?: string
      
        UltRelacionImporte?: number
      
        fechaUltimoVale?: string
      
        Recuperado?: number
      
        DistEstColor: string
      
        Activo: boolean
      
        EmpresaId: number
      
        CortesAtrasados?: number
      
        CapitalLiq?: number
      
        PagadoCorte?: number

    }
    export interface IGlobalExp_VW {
              
        UsuarioID: number
      
        ZonaVale: string
      
        SucursalVale: string
      
        CatGrupos: string
      
        CoordinadorVale?: string
      
        DistribuidorID: number
      
        NombreCom: string
      
        LimiteCreditoID?: number
      
        DisponibleID?: number
      
        LimiteDeCreditoCS?: number
      
        DisponibleCS?: number
      
        Nivel: string
      
        OrigenIngreso: string
      
        ValesDigital: number
      
        SaldoActualID: number
      
        SaldoActualCS?: number
      
        Cartera?: number
      
        SaldoPresPer?: number
      
        CredActovps?: number
      
        NumPrestPer?: number
      
        SaldoAtrasado?: number
      
        DiasAtraso?: number
      
        PagosAtrasados?: number
      
        CreditosAtrasados?: number
      
        Capital?: number
      
        Interes?: number
      
        Seguro?: number
      
        PorcColocacionLimite?: number
      
        FechaUltimoPago?: string
      
        fechaUltimoVale?: string
      
        CapitalLiquidado?: number
      
        CarteraEnRiesgo?: number
      
        EXPEDIENTEDIG: string
      
        NombreGestor: string
      
        CONVENIO: string
      
        PENDIENTE?: number
      
        UltimaRelacionFecha?: string
      
        NumAvales?: number
      
        ContrasenaT?: number
      
        lineaTipoDescripcionCS: string
      
        SaldoEnRiesgoD?: number
      
        SaldoEnRiesgoCS: number
      
        SaldoAtrasadoD?: number
      
        SaldoAtrasadoCS?: number
      
        Recuperado?: number
      
        UltRelacionImporte?: number
      
        DiasDesdeUltPago?: number
      
        PROMOTOR?: string
      
        DistribuidoresEstatus: string
      
        FechaPrimerCanje?: string

    }
    export interface IGlobalTemp {
              
        UsuarioID: number
      
        DirectorID: number
      
        NombreDirector: string
      
        ProductoID: number
      
        Producto: string
      
        SucursalID: number
      
        Nombre: string
      
        GrupoID: number
      
        ClasificadorGrupoID: number
      
        Descripcion: string
      
        CoordinadorID?: number
      
        Coordinador?: string
      
        DistribuidorID: number
      
        NombreCompleto: string
      
        DistribuidoresEstatusID: string
      
        DistribuidoresEstatus: string
      
        DistEstColor?: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        PersonaResponsableID?: number
      
        DistribuidorNivel: string
      
        LimiteDeCredito?: number
      
        Disponible?: number
      
        SaldoActual: number
      
        Cartera?: number
      
        SaldoAtrasado?: number
      
        CreditosAtrasados?: number
      
        saldoEnRiesgo?: number
      
        Recuperado?: number
      
        Capital?: number
      
        CapLiquidado?: number
      
        CarteraEnRiesgo?: number
      
        CreditosActivos?: number
      
        DiasAtraso?: number
      
        PagosAtrasados?: number
      
        Interes?: number
      
        Seguro?: number
      
        DiasDesdeUltPago?: number
      
        FechaUltimoPago?: string
      
        numCreditosPersonales?: number
      
        saldoPresPersonal?: number
      
        UltimaRelacionFecha?: string
      
        UltRelacionImporte?: number
      
        fechaUltimoVale?: string
      
        PorcColocacionLimite?: number
      
        Colocado?: number
      
        CortesAtrasados?: number

    }
    export interface IGpoDistribuidorUsuario {
              
        GrupoID: number
      
        SucursalID: number
      
        ProductoID: number
      
        DistribuidorID: number
      
        Estatus: boolean
      
        UsuarioID: number
      
        ClasificadorGrupoID: number
      
        Descripcion: string
      
        CoordinadorID: number
      
        Coordinador: string
      
        EstUsu: boolean

    }
    export interface IGrupos {
              
        GrupoID: number
      
        ProductoID: number
      
        SucursalID: number
      
        CoordinadorID: number
      
        Estatus: boolean
      
        ClasificadorGrupoID: number
      
        UsuarioCreoID: number
      
        FechaCreacion: string
      
        UsuarioModificoID?: number
      
        FechaModificacion?: string

    }
    export interface IGrupos_VW {
              
        GrupoID: number
      
        ProductoID: number
      
        SucursalID: number
      
        CoordinadorID: number
      
        Estatus: boolean
      
        ClasificadorGrupoID: number
      
        UsuarioCreoID: number
      
        FechaCreacion: string
      
        UsuarioModificoID?: number
      
        FechaModificacion?: string
      
        Descripcion: string
      
        Producto: string
      
        Sucursal: string
      
        NombreCompleto: string

    }
    export interface IGruposDetalle {
              
        GrupoID: number
      
        DistribuidorID: number
      
        Estatus: boolean
      
        UsuarioCreoID: number
      
        FechaCreacion: string
      
        UsuarioModificoID?: number
      
        FechaModificacion?: string
      
        Reasignar?: boolean

    }
    export interface IGruposDetalle_VW {
              
        GrupoID: number
      
        DistribuidorID: number
      
        Estatus: boolean
      
        UsuarioCreoID: number
      
        FechaCreacion: string
      
        UsuarioModificoID?: number
      
        FechaModificacion?: string
      
        NombreCompleto: string
      
        CoordinadorID: number
      
        ClasificadorGrupoID: number
      
        SucursalID: number
      
        Coordinador: string
      
        Sucursal: string
      
        ProductoID: number
      
        Reasignar?: boolean

    }
    export interface IGruposDistribuidores {
              
        DistribuidorID: number
      
        GrupoID: number
      
        NombreDistribuidor: string

    }
    export interface IGruposDistribuidores_VW {
              
        DistribuidorID: number
      
        FechaHoraRegistro: string
      
        UsuarioIDRegistro: number
      
        SucursalID?: number
      
        Sucursal_Nombre: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        PersonaIDRegistro: number
      
        PersonaID?: number
      
        PersonaNombre?: string
      
        ProductoID?: number
      
        EmpresaId?: number
      
        TelefonoMovil?: string
      
        FechaNacimiento?: string
      
        ConGrupo?: boolean

    }
    export interface IGruposUsuarios {
              
        GrupoID: number
      
        UsuarioID: number
      
        Estatus: boolean
      
        UsuarioCreoID: number
      
        FechaCreacion: string
      
        UsuarioModificoID?: number
      
        FechaModificacion?: string

    }
    export interface IGruposUsuarios_VW {
              
        GrupoID: number
      
        UsuarioID: number
      
        Estatus: boolean
      
        ProductoID: number
      
        CoordinadorID: number
      
        EsttGrupo: boolean
      
        Descripcion: string
      
        Producto: string
      
        Sucursal: string
      
        NombreCompleto: string
      
        ClasificadorGrupoID: number
      
        SucursalID: number

    }
    export interface IHistorico {
              
        Fecha: string
      
        ContratoID: number
      
        CreditoID: number
      
        EstatusID: string
      
        PersonaID: number
      
        Abonos: number
      
        SaldoActual?: number
      
        DiasAtraso: number
      
        DiasAtrasoMaximo: number
      
        SaldoAtrasado: number
      
        FechaHoraUltimoPago?: string
      
        CapitalPagado: number
      
        CapitalPendientes?: number
      
        PagosAtrasados: number
      
        TipoDesembolsoID?: number
      
        InteresPagado: number
      
        IVAPagado: number
      
        ComisionPagado: number
      
        SeguroPagado: number
      
        CargoPagado: number

    }
    export interface ILogCancelaciones {
              
        LogCancelacionID: number
      
        FechaCancelacion: string
      
        CreditoID?: number
      
        AplicacionID?: number
      
        MovimientoID?: number
      
        UsuarioCancelaID: number

    }
    export interface IMecanicasMonedero {
              
        MecanicaID: number
      
        Descripcion?: string
      
        MontoBase?: number
      
        MontoRecompensa?: number
      
        FechaInicio?: string
      
        FechaFin?: string
      
        UsuarioIDRegistro?: number
      
        FechaRegistro?: string
      
        UsuarioModificacion?: number
      
        FechaModificacion?: string

    }
    export interface IMecanicasMonedero_VW {
              
        ID: number
      
        MecanicaID: number
      
        Descripcion?: string
      
        ZonaID: number
      
        Zona: string
      
        DistribuidorNivelID: number
      
        DistribuidorNivel: string
      
        ProductoID: number
      
        Producto: string

    }
    export interface IMecanicasZonas {
              
        ID: number
      
        ZonaID?: number
      
        MecanicaID?: number
      
        ProductoID?: number
      
        DistribuidorNivelID?: number
      
        Activo?: boolean

    }
    export interface IMotivosCancelacion {
              
        MotivoCancelacionID: number
      
        MotivoCancelacion: string
      
        genMovBanco: boolean
      
        UsuarioRegistro?: number
      
        UsuarioModifico?: number

    }
    export interface INivelesProductos_VW {
              
        DistribuidorNivel?: string
      
        Producto?: string
      
        ProductoID: number
      
        DistribuidorNivelID: number
      
        PorcComisionBase: number
      
        CapitalColocadoMinimo: number
      
        CapitalColocadoMaximo: number
      
        ImporteProteccionSaldo: number
      
        importeMaxCanje: number
      
        maximoPrestamoPersonal: number
      
        maximoImporteCanjeCliente: number
      
        maximoImporteCanjeAval: number
      
        monto: number
      
        IncrementoQuincena: number
      
        IncrementoQuincenaCalidadBaja: number

    }
    export interface INotas {
              
        CreditoNotaId: number
      
        CreditoID: number
      
        FHRegistro?: string
      
        Nota: string
      
        PersonaID: number
      
        UsuarioID: number

    }
    export interface INotasRapidas {
              
        NotaRapidaID: number
      
        TipoNotaID?: number
      
        DistribuidorID?: number
      
        FechaRegistro?: string
      
        UsuarioRegistra?: number
      
        Descripcion?: string

    }
    export interface INotasRapidas_VW {
              
        NotaRapidaID: number
      
        TipoNotasDesc: string
      
        DistribuidorID?: number
      
        Emisor: string
      
        Descripcion?: string
      
        FechaRegistro?: string
      
        UsuarioRegistra?: number

    }
    export interface IPagadoCorte_VW {
              
        fechaCorte: string
      
        DistribuidorID: number
      
        SucursalID: number
      
        ContratoID: number
      
        CapitalLiq?: number
      
        PagadoCorte?: number

    }
    export interface IPlanPagos {
              
        CreditoID: number
      
        NoPago: number
      
        FechaVencimiento: string
      
        FechaVencimientoClienteFinal?: string
      
        Capital: number
      
        Interes: number
      
        ManejoCuenta: number
      
        Seguro: number
      
        Cargo: number
      
        IVA: number
      
        ImporteTotal?: number
      
        Abonos: number
      
        Comision: number
      
        SaldoActual?: number
      
        FechaLiquidacion?: string
      
        DiasAtraso?: number
      
        FechaHoraUltimoPago?: string
      
        PlazoAdicional: boolean
      
        CapitalOriginal?: number
      
        InteresOriginal?: number
      
        ManejoCuentaOriginal?: number
      
        SeguroOriginal?: number
      
        CargoOriginal?: number
      
        IVAOriginal?: number
      
        FechaVencimientoOriginal?: string
      
        FechaVencimientoClienteFinalOriginal?: string
      
        PagoAnticipado?: number
      
        FechaPagoAnticipado?: string

    }
    export interface IPlanPagosHistorico {
              
        Fecha?: string
      
        CreditoID: number
      
        NoPago: number
      
        Abonos: number
      
        SaldoActual?: number
      
        FechaLiquidacion?: string
      
        DiasAtraso?: number
      
        FechaHoraUltimoPago?: string

    }
    export interface IPlazosReestructura {
              
        PlazosReestructuraID: number
      
        Plazo: number
      
        Activo?: boolean

    }
    export interface IPotecciones_VW {
              
        ProteccionID: number
      
        Minimo: number
      
        Maximo: number
      
        Monto?: number
      
        DistribuidorNivel?: string
      
        DistribuidorNivelOrigen?: string
      
        NombreCaptura?: string
      
        NombreModifica?: string

    }
    export interface IProductos {
              
        ProductoID: number
      
        EmpresaId: number
      
        Producto: string
      
        Activo: boolean
      
        TasaTipoId: string
      
        DiasPago?: string
      
        DiaParaCorte?: number
      
        PrioridadCobranza?: number
      
        RequiereDistribuidor: boolean
      
        RequiereGrupo: boolean
      
        ValidaDisponible: boolean
      
        Restructura: boolean
      
        GeneraDesembolso: boolean
      
        SeguroFinanciado: boolean
      
        Canje: boolean
      
        DesglosarIVA: boolean
      
        EdadMinima: number
      
        EdadMaxima: number
      
        CapitalAlFinal: boolean
      
        CargoFinanciado: boolean
      
        CargoAlInicio: boolean
      
        ActivaCredito: boolean
      
        CreditosLiquidadosReq: boolean
      
        PermisoEspecial: boolean
      
        ValidarCondiciones: boolean
      
        FhRegitro: string
      
        FhMoficiacion: string
      
        AplicaIVAInteres: boolean
      
        AplicaIVASeguro: boolean
      
        AplicaIVAManejoCuenta: boolean
      
        Logo?: any
      
        AdicProductoId?: number
      
        UsuarioRegistro?: number
      
        UsuarioModifico?: number
      
        CtaCapitalId?: number
      
        CtaInteresNormalId?: number
      
        CtaInteresMoraId?: number
      
        CtaIvaId?: number
      
        CtaInteresNormDeudorId?: number
      
        CtaInteresNormAcreedorId?: number
      
        CtaInteresMoraDeudorId?: number
      
        CtaInteresMoraAcreedorId?: number
      
        SerieId?: number
      
        EmpresaStpID?: number
      
        PrestamoPersonal?: boolean
      
        DescripcionApp?: string
      
        EsNomina: boolean
      
        PersonaResponsableID?: number
      
        Principal?: boolean
      
        DiasCaducidadVale?: number
      
        DiasCaducidadFolio?: number
      
        Tiendita?: boolean
      
        PPI?: boolean
      
        ProteccionSaldo?: boolean
      
        EsOperativo?: boolean
      
        CuentaMaestraId?: number
      
        AplicaComision?: boolean
      
        TipoProductoID?: number

    }
    export interface IProductosVW {
              
        ProductoID: number
      
        EmpresaId: number
      
        Producto: string
      
        Activo: boolean
      
        Principal?: boolean
      
        TasaTipoId: string
      
        DiasPago?: string
      
        DiaParaCorte?: number
      
        PrioridadCobranza?: number
      
        RequiereDistribuidor: boolean
      
        RequiereGrupo: boolean
      
        ValidaDisponible: boolean
      
        Restructura: boolean
      
        GeneraDesembolso: boolean
      
        SeguroFinanciado: boolean
      
        Canje: boolean
      
        DesglosarIVA: boolean
      
        EdadMinima: number
      
        EdadMaxima: number
      
        CapitalAlFinal: boolean
      
        CargoFinanciado: boolean
      
        CargoAlInicio: boolean
      
        ActivaCredito: boolean
      
        CreditosLiquidadosReq: boolean
      
        PermisoEspecial: boolean
      
        ValidarCondiciones: boolean
      
        FhRegitro: string
      
        FhMoficiacion: string
      
        AplicaIVAInteres: boolean
      
        AplicaIVASeguro: boolean
      
        AplicaIVAManejoCuenta: boolean
      
        Logo?: any
      
        AdicProductoId?: number
      
        CuentaMaestraId?: number
      
        UsuarioRegistro?: number
      
        UsuarioModifico?: number
      
        CtaCapitalId?: number
      
        CtaInteresNormalId?: number
      
        CtaInteresMoraId?: number
      
        CtaIvaId?: number
      
        CtaInteresNormDeudorId?: number
      
        CtaInteresNormAcreedorId?: number
      
        CtaInteresMoraDeudorId?: number
      
        CtaInteresMoraAcreedorId?: number
      
        SerieId?: number
      
        EmpresaStpID?: number
      
        PrestamoPersonal?: boolean
      
        DescripcionApp?: string
      
        EsNomina: boolean
      
        EmpresaNombre?: string
      
        PersonaResponsableID: number
      
        NombreCompleto: string
      
        empresaRazonSocial?: string
      
        DiasCaducidadFolio?: number
      
        DiasCaducidadVale?: number
      
        TipoProductoID?: number
      
        TipoProducto?: string
      
        EsOperativo?: boolean
      
        AplicaComision?: boolean
      
        EsPrestaStar?: boolean
      
        Tiendita?: boolean

    }
    export interface IPromotores {
              
        creditoPromotorId: number
      
        creditoPromotorNombre: string
      
        activo: boolean
      
        fhRegistro: string
      
        usuarioIdRegistro: number
      
        UsuarioModifico?: number
      
        SucursalID: number
      
        ProductoID: number

    }
    export interface IPromotores_VW {
              
        creditoPromotorId: number
      
        creditoPromotorNombre: string
      
        fhRegistro: string
      
        activo: boolean
      
        ProductoID?: number
      
        NombreProducto?: string
      
        SucursalID?: number
      
        ZonaNombre?: string
      
        SucursalNombre?: string
      
        UsuarioRegistro?: string

    }
    export interface IProteccionCabecero_VW {
              
        ProteccionCabeceroID: number
      
        Descripcion: string
      
        NombreCaptura?: string
      
        FechaCaptura: string
      
        NombreModifica?: string
      
        FechaModifica?: string

    }
    export interface IProtecciones {
              
        ProteccionID: number
      
        Minimo: number
      
        Maximo: number
      
        Monto?: number
      
        DistribuidorNivelID: number
      
        OrigenNivelID: number
      
        UsuarioCaptura: number
      
        UsuarioModifica?: number

    }
    export interface IProteccionesCabecero {
              
        ProteccionCabeceroID: number
      
        Descripcion: string
      
        UsuarioCaptura: number
      
        FechaCaptura: string
      
        UsuarioModifica?: number
      
        FechaModifica?: string

    }
    export interface IProteccionesForm_VW {
              
        ProteccionID: number
      
        Minimo: number
      
        Maximo: number
      
        NivelOrigenDetalle: string
      
        DistribuidorNivelDetalle?: string

    }
    export interface IProteccionesRelacion {
              
        ProteccionDetalleID: number
      
        ProteccionCabeceroID: number
      
        ProteccionID: number
      
        UsuarioCaptura: number
      
        FechaCaptura: string
      
        UsuarioModifica?: number
      
        FechaModifica?: string

    }
    export interface IProteccionesRelacion_VW {
              
        ProteccionIDDetalle: number
      
        ProteccionCabeceroDetalle?: number
      
        ProteccionDetalle?: number
      
        MinimoDetalle?: number
      
        MaximoDetalle?: number
      
        MontoDetalle?: number
      
        NivelOrigenDetalle?: string
      
        DistribuidorNivelDetalle?: string
      
        DescripcionDetalle?: string
      
        FechaCapturaDetalle: string
      
        FechaModificaDetalle?: string
      
        NombreCapturaDetalle?: string
      
        NombreModificaDetalle?: string

    }
    export interface IProteccionesSaldo {
              
        ProteccionSaldoID: number
      
        MinColocacion: number
      
        MaxColocacion: number
      
        Costo: number
      
        CostoPesimo: number

    }
    export interface IReestructura {
              
        ReestructuraID: number
      
        CreditoID?: number
      
        DistribuidorID?: number
      
        FechaCreacion?: string
      
        FechaCorte?: string
      
        TipoReestructuraID?: number
      
        MontoReestructura?: number
      
        UsuarioID?: number
      
        PersonaID?: number

    }
    export interface IReestructuraAnalista {
              
        AnalistaID: number
      
        Activo: boolean

    }
    export interface IReestructuraAnalistas_VW {
              
        AnalistaID: number
      
        PersonaID?: number
      
        NombreCompleto?: string
      
        Activo: boolean
      
        UsuarioID: number

    }
    export interface IReestructuraDetalle {
              
        ReestructuraDetalleID: number
      
        ReestructuraID?: number
      
        CreditoID?: number
      
        FechaCreacion?: string
      
        FechaCorte?: string
      
        TipoReestructuraID?: number
      
        saldoLiquidado?: number
      
        MontoReestructura?: number
      
        PersonaID?: number
      
        UsuarioID?: number

    }
    export interface IReestructuraEncargado {
              
        EncargadoID: number
      
        Activo: boolean

    }
    export interface IReestructuraEncargados_VW {
              
        EncargadoID: number
      
        PersonaID?: number
      
        NombreCompleto?: string
      
        Activo: boolean
      
        UsuarioID: number

    }
    export interface IReestructurasSolicitudes_VW {
              
        Producto: string
      
        Distribuidor: string
      
        Concepto?: string
      
        Analista?: string
      
        Estatus: string
      
        Clave: string
      
        Tipo?: string
      
        Sucursal: string
      
        TelefonoMovil: string
      
        SolicitudReestructuraID: number
      
        ProductoID: number
      
        DistribuidorID: number
      
        Plazos: number
      
        AltaUsuarioID: number
      
        AltaPersonaID: number
      
        Fecha: string
      
        ConceptoReestructuraID: number
      
        SolicitudFilePath: string
      
        MachoteFilePath?: string
      
        AnalistaUsuarioID?: number
      
        AnalistaPersonaID?: number
      
        EstatusReestructuraID: number
      
        TipoReestructuraID: number
      
        SaldoAReestructurar: number
      
        IneFrente?: string
      
        IneReverso?: string
      
        SucursalID?: number
      
        Firma?: string
      
        FechaCorte: string
      
        CreditoID?: number
      
        MovimientoIDLiquida?: number
      
        MovimientoIDCredito?: number

    }
    export interface IReferenciasPagosPersonas {
              
        ReferenciaID: number
      
        ContratoID: number
      
        ReferenciaCV: boolean
      
        ProductoID: number
      
        ProspectoID: number
      
        FechaGenerada?: string
      
        CodigoReferencia?: string
      
        ReferenciaOxxo?: string
      
        EsRefRPM?: boolean

    }
    export interface IReporte191_VW {
              
        DistribuidorID: number
      
        SucursalID: number
      
        Sucursal_Nombre: string
      
        ZonaID: number
      
        Nombre_Zona: string
      
        PersonaID?: number
      
        Socia?: string
      
        Edad?: number
      
        Fecha_Nacimiento?: string
      
        Mes_NacimientoID?: number
      
        Mes_Nacimiento?: string
      
        CoordinadorID?: number
      
        Coordinador?: string
      
        GrupoID?: number
      
        ProductoID: number

    }
    export interface IReporte221_VW {
              
        SucursalID: number
      
        Sucursal_Nombre: string
      
        ZonaID: number
      
        Nombre_Zona: string
      
        DistribuidorID?: number
      
        Socia?: string
      
        CoordinadorID?: number
      
        Coordinador?: string
      
        Tipo_Nota: string
      
        Descripcion?: string
      
        Registro_Nota?: string
      
        Fecha_Registro?: string
      
        GrupoID?: number
      
        ProductoID: number
      
        EmpresaId?: number

    }
    export interface IReporte314_VW {
              
        DistribuidorID?: number
      
        PersonaNombre?: string
      
        fechaCorte: string
      
        ClienteID?: number
      
        movCli?: number
      
        CreditoID: number
      
        NoPago: number
      
        saldoCredito?: number
      
        CapitalPlazo?: number
      
        InteresPlazo?: number
      
        SeguroPlazo?: number
      
        IvaPlazo?: number
      
        ManejoCuentaPlazo?: number
      
        PrestamoPersonal?: boolean
      
        SaldoComisionPlazo?: number
      
        ProductoTotalPlazo?: number
      
        saldoPlazo?: number
      
        SaldoUltimoCorte?: number
      
        AbonosPlazo?: number
      
        ImporteBonificacion?: number
      
        ProductoID: number
      
        EmpresaId?: number
      
        DiaID?: number
      
        MesID?: number
      
        AID?: number
      
        FechaHoraUltimoPago?: string
      
        FechaLiquidacion?: string
      
        SegundosAnticipado?: number

    }
    export interface ISolicitudCreditosCV {
              
        SolicitudCreditoID: number
      
        ClienteID: number
      
        DistribuidorID: number
      
        SucursalID: number
      
        Monto: number
      
        EstatusID: string
      
        FechaHoraRegistro: string
      
        FechaHoraAutoriza?: string
      
        FechaHoraCancela?: string
      
        UsuarioIDRegistra: number
      
        UsuarioIDAutoriza?: number
      
        UsuarioIDCancela?: string
      
        CreditoID?: number
      
        CreditoProspectoID?: number
      
        CoordenadasLatitud?: string
      
        CoordenadasLongitud?: string
      
        INNE_Frontal: string
      
        INNE_Reverso: string
      
        Selfie_INNE: any
      
        DatoBancarioID: string
      
        SistemaID: string
      
        PagareDigitalID?: number
      
        FolioVale: string
      
        FolioValeDig: string
      
        Plazos: number

    }
    export interface ISolicitudCreditosPersonales {
              
        SolicitudCreditosPersonalesID: number
      
        ProductoId: number
      
        SucursalId: number
      
        CajaID: number
      
        DistribuidorId: number
      
        CreditoId?: number
      
        Capital: number
      
        Plazos: number
      
        TipoDesembolsoID: number
      
        Estatus?: boolean
      
        UsuarioSolicitaID: number
      
        PersonaSolicitaID: number
      
        FechaSolicita: string
      
        UsuarioEstatusID?: number
      
        PersonaEstatusID?: number
      
        FechaEstatus?: string
      
        personaDatosBancariosID?: number

    }
    export interface ISolicitudCreditosPersonales_VW {
              
        SolicitudCreditosPersonalesID: number
      
        ProductoId: number
      
        SucursalId: number
      
        NombreSucursal: string
      
        CajaID: number
      
        NombreCaja: string
      
        DistribuidorId: number
      
        PersonaNombre?: string
      
        Capital: number
      
        Plazos: number
      
        TipoDesembolsoID: number
      
        TipoDesembolso: string
      
        Estatus?: boolean
      
        FechaSolicita: string
      
        UsuarioSolicitaID: number
      
        UsuarioSolicita: string
      
        PersonaSolicitaID: number
      
        PersonaSolicita: string

    }
    export interface ISolicitudReestructura {
              
        SolicitudReestructuraID: number
      
        ProductoID: number
      
        DistribuidorID: number
      
        Plazos: number
      
        AltaUsuarioID: number
      
        AltaPersonaID: number
      
        Fecha: string
      
        ConceptoReestructuraID: number
      
        SolicitudFilePath: string
      
        MachoteFilePath?: string
      
        AnalistaUsuarioID?: number
      
        AnalistaPersonaID?: number
      
        EstatusReestructuraID: number
      
        TipoReestructuraID: number
      
        SaldoAReestructurar: number
      
        IneFrente?: string
      
        IneReverso?: string
      
        SucursalID?: number
      
        Firma?: string
      
        FechaCorte: string
      
        CreditoID?: number
      
        MovimientoIDLiquida?: number
      
        MovimientoIDCredito?: number

    }
    export interface ISolicitudReestructuraClientes {
              
        SolicitudReestructuraID: number
      
        CreditoID: number

    }
    export interface ISucursalesProtecciones {
              
        SucursalProteccionID: number
      
        ProductoID: number
      
        ProteccionCabeceroID: number
      
        SucursalID: number
      
        FechaCaptura: string
      
        UsuarioCaptura: number
      
        FechaModifica?: string
      
        UsuarioModifica?: number

    }
    export interface ISucursalesProtecciones_VW {
              
        SucursalProteccionIDVista: number
      
        ProductoIDVista?: number
      
        SucursalIDVista: number
      
        ProteccionCabeceroIDVista?: number
      
        ProductoVista?: string
      
        DescripcionVista?: string
      
        SucursalVista?: string
      
        NombreCapturaVista?: string
      
        FechaCapturaVista: string

    }
    export interface ITasasTipos {
              
        TasaTipoId: string
      
        TasaTipo: string
      
        capitalizacionesPorMes: number
      
        capitalizacionesPorAnio: number
      
        UsuarioRegistro?: number
      
        UsuarioModifico?: number

    }
    export interface ITipoDocProducto {
              
        TipoDocProdID: number
      
        TipoDocumentoID: number
      
        ProductoID: number
      
        EsRequerido: boolean

    }
    export interface ITipoDocumentoImpresion {
              
        Id: number
      
        Descripcion?: string

    }
    export interface ITipoProductos {
              
        TipoProductoID: number
      
        TipoProducto: string

    }
    export interface ITipoReestructura {
              
        TipoReestructuraID: number
      
        Tipo?: string

    }
    export interface ITiposCancelacion {
              
        TipoCancelacionID: number
      
        TipoCancelacion: string

    }
    export interface ITiposNotas {
              
        TipoNotaID: number
      
        ClaveNota: string
      
        Descripcion: string
      
        FechaRegistro: string
      
        UsuarioRegistra: number
      
        FechaModificacion?: string
      
        UsuarioModifica: number

    }
    export interface IV2 {
              
        DistribuidorID?: number
      
        UltimaRelacionFecha?: string
      
        SucursalID: number
      
        UltRelacionImporte?: number
      
        Recuperado?: number
      
        CortesAtrasados?: number
      
        Comision?: number
      
        SaldoAnterior?: number

    }
    export interface IValerasValeraDetalle {
              
        fechaUltimoVale?: string
      
        DistribuidorID?: number

    }
    export interface IVentas {
              
        VentaId: number
      
        UsuarioIDRegistro: number
      
        PersonaIDRegistro: number
      
        FechaHoraRegistro?: string

    }
}