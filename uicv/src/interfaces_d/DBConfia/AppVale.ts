export namespace DBConfia_AppVale {
        
    export interface IAppContratos_VW {
              
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
      
        Producto: string
      
        EmpresaId: number

    }
    export interface IAppCreditos_VW {
              
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
      
        pagoModa: number
      
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
      
        Activo: boolean
      
        LineaCredito: number
      
        LineaCreditoDisponible?: number
      
        NoCreditosActivos: number
      
        PagoPuntualUltmoPago?: boolean
      
        CapitalPendiente?: number
      
        InteresPendiente?: number
      
        IVAPendiente?: number
      
        ManejoCuentaPendiente?: number
      
        SeguroPendiente?: number
      
        CargoPendiente?: number
      
        Ciclo: number
      
        PersonaId: number
      
        convenioTipoID: number
      
        DistribuidorID?: number
      
        FechaHoraUltimoIncremento?: string
      
        EstatusNombre?: string

    }
    export interface IAppDirecciones_VW {
              
        PersonaID: number
      
        calle: string
      
        numExterior: string
      
        numInterior?: string
      
        colonia?: string
      
        CodigoPostal: number
      
        Municipio?: string
      
        Ciudad?: string
      
        Estado?: string
      
        CreacionFecha: string

    }
    export interface IAppDistribuidores_VW {
              
        DistribuidorID: number
      
        primerNombre?: string
      
        segundoNombre?: string
      
        primerApellido: string
      
        segundoApellido: string
      
        FechaNacimiento: string
      
        CURP: string
      
        RFC: string
      
        edad?: number
      
        categoriaId?: number
      
        telefonoId: number
      
        telefonoTipo: string
      
        telefono?: string
      
        DistribuidoresEstatusID?: string
      
        DistribuidoresEstatus: string
      
        SexoID: string
      
        CorreoElectronico?: string
      
        NombreCompleto: string
      
        fechaAutorizado?: string
      
        ProductoID: number
      
        SucursalID: number
      
        Estatus: boolean
      
        DistAntNumero?: number
      
        DistAntNumero2?: number
      
        EmpresaId: number

    }
    export interface IAppDistribuidoresClientesCreditos_VW {
              
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
    export interface IAppPersonas_VW {
              
        PersonaID: number
      
        ClienteID?: number
      
        DistribuidorID?: number
      
        CURP: string
      
        RFC: string
      
        Nombre: string
      
        primerNombre?: string
      
        segundoNombre?: string
      
        primerApellido: string
      
        segundoApellido: string
      
        FechaNacimiento: string
      
        IngresosMensuales: number
      
        TelefonoMovil: string
      
        EscolaridadID?: number
      
        NombreConyuge: string
      
        identificacionTipoId?: number
      
        identificacionNumero?: string
      
        TelefonoDomicilio?: string
      
        CorreoElectronico?: string
      
        DependientesEconomicos?: number
      
        Observaciones?: string
      
        edad?: number
      
        SexoID: string
      
        NombreCompleto: string
      
        PagareEstatusId?: number
      
        ProductoID?: number
      
        LugarNacimiento: string
      
        EstadoCivilID?: string

    }
    export interface IAppRelacionCortes_VW {
              
        DistribuidorID?: number
      
        ProductoID: number
      
        SucursalID?: number
      
        DistribuidorNivelID?: number
      
        fechaCorte?: string
      
        fechaRelacion: string
      
        limiteCredito?: number
      
        saldoAbonado?: number
      
        capital?: number
      
        saldoDisponible?: number
      
        interes?: number
      
        seguro?: number
      
        SaldoActual: number
      
        importePago?: number
      
        saldoAtrasado?: number
      
        DiasAtraso?: number
      
        saldoColocado?: number
      
        ManejoCuentaPlazo?: number
      
        CargoPlazo?: number
      
        IvaPlazo?: number

    }
    export interface IAppRelacionCortesTablaDias_VW {
              
        fecha: string
      
        fechaCorte?: string
      
        ProductoID: number
      
        DistribuidorID?: number
      
        SucursalID?: number
      
        ComisionesID: number
      
        DistribuidorNivelID: number
      
        fechaVencimiento: string
      
        Dias: number
      
        DiasMin?: number
      
        DiasMax?: number
      
        PorcComision: number
      
        PorcComisionReal: number
      
        PorcMonedero: number
      
        PorcMonederoReal: number
      
        Renglon: number
      
        FechaPago?: string

    }
    export interface IAppTiposDesembolsoDistribuidor_VW {
              
        ProductoID?: number
      
        SucursalId: number
      
        DistribuidorID: number
      
        TipoDesembolsoID: number
      
        TipoDesembolso: string
      
        RequiereDatosBancarios?: boolean
      
        EsEnApp?: boolean
      
        iconoDesembolsoTipo?: string
      
        FormatoImpresionExtra: boolean
      
        TipoMovimientoID: number
      
        Activo: boolean
      
        datoTipoID: number

    }
    export interface IAppValesDistribuidor_VW {
              
        ValeraID: number
      
        ProductoID: number
      
        serieId: number
      
        FolioInicial: number
      
        FolioFinal: number
      
        EstatusValera: string
      
        RegistroFecha: string
      
        AsignaSucursalId?: number
      
        AsignaSucursalFecha?: string
      
        ReciboSucursalFecha?: string
      
        AsignaDistribudiorFecha?: string
      
        CanceladoFecha?: string
      
        ValeraTrackingEstatusID: number
      
        RegistroPersonaID: number
      
        ValeraCabeceraID: number
      
        AsignaSucursalPersonaID?: number
      
        ReciboSucursalPersonaID?: number
      
        AsignaDistribudiorPersonaID?: number
      
        CanceladoUsuarioIdPersonaID?: number
      
        DistribuidorID?: number
      
        EnvioSucursalPersonaID?: number
      
        EnvioSucursalFecha?: string
      
        EnvioSucursalNota?: string
      
        ReciboSucursalNota?: string
      
        CodigoBarras?: string
      
        SubidaArchivoPersonaID?: number
      
        SubidaArchivoFecha?: string
      
        SucursalEnviaValera?: number
      
        SubidaArchivoPath?: string
      
        AsignaDistribudiorUsuarioId?: number
      
        AsignaSucursalUsuarioId?: number
      
        CanceladoUsuarioId?: number
      
        EnvioSucursalUsuarioId?: number
      
        ReciboSucursalUsuarioId?: number
      
        RegistroUsuarioId: number
      
        SubidaArchivoUsuarioId?: number
      
        Folio: number
      
        Estatus: string
      
        DigitalFolio?: string
      
        DigitalImporte: number
      
        DigitalPlazo: number
      
        DigitalTipoDesembolsoId?: number
      
        AdicProductoId?: number
      
        AdicImporte: number
      
        CanjeFecha?: string
      
        CanjePersonaID?: number
      
        CanceladoPersonaID?: number
      
        CanjeUsuarioId?: number
      
        ValeDigital: boolean

    }
    export interface IDestinosDeCredito {
              
        motivoTipoId: number
      
        motivoTipoDesc: string
      
        iconoMotivoTipo?: string

    }
}