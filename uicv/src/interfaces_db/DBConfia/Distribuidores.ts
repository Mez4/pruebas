export namespace DBConfia_Distribuidores {
        
    export interface IAvales {
              
        DistribuidorID: number
      
        PersonaID: number
      
        FechaHoraRegistro: string
      
        TipoAvalID: number
      
        PersonaIDRegistro: number
      
        UsuarioIDRegistro: number

    }
    export interface IAvalesDistribuidor_VW {
              
        DistribuidorID: number
      
        PersonaID: number
      
        FechaHoraRegistro: string
      
        TipoAvalID: number
      
        PersonaIDRegistro: number
      
        UsuarioIDRegistro: number
      
        TipoAval?: string
      
        ColorAval?: string
      
        NombreCompleto?: string

    }
    export interface IBitacoraClienteBloqueado {
              
        BitacoraClienteBloqueadoID: number
      
        DistribuidorID: number
      
        PersonaID: number
      
        Motivo?: string
      
        FchaBloqueo?: string

    }
    export interface IcatalogoImagen {
              
        IdCatalogoImagen: number
      
        NombreImagen?: string
      
        Ruta?: string
      
        ValeraID?: number

    }
    export interface IClientes {
              
        ProductoID?: number
      
        DistribuidorID: number
      
        PersonaID: number
      
        EsttausId?: boolean
      
        AsignacionFecha?: string
      
        bloqueado?: boolean
      
        CreditosActivos?: number
      
        CreditosTotales?: number
      
        Nota?: string

    }
    export interface IClientes_VW {
              
        ProductoID?: number
      
        DistribuidorID: number
      
        PersonaID: number
      
        EsttausId?: boolean
      
        AsignacionFecha?: string
      
        bloqueado?: boolean
      
        CreditosActivos?: number
      
        CreditosTotales?: number
      
        NombreCompleto: string
      
        ClienteID: number
      
        Distribuidor: string

    }
    export interface IClientesV2 {
              
        DistribuidorXClienteID: number
      
        PersonaID: number
      
        EsttausId?: boolean
      
        AsignacionFecha?: string
      
        DistribuidorID: number
      
        bloqueado?: boolean

    }
    export interface IClientesZonas_VW {
              
        ProductoID?: number
      
        DistribuidorID: number
      
        PersonaID: number
      
        EsttausId?: boolean
      
        AsignacionFecha?: string
      
        bloqueado?: boolean
      
        CreditosActivos?: number
      
        CreditosTotales?: number
      
        NombreCompleto: string
      
        ClienteID: number
      
        Distribuidor: string
      
        DistribuidoresEstatusID?: string
      
        DistribuidorNivelID: number
      
        CoordinadorID: number
      
        SucursalID: number
      
        ZonaID: number
      
        Sucursal: string

    }
    export interface IDistClientesProductoVW {
              
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
      
        ProductoID: number

    }
    export interface IDistribuidores {
              
        DistribuidorID: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidorNivelID: number
      
        DistribuidoresEstatusID2?: string
      
        DistribuidorNivelID2?: number
      
        NoCreditosActivos: number
      
        FechaHoraRegistro: string
      
        NumeroDist: string
      
        DistAntNumero?: number
      
        DistAntSistema?: string
      
        DistAntNumero2?: number
      
        DistAntSistema2?: string
      
        GestorID?: number
      
        ValidaContrato: boolean
      
        tipoRelacionID: number
      
        ReferenciaContable: number
      
        numCreditosPersonales: number
      
        PersonaIDRegistro: number
      
        UsuarioIDRegistro: number
      
        AccesoAppVales?: boolean
      
        AccesoAppVales2?: boolean
      
        fum?: string
      
        Monedero?: number
      
        DistribuidorNivelOrigenID: number
      
        DistribuidorImagen?: string
      
        ConGrupo?: boolean
      
        SociaNIP?: string
      
        CambioNIP?: boolean
      
        ResponsableID?: number

    }
    export interface IDistribuidores_VW {
              
        DistribuidorID: number
      
        DistribuidoresEstatusID?: string
      
        Estatus_AsignaUsuario?: boolean
      
        Estatus_Convenio?: boolean
      
        Estatus_DistribuidoresEstatus?: string
      
        Estatus_Especial?: boolean
      
        Estatus_Orden?: number
      
        Estatus_PuedeCanjear?: boolean
      
        DistribuidorNivelID: number
      
        Nivel_CapitalColocadoMaximo?: number
      
        Nivel_CapitalColocadoMinimo?: number
      
        Nivel_DistribuidorNivel?: string
      
        Nivel_importeMaxCanje?: number
      
        Nivel_ImporteProteccionSaldo?: number
      
        Nivel_maximoImporteCanjeAval?: number
      
        Nivel_maximoImporteCanjeCliente?: number
      
        Nivel_maximoPrestamoPersonal?: number
      
        Nivel_PorcComisionBase?: number
      
        NoCreditosActivos: number
      
        FechaHoraRegistro: string
      
        UsuarioIDRegistro: number
      
        SucursalID: number
      
        SucursalIDVR?: number
      
        Sucursal_Nombre: string
      
        DireccionID: number
      
        NombreVialidad: string
      
        vialidadTipo: string
      
        orientacionVialidadTipo: string
      
        NumeroExterior: string
      
        NumeroInterior?: string
      
        codigoPostal?: string
      
        Asentamiento?: string
      
        Tipo_asenta?: string
      
        Municipio?: string
      
        Ciudad?: string
      
        Estado?: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        NumeroDist: string
      
        DistAntNumero?: number
      
        DistAntNumero2?: number
      
        GestorID?: number
      
        ValidaContrato: boolean
      
        tipoRelacionID: number
      
        ReferenciaContable: number
      
        creditoPromotorId?: number
      
        validaContratoUsuarioId?: number
      
        fechaHoraValidaContrato?: string
      
        usuarioIdValidaContrato?: number
      
        numCreditosPersonales: number
      
        PersonaIDRegistro: number
      
        PlazosEspeciales?: boolean
      
        PersonaIDValidaContrato?: number
      
        PersonaID?: number
      
        PersonaNombre?: string
      
        GrupoID?: number
      
        ProductoID: number
      
        EmpresaId?: number
      
        TelefonoMovil?: string
      
        FechaNacimiento?: string
      
        CorreoElectronico?: string
      
        DistribuidorNivelOrigenID: number
      
        DistribuidorNivel: string
      
        LineaCredito?: number
      
        Reference?: string
      
        FechaPrimerCanje?: string
      
        IDExterno?: string

    }
    export interface IDistribuidoresAvalesInfo_VW {
              
        DistribuidorID: number
      
        PersonaID: number
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        FechaNacimiento: string
      
        CURP: string
      
        SexoID: string
      
        Sexo: string
      
        CodigoPostal?: number
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        LugarNacimiento: string
      
        AsentamientoID?: number
      
        NumeroExterior?: string
      
        TelefonoDomicilio?: string

    }
    export interface IDistribuidoresLineaCredito_VW {
              
        DistribuidorID: number
      
        LineaCreditoMaximo?: number
      
        LineaCreditoMinimo?: number

    }
    export interface IDistribuidoresMigrados {
              
        NombreCompleto: string
      
        DistribuidorID_VR?: string
      
        DistribuidorID_CV: number
      
        SucursalID_VR?: string
      
        SucursalID_CV: number

    }
    export interface IDistribuidoresSucursal_VW {
              
        DistribuidorID: number
      
        Distribuidor?: string
      
        DistribuidoresEstatusID?: string
      
        Estatus_AsignaUsuario?: boolean
      
        Estatus_Convenio?: boolean
      
        Estatus_DistribuidoresEstatus?: string
      
        Estatus_Especial?: boolean
      
        Estatus_Orden?: number
      
        Estatus_PuedeCanjear?: boolean
      
        DistribuidorNivelID: number
      
        Nivel_CapitalColocadoMaximo?: number
      
        Nivel_CapitalColocadoMinimo?: number
      
        Nivel_DistribuidorNivel?: string
      
        Nivel_importeMaxCanje?: number
      
        Nivel_ImporteProteccionSaldo?: number
      
        Nivel_maximoImporteCanjeAval?: number
      
        Nivel_maximoImporteCanjeCliente?: number
      
        Nivel_maximoPrestamoPersonal?: number
      
        Nivel_PorcComisionBase?: number
      
        NoCreditosActivos: number
      
        FechaHoraRegistro: string
      
        UsuarioIDRegistro: number
      
        SucursalID: number
      
        Sucursal_Nombre: string
      
        ZonaID: number
      
        NumeroDist: string
      
        DistAntNumero?: number
      
        DistAntNumero2?: number
      
        GestorID?: number
      
        ValidaContrato: boolean
      
        tipoRelacionID: number
      
        ReferenciaContable: number
      
        numCreditosPersonales: number
      
        PersonaIDRegistro: number
      
        PersonaID?: number
      
        PersonaNombre?: string
      
        GrupoID?: number
      
        ProductoID: number
      
        TelefonoMovil?: string

    }
    export interface IEstatus {
              
        DistribuidoresEstatusID: string
      
        DistribuidoresEstatus: string
      
        PuedeCanjear: boolean
      
        AsignaUsuario: boolean
      
        Especial: boolean
      
        Convenio: boolean
      
        Orden: number

    }
    export interface IEstatusAumentoNivel {
              
        EstatusID: number
      
        Estatus: string

    }
    export interface IEstatusSolicitudes {
              
        EstatusID: number
      
        Estatus: string

    }
    export interface IExperiencia {
              
        CreditosDistribuidoresExperienciaID: number
      
        Compania: string
      
        Antiguedad?: string
      
        LimiteCredito: number
      
        CreditoDisponible: number
      
        FechaHoraRegistro: string
      
        Validado?: string
      
        Nivel: string
      
        PersonaIDRegistro: number
      
        PersonaIDValido: number
      
        DistribuidorID: number
      
        UsuarioIDRegistro: number
      
        UsuarioIDValido?: number

    }
    export interface IGpoDistribuidorCoordinador {
              
        GrupoID?: number
      
        ClasificadorGrupoID: number
      
        Descripcion: string
      
        CoordinadorID: number
      
        NombreCompleto: string
      
        DistribuidorID: number

    }
    export interface IHistorico {
              
        Fecha: string
      
        PersonaID: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidorNivelID: number
      
        LineaCredito: number
      
        LineaCreditoDisponible: number
      
        SaldoActual: number
      
        NoCreditosActivos: number
      
        CapitalColocado: number
      
        CoordinadorID: number
      
        NumeroDist: number
      
        DistribuidorID: number

    }
    export interface IIncrementoDistHistoricos {
              
        Id: number
      
        ContratoID?: number
      
        ProductoID?: number
      
        DistribuidorID?: number
      
        FechaInc?: string
      
        LineaCreditoAnt?: number
      
        MontoInc?: number
      
        LineaCreditoNueva?: number
      
        UsuarioID?: number
      
        FechaRegistro?: string

    }
    export interface ILogCambios {
              
        fhCambio: string
      
        PersonaID?: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidorNivelID?: number
      
        FechaHoraRegistro?: string
      
        CoordinadorID?: number
      
        NumeroDist?: number
      
        GestorID?: number
      
        Validado?: boolean
      
        FHValidacion?: string
      
        tipoRelacionID?: number
      
        creditoPromotorId?: number
      
        validaContrato?: boolean
      
        fhValidaContrato?: string
      
        fechaHoraValidaContrato?: string
      
        validadoContrato?: boolean
      
        usuarioIdCambio?: number
      
        dbuser?: string
      
        sesionId?: number
      
        PersonaIDRegistro?: number
      
        PersonaIDValida?: number
      
        PersonaIDValidaContrato?: number
      
        DistribuidorID: number
      
        UsuarioIDRegistro?: number
      
        UsuarioIDValida?: number
      
        usuarioIdValidaContrato?: number

    }
    export interface INiveles {
              
        DistribuidorNivelID: number
      
        DistribuidorNivel: string
      
        PorcComisionBase: number
      
        CapitalColocadoMinimo: number
      
        CapitalColocadoMaximo: number
      
        ImporteProteccionSaldo: number
      
        importeMaxCanje: number
      
        maximoPrestamoPersonal: number
      
        maximoImporteCanjeCliente: number
      
        maximoImporteCanjeAval: number
      
        OrdenNivel?: number

    }
    export interface INivelesComisionDias {
              
        DistribuidorNivelID: number
      
        DiasMin: number
      
        DiasMax: number
      
        Ajuste: number
      
        DiasTabla: number
      
        mostrarEnTabla: boolean
      
        tabuladorTipoID: number

    }
    export interface INivelesProductos {
              
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
    export interface INivelImportePlazos {
              
        nivelImportePlazosID: number
      
        distribuidorNivelId: number
      
        importe: number
      
        plazo: number
      
        activo: number
      
        fechaRegistro: string
      
        porcTasaPlazo?: number
      
        cargo?: number
      
        seguroPlazo?: number
      
        porcIVA?: number
      
        productoID?: number

    }
    export interface IOrigenIngresos {
              
        OrigenIngresoID: number
      
        OrigenIngreso: string
      
        Activo: boolean

    }
    export interface IParametrosSeguros {
              
        MinLineaCredito: number
      
        MaxLineaCredito: number
      
        Costo: number
      
        MinimoPagoRelacion: number

    }
    export interface IReferencia {
              
        CreditosDistribuidoresReferenciaID: number
      
        Nombre: string
      
        FechaHoraRegistro: string
      
        referenciaTipoId?: number
      
        AniosDom: string
      
        Tel: string
      
        Cel: string
      
        Domicilio: string
      
        PersonaIDRegistro: number
      
        DistribuidorID: number
      
        UsuarioIDRegistro: number
      
        Parentesco: string
      
        Edad: number

    }
    export interface ISolicitudCancelTemp {
              
        SolicitudID: number
      
        DistribuidorID: number
      
        EstatusID?: number
      
        Observaciones?: string
      
        Autorizado?: boolean
      
        UsuarioRegistraID: number
      
        PersonaRegistraID: number
      
        FechaRegistra: string
      
        UsuarioAutorizaID?: number
      
        PersonaAutorizaID?: number
      
        FechaAutoriza?: string
      
        EstatusSolicitud?: string

    }
    export interface ISolicitudCancelTemp_VW {
              
        SolicitudID: number
      
        DistribuidorID: number
      
        EstatusSolicitud?: string
      
        Observaciones?: string
      
        Estatus?: string
      
        EstatusID?: number
      
        UsuarioAutorizaID?: number
      
        UsuarioRegistraID: number
      
        UsuarioSolicito?: string
      
        PersonaAutorizaID?: number
      
        FechaRegistra: string
      
        FechaAutoriza?: string
      
        Autorizado?: boolean
      
        NombreCompleto?: string

    }
    export interface ISolicitudesAumentoNivel {
              
        SolicitudAumentoNivID: number
      
        DistribuidorID: number
      
        DistribuidorNivelID: number
      
        FechaSolicitud?: string
      
        EstatusID: number
      
        FechaRespuesta?: string
      
        UsuarioSolicito: number
      
        UsuarioRespondio?: number
      
        Observaciones?: string
      
        MotivoCancelacion?: string

    }
    export interface ISolicitudesAumentoNivel_VW {
              
        SolicitudAumentoNivID: number
      
        DistribuidorID: number
      
        SucursalID?: number
      
        Sucursal?: string
      
        UsuarioSolicita?: string
      
        EstatusID?: number
      
        Estatus?: string
      
        FechaSolicitud?: string
      
        FechaRespuesta?: string
      
        UsuarioResponde?: string
      
        Observaciones?: string
      
        MotivoCancelacion?: string

    }
    export interface ISolicitudesIncrementos {
              
        SolicitudID: number
      
        ProductoID: number
      
        SucursalID: number
      
        DistribuidorID: number
      
        ContratoID: number
      
        IncrementoSolicitado: number
      
        IncrementoAutorizado?: number
      
        EstatusID: number
      
        UsuarioSolicitoID: number
      
        FechaSolicitud: string
      
        UsuarioAutorizoID?: number
      
        FechaAutorizacion?: string
      
        UsuarioCanceloID?: number
      
        FechaCancelacion?: string
      
        MotivoCancelacion?: string
      
        Observaciones?: string
      
        UsuarioModificaID?: number
      
        FechaModifica?: string

    }
    export interface ISolicitudesIncrementos_VW {
              
        SolicitudID: number
      
        ProductoID: number
      
        Producto?: string
      
        SucursalID: number
      
        NombreSucursal?: string
      
        DistribuidorID: number
      
        PersonaNombre?: string
      
        ContratoID: number
      
        IncrementoSolicitado: number
      
        IncrementoAutorizado?: number
      
        EstatusID: number
      
        Estatus?: string
      
        Observaciones?: string
      
        UsuarioSolicitoID: number
      
        UsuarioSolicito?: string
      
        FechaSolicitud: string
      
        UsuarioAutorizoID?: number
      
        UsuarioAutorizo?: string
      
        FechaAutorizacion?: string
      
        UsuarioCanceloID?: number
      
        UsuarioCancelo?: string
      
        FechaCancelacion?: string
      
        MotivoCancelacion?: string
      
        UsuarioModificaID?: number
      
        UsuarioModifica?: string
      
        FechaModifica?: string

    }
    export interface ISolicitudesIncrementosEstatus {
              
        EstatusID: number
      
        Estatus: string

    }
    export interface ISolicitudesPrestamos_VW {
              
        SolicitudPrestamoPersonalID: number
      
        ProductoID: number
      
        Producto?: string
      
        SucursalID: number
      
        NombreSucursal?: string
      
        DistribuidorID?: number
      
        PersonaNombre?: string
      
        ContratoID?: number
      
        PrestamoSolicitado: number
      
        PrestamoAutorizado?: number
      
        PlazoSolicitado?: number
      
        EstatusID: number
      
        Estatus?: string
      
        Observaciones?: string
      
        UsuarioSolicitoID?: number
      
        UsuarioSolicito?: string
      
        FechaSolicitud?: string
      
        UsuarioAutorizoID?: number
      
        UsuarioAutorizo?: string
      
        FechaAutorizacion?: string
      
        UsuarioCanceloID?: number
      
        UsuarioCancelo?: string
      
        FechaCancelacion?: string
      
        MotivoCancelacion?: string
      
        UsuarioModificaID?: number
      
        UsuarioModifica?: string
      
        FechaModifica?: string
      
        CreditoID?: number
      
        personaAcepta?: string
      
        FechaAceptacion?: string

    }
    export interface ISolicitudesPrestamosPersonales {
              
        SolicitudPrestamoPersonalID: number
      
        ProductoID: number
      
        SucursalID: number
      
        DistribuidorID?: number
      
        ContratoID?: number
      
        PrestamoSolicitado: number
      
        PrestamoAutorizado?: number
      
        EstatusID: number
      
        UsuarioSolicitoID?: number
      
        FechaSolicitud?: string
      
        UsuarioAutorizoID?: number
      
        FechaAutorizacion?: string
      
        UsuarioCanceloID?: number
      
        FechaCancelacion?: string
      
        MotivoCancelacion?: string
      
        Observaciones?: string
      
        UsuarioModificaID?: number
      
        FechaModifica?: string
      
        SolicitudPersonalDocumentoID?: number
      
        PlazoSolicitado?: number
      
        Interes?: number
      
        InteresFinal?: number
      
        ContratoPlanPagos?: number
      
        PrestamoPersonal?: boolean
      
        CreditoID?: number
      
        UsuarioAceptaID?: number
      
        FechaAceptacion?: string

    }
    export interface ISolicitudesPrestamosPersonalesDocumentos {
              
        DocumentoID: number
      
        SolicitudPrestamoPersonalID?: number
      
        Ruta?: string
      
        Firmado?: boolean

    }
    export interface ISolicitudesPrestamosPersonalesEstatus {
              
        EstatusID: number
      
        Estatus: string

    }
    export interface ISolicitudesPrestamosPersonalesNoPagos {
              
        SolicitudPrestamoPersonalID: number
      
        DistribuidorID?: number
      
        PrestamoSolicitado: number
      
        CreditoID?: number
      
        NoPago?: number
      
        Capital?: number
      
        Interes?: number
      
        ImporteTotal?: number
      
        ContratoID?: number
      
        PlazoSolicitado?: number

    }
    export interface ISolicitudFallecida {
              
        SolicitudID: number
      
        DistribuidorID: number
      
        EstatusID?: number
      
        Ruta: string
      
        Observaciones?: string
      
        Autorizado?: boolean
      
        UsuarioRegistraID: number
      
        PersonaRegistraID: number
      
        FechaRegistra: string
      
        UsuarioAutorizaID?: number
      
        PersonaAutorizaID?: number
      
        FechaAutoriza?: string
      
        EstatusSolicitud?: string

    }
    export interface ISolicitudFallecida_VW {
              
        SolicitudID: number
      
        EstatusSolicitud?: string
      
        Ruta: string
      
        DistribuidorID: number
      
        Observaciones?: string
      
        UsuarioRegistraID: number
      
        UsuarioSolicito?: string
      
        Estatus?: string
      
        UsuarioAutorizaID?: number
      
        PersonaAutorizaID?: number
      
        FechaRegistra: string
      
        FechaAutoriza?: string
      
        Autorizado?: boolean
      
        NombreCompleto?: string

    }
    export interface ITabuladoresTipos {
              
        tabuladorTipoId: number
      
        tabuladorTipoDesc: string

    }
    export interface ITipoPago {
              
        TipoPagoID?: string
      
        TipoPagoDesc?: string
      
        Orden?: number

    }
    export interface ITraspasoSocia {
              
        TraspasoSociaID: number
      
        Colocado: number
      
        Distribuidoras: number
      
        CoordinadorID_emisor: number
      
        SucursalID_emisor?: number
      
        CoordinadorID_receptor: number
      
        SucursalID_receptor: number
      
        Fecha_registro: string
      
        UsuarioCreador: number
      
        tipoTraspasoID?: number
      
        observaciones?: string

    }
    export interface ITraspasoSociaDetalle {
              
        TraspasoSociaID: number
      
        DistribuidorID: number
      
        Colocado: number

    }
    export interface IValera {
              
        ValeraID: number
      
        ProductoID: number
      
        serieId: number
      
        FolioInicial: number
      
        FolioFinal: number
      
        Estatus: string
      
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
      
        ValeraDigital: boolean
      
        SubidaEntregaPath?: string

    }
    export interface IValeraCabecera {
              
        ValeraCabeceraID: number
      
        ProductoID: number
      
        serieId: number
      
        FolioInicial: number
      
        FolioFinal: number
      
        Estatus: string
      
        RegistroFecha: string
      
        RegistroPersonaID: number
      
        ValerasFraccionID: number
      
        ValeraTrackingEstatusID: number
      
        PedidoNota?: string
      
        PedidoPersonaID?: number
      
        PedidoFecha?: string
      
        SurtidoPersonaID?: number
      
        SurtidoFecha?: string
      
        CanceladoPersonaID?: number
      
        CanceladoFecha?: string
      
        CanceladoUsuarioId?: number
      
        PedidoUsuarioId?: number
      
        RegistroUsuarioId: number
      
        SurtidoUsuarioId?: number
      
        IDExterno?: number
      
        IDSisFecha?: string

    }
    export interface IValeraCostos_VW {
              
        ValeraCostoID: number
      
        Costo: number
      
        FechaRegistra: string
      
        PersonaRegistraID: number
      
        PersonaRegistra?: string
      
        UsuarioRegistraID: number
      
        UsuarioRegistra?: string
      
        FechaModifica?: string
      
        PersonaModificaID?: number
      
        PersonaModifica?: string
      
        UsuarioModificaID?: number
      
        UsuarioModifica?: string

    }
    export interface IValeraDetalle {
              
        ValeraID: number
      
        Folio: number
      
        Estatus: string
      
        DigitalFolio?: string
      
        DigitalImporte: number
      
        DigitalPlazo: number
      
        DigitalTipoDesembolsoId?: number
      
        AdicProductoId?: number
      
        AdicImporte: number
      
        CanjeFecha?: string
      
        CanceladoFecha?: string
      
        CanjePersonaID?: number
      
        CanceladoPersonaID?: number
      
        CanceladoUsuarioId?: number
      
        CanjeUsuarioId?: number
      
        ValeDigital: boolean
      
        DiasCaducidad?: number
      
        FechaExpedicion?: string

    }
    export interface IValeraDetalle_VW {
              
        ProductoID: number
      
        serieId: number
      
        DistribuidorID?: number
      
        ValeraID: number
      
        Folio: number
      
        Estatus: string
      
        DigitalFolio?: string
      
        DigitalImporte: number
      
        DigitalPlazo: number
      
        DigitalTipoDesembolsoId?: number
      
        AdicProductoId?: number
      
        AdicImporte: number
      
        CanjeFecha?: string
      
        CanceladoFecha?: string
      
        CanjePersonaID?: number
      
        CanceladoPersonaID?: number
      
        CanceladoUsuarioId?: number
      
        CanjeUsuarioId?: number
      
        ValeDigital: boolean
      
        DiasCaducidad?: number
      
        FechaExpedicion?: string

    }
    export interface IValeraEvidenciaDocs {
              
        ValeraDocsEntregaID: number
      
        CatalogoImagenID?: number
      
        ValeraID: number
      
        Ruta: string
      
        Autorizado?: boolean
      
        FechaCreacion: string
      
        FechaAutoriza?: string

    }
    export interface IValeras_VW {
              
        ValeraID: number
      
        ProductoID: number
      
        Producto: string
      
        DistribuidorID?: number
      
        serieId: number
      
        serie: string
      
        serieDesc?: string
      
        FolioInicial: number
      
        FolioFinal: number
      
        Estatus: string
      
        RegistroFecha: string
      
        RegistroUsuarioId: number
      
        AsignaSucursalId?: number
      
        AsignaSucursalUsuarioId?: number
      
        ReciboSucursalUsuarioId?: number
      
        AsignaDistribudiorUsuarioId?: number
      
        CanceladoUsuarioId?: number
      
        ValeraTrackingEstatusID: number
      
        TrackingEstatus: string
      
        Descripcion: string
      
        Color?: string
      
        EnvioSucursalNota?: string
      
        ReciboSucursalNota?: string
      
        CodigoBarras?: string
      
        SucursalEnviaValera?: number
      
        SucNombre?: string
      
        DiasDeEntregaAprox?: number
      
        EnvioSucursalFecha?: string
      
        SucEnviaNombre?: string
      
        ValeraCabeceraID: number

    }
    export interface IValerasCabecera_VW {
              
        ValeraCabeceraID: number
      
        FolioInicial: number
      
        FolioFinal: number
      
        Estatus: string
      
        RegistroFecha: string
      
        RegistroUsuarioId: number
      
        RegistroPersonaID: number
      
        ProductoID: number
      
        Producto: string
      
        serieId: number
      
        serie: string
      
        ValerasFraccionID: number
      
        Fraccion: number
      
        ValeraTrackingEstatusID: number
      
        TrackingEstatus: string
      
        Descripcion: string
      
        Color?: string

    }
    export interface IValerasCabeceraEstatus {
              
        ValerasCabeceraEstatusID: string
      
        Estatus: string

    }
    export interface IValerasCosto {
              
        ValeraCostoID: number
      
        Costo: number
      
        FechaRegistra: string
      
        PersonaRegistraID: number
      
        UsuarioRegistraID: number
      
        FechaModifica?: string
      
        PersonaModificaID?: number
      
        UsuarioModificaID?: number

    }
    export interface IValeraSeries {
              
        serieId: number
      
        serieDesc?: string
      
        activo: boolean
      
        ProductoID: number
      
        serie: string
      
        ValeraSeriesTiposID: number

    }
    export interface IValeraSeriesTipos {
              
        ValeraSeriesTiposID: number
      
        Tipo: string

    }
    export interface IValerasEstatus {
              
        ValeraEstatusID: string
      
        ValeraEstatus: string
      
        PuedeCanjear: boolean
      
        AsignaUsuario: boolean
      
        Orden: number

    }
    export interface IValerasFraccion {
              
        ValerasFraccionID: number
      
        Fraccion: number

    }
    export interface IValeraTrackingEstatus {
              
        ValeraTrackingEstatusID: number
      
        TrackingEstatus: string
      
        Color?: string
      
        Descripcion: string

    }
    export interface IVideosMarketing {
              
        VideoID: number
      
        VideoURL: string
      
        VideoDescripcion?: string
      
        Mostrar: boolean
      
        FechaHoraRegistro?: string
      
        UsuarioCreacionID?: number
      
        VideoPortada?: string
      
        VideoTitulo?: string
      
        EsVR?: boolean

    }
}