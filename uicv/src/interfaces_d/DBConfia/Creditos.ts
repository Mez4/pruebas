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

    }
    export interface IAplicaciones_VW {
              
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
      
        Sucursal: string
      
        Distribuidor: string
      
        Cliente?: string
      
        Pago?: number
      
        MovimientoIdCancelacion?: number

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

    }
    export interface IClientes_VW {
              
        ClienteID: number
      
        PersonaID: number
      
        LineaCreditoPersonal?: number
      
        PagareEstatusId?: number
      
        PagareCantidad?: number
      
        CreacionPersonaID?: number
      
        CreacionFecha?: string
      
        IdentificadorAnterior?: string
      
        CreacionUsuarioID?: number
      
        FechaUltimoCredito?: string
      
        pagareEstatusDesc?: string
      
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
      
        DistribuidorNivelIDOrigen?: number

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
    export interface ICondicionesDetalle {
              
        ProductoID: number
      
        CondicionesID: number
      
        RenglonId: number
      
        DistribuidorNivelId: number
      
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
      
        DistribuidorNivelIdOri?: number
      
        ImporteMaximo3erCanje?: number

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
      
        DistribuidorNivelOrigenID?: number
      
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
      
        DistribuidorNivelOrigenID?: number
      
        DistribuidorNivelOrigen?: string
      
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
      
        ImporteTotal?: number
      
        Abonos: number
      
        SaldoActual?: number
      
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
      
        ImporteTotal?: number
      
        Abonos: number
      
        SaldoActual?: number
      
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
      
        ImporteTotal?: number
      
        Abonos: number
      
        SaldoActual?: number
      
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
      
        pagoModa: number
      
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
      
        ImporteTotal?: number
      
        Abonos: number
      
        SaldoActual?: number
      
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
      
        pagoModa: number
      
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
      
        ImporteTotal?: number
      
        Abonos: number
      
        SaldoActual?: number
      
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
      
        pagoModa: number
      
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
      
        Autorizado?: boolean
      
        Principal?: boolean
      
        PrestamoPersonal?: boolean
      
        EsReintento: boolean
      
        ReintentosDis: number
      
        EsNomina: boolean
      
        NombreCompletoRegistra: string
      
        MvCancelacion?: string
      
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

    }
    export interface IDistribuidoresCredPersonales {
              
        DistribuidorID: number
      
        numCreditosPersonales?: number
      
        saldoPresPersonal?: number

    }
    export interface IDistribuidoresInfo {
              
        DistribuidorID: number
      
        NombreCompleto: string
      
        DistribuidorNivelID?: number
      
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
      
        SaldoActual?: number
      
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

    }
    export interface IGruposDistribuidores {
              
        DistribuidorID: number
      
        GrupoID: number
      
        NombreDistribuidor: string

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
      
        NombreCaptura: string
      
        NombreModifica: string

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
      
        CuentaMaestraId: number
      
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
      
        CuentaMaestraId: number
      
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
    export interface IProteccionCabecero_VW {
              
        ProteccionCabeceroID: number
      
        Descripcion: string
      
        NombreCaptura: string
      
        FechaCaptura?: string
      
        NombreModifica: string
      
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
      
        NombreCapturaDetalle: string
      
        NombreModificaDetalle: string

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
      
        NombreCapturaVista: string
      
        FechaCapturaVista: string
      
        NombreModificaVista: string
      
        FechaModificaVista?: string

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
    export interface ITipoReestructura {
              
        TipoReestructuraID: number
      
        Tipo?: string

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