export namespace DBConfia_Prospeccion {
        
    export interface IAnalistas_VW {
              
        AnalistaID: number
      
        PersonaID?: number
      
        NombreCompleto?: string
      
        Activo: boolean
      
        UsuarioID: number
      
        mesaCredito: string

    }
    export interface IAsignaAnalista {
              
        AsignaAnalistaID: number
      
        FechaHoraAsignacion: string
      
        PersonaAsignaID: number
      
        UsuarioAsignaID: number
      
        PersonaAnalistaID: number
      
        UsuarioAnalistaID: number
      
        ProspectoID: number
      
        Buro: boolean
      
        Llamadas: boolean

    }
    export interface IAvales {
              
        AvalID: number
      
        ProspectoID: number
      
        Activo: boolean
      
        Validado?: boolean
      
        Observacion?: string

    }
    export interface IAvales_VW {
              
        AvalID: number
      
        ProspectoID: number
      
        Activo: boolean
      
        Validado?: boolean
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        NombreCompleto: string
      
        FechaNacimiento: string
      
        SexoID: string
      
        Sexo: string
      
        CURP: string
      
        TelefonoMovil: string
      
        TelefonoDomicilio?: string
      
        CorreoElectronico?: string
      
        LugarNacimiento: string
      
        Observacion?: string
      
        CodigoPostal: number
      
        AsentamientoID: number
      
        localidad: string
      
        calle: string
      
        numeroExterior: string
      
        ProductoID: number
      
        DireccionAval?: string
      
        TieneEmpleo: number
      
        Empresa?: string
      
        OcupacionID?: number
      
        Ocupacion?: string
      
        Sueldo?: number
      
        Antiguedad?: string
      
        TelefonoEmpresa?: string
      
        AsentamientoIDEmpleo?: number
      
        calleEmpleo?: string
      
        NumeroExteriorEmpleo?: string
      
        localidadEmpleo?: string
      
        DireccionEmpresaAval?: string
      
        TieneConyuge: number
      
        EstadoCivilID?: string
      
        EstadoCivil: string
      
        NombreConyuge: string
      
        TieneEmpleoConyuge: number
      
        EmpresaConyuge?: string
      
        OcupacionIDConyuge?: number
      
        OcupacionConyuge?: string
      
        SueldoConyuge?: number
      
        AntiguedadConyuge?: string
      
        TelefonoEmpresaConyuge?: string
      
        AsentamientoIDEmpresaConyuge?: number
      
        calleEmpresaConyuge?: string
      
        NumeroExteriorEmpresaConyuge?: string
      
        localidadEmpresaConyuge?: string
      
        DireccionEmpresaConyugeAval?: string
      
        CodigoPostalEmpresaAval?: number
      
        CodigoPostalEmpresaConyuge?: number

    }
    export interface IAvalesaApp_VW {
              
        AvalID: number
      
        ProspectoID: number
      
        Activo: boolean
      
        Validado?: boolean
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        NombreCompleto: string
      
        FechaNacimiento: string
      
        SexoID: string
      
        Sexo: string
      
        CURP: string
      
        TelefonoMovil: string
      
        TelefonoDomicilio?: string
      
        CorreoElectronico?: string
      
        LugarNacimiento: string
      
        Observacion?: string
      
        CodigoPostal: number
      
        AsentamientoID: number
      
        localidad: string
      
        calle: string
      
        numeroExterior: string
      
        ProductoID: number
      
        DireccionAval?: string
      
        TieneEmpleo: number
      
        Empresa?: string
      
        OcupacionID?: number
      
        Ocupacion?: string
      
        Sueldo?: number
      
        Antiguedad?: string
      
        TelefonoEmpresa?: string
      
        AsentamientoIDEmpleo?: number
      
        calleEmpleo?: string
      
        NumeroExteriorEmpleo?: string
      
        localidadEmpleo?: string
      
        DireccionEmpresaAval?: string
      
        TieneConyuge: number
      
        EstadoCivilID?: string
      
        EstadoCivil: string
      
        NombreConyuge: string
      
        TieneEmpleoConyuge: number
      
        EmpresaConyuge?: string
      
        OcupacionIDConyuge?: number
      
        OcupacionConyuge?: string
      
        SueldoConyuge?: number
      
        AntiguedadConyuge?: string
      
        TelefonoEmpresaConyuge?: string
      
        AsentamientoIDEmpresaConyuge?: number
      
        calleEmpresaConyuge?: string
      
        NumeroExteriorEmpresaConyuge?: string
      
        localidadEmpresaConyuge?: string
      
        DireccionEmpresaConyugeAval?: string
      
        CodigoPostalEmpresaAval?: number
      
        CodigoPostalEmpresaConyuge?: number

    }
    export interface IAvalesDocumentos_VW {
              
        TipoDocumentoAvalID: number
      
        NombreDocumento: string
      
        Clave: string
      
        Descripcion?: string
      
        Orden?: number
      
        DocumentoAvalID?: number
      
        PersonaID?: number
      
        TipoPersonaID?: number
      
        Ruta?: string
      
        Autorizado?: boolean
      
        ProductoID?: number

    }
    export interface IDictamen {
              
        DictamenID: number
      
        SucursalID: number
      
        AnalistaID: number
      
        ProspectoID: number
      
        MontoCredito: number
      
        ClasificacionCredito: string
      
        FechaSolicitud: string
      
        FechaDictamen: string
      
        DistribuidorNivelID: number
      
        DistribuidoresEstatusID: string

    }
    export interface IDirectores_VW {
              
        DirectorMesaCreditoID: number
      
        PersonaID?: number
      
        NombreCompleto?: string
      
        Activo?: boolean
      
        UsuarioID: number
      
        mesaCredito: string

    }
    export interface IDirectorMesaCredito {
              
        DirectorMesaCreditoID: number
      
        MesaCreditoID: number
      
        Activo?: boolean

    }
    export interface IDistribuidorescanje {
              
        DistribuidorID: number

    }
    export interface IDocumentos {
              
        DocumentoID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        TipoDocumentoID: number
      
        Ruta: string
      
        Status: string
      
        Autorizado?: boolean

    }
    export interface IDocumentosAval {
              
        DocumentoAvalID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        TipoDocumentoAvalID: number
      
        Ruta: string
      
        Status: string
      
        Autorizado?: boolean

    }
    export interface IDocumentosNotas {
              
        DocumentoID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        TipoDocumentoID: number
      
        Ruta: string
      
        Status: string
      
        Autorizado?: boolean
      
        Observacion?: string

    }
    export interface IDocumentosNotasAvales {
              
        DocumentoAvalID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        TipoDocumentoAvalID: number
      
        Ruta: string
      
        Status: string
      
        Autorizado?: boolean
      
        Observacion?: string

    }
    export interface IDocumentosRegresados {
              
        DocumentoRegresadoID: number
      
        DocumentoID?: number
      
        Observacion: string
      
        Fecha: string
      
        DocumentoAvalID?: number

    }
    export interface IDocumentosRequeridos {
              
        DocumentoRequeridoID: number
      
        TipoDocumentoID: number
      
        Status: string

    }
    export interface IDomicilios {
              
        DomicilioID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        calle: string
      
        numeroInterior?: string
      
        numeroExterior: string
      
        AsentamientoID: number
      
        localidad: string
      
        cp?: number
      
        id_municipio?: number
      
        id_estado?: number

    }
    export interface IEgresos {
              
        EgresoID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        TipoViviendaID: number
      
        Alimentacion: number
      
        TarjetaCreido: number
      
        RentaPagoVivienda: number
      
        ServiciosDomesticos: number
      
        Otros: number
      
        EgresoTotal: number

    }
    export interface IEmpresasExperiencia {
              
        EmpresaExperienciaID: number
      
        Descripcion: string
      
        Activo: boolean

    }
    export interface IEstatusAsignacion {
              
        EstatusAsignacionID: number
      
        Estatus: string

    }
    export interface IEstatusValidacion {
              
        EstatusValidacionID: number
      
        Estatus: string

    }
    export interface IExperienciaVentas {
              
        ExperienciaVentasID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        EmpresaExperienciaID: number
      
        FechaIngreso: string
      
        LimiteCredito: number
      
        CreditoDisponible: number
      
        Status?: string

    }
    export interface IInformacionLaboral {
              
        InformacionLaboralID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        Empresa: string
      
        OcupacionID: number
      
        Sueldo: number
      
        Antiguedad: string
      
        Telefono: string
      
        Calle: string
      
        NumeroInterior?: string
      
        NumeroExterior: string
      
        AsentamientoID: number
      
        id_municipio?: number
      
        localidad: string
      
        cp?: number

    }
    export interface IInformacionOtraVivienda {
              
        InformacionOtraViviendaID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        TipoViviendaID: number
      
        Calle: string
      
        NumeroInterior: string
      
        NumeroExterior: string
      
        AsentamientoID: number
      
        id_municipio: number
      
        id_estado: number
      
        localidad: string
      
        cp: number
      
        valorAproximado: number

    }
    export interface IInformacionVivienda {
              
        InformacionViviendaID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        TipoViviendaID: number
      
        tieneOtraVivienda: boolean
      
        numeroPersonasHabitan: number
      
        valorAproximado: number

    }
    export interface IIngresos {
              
        IngresoID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        ingresoSueldo: number
      
        gananciasDV: number
      
        ingresoConyuge: number
      
        otrosIngresos: number
      
        ingresoTotal: number

    }
    export interface IInteresados {
              
        InteresadosID: number
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        NombreCompleto: string
      
        FechaNacimiento: string
      
        SexoID: string
      
        TelefonoMovil: string
      
        LugarNacimiento: string
      
        AsentamientoID: number
      
        calle: string
      
        localidad: string
      
        numeroExterior: string
      
        TelefonoDomicilio?: string
      
        InicioProceso: boolean
      
        CreacionFecha: string
      
        CreacionPersonaID: number
      
        CreacionUsuarioID: number
      
        SucursalID?: number
      
        Descartado?: boolean
      
        ObservacionesDescartado?: string
      
        FechaDescarte?: string

    }
    export interface IInteresados_App_VW {
              
        InteresadosID: number
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        NombreCompleto: string
      
        FechaNacimiento: string
      
        SexoID: string
      
        TelefonoMovil: string
      
        LugarNacimiento: string
      
        AsentamientoID: number
      
        calle: string
      
        localidad: string
      
        numeroExterior: string
      
        TelefonoDomicilio?: string
      
        InicioProceso: boolean
      
        CreacionFecha: string
      
        CreacionPersonaID: number
      
        CreacionUsuarioID: number
      
        SucursalID?: number
      
        estadoPaisId: number
      
        CodigoPostal?: number

    }
    export interface IInteresados_VW {
              
        InteresadosID: number
      
        NombreInteresado: string
      
        Nombre?: string
      
        CreacionFecha: string
      
        NombreUsuario: string
      
        InicioProceso: boolean
      
        CreacionPersonaID: number
      
        CreacionUsuarioID: number
      
        TelefonoMovil: string
      
        TelefonoDomicilio?: string
      
        calle: string
      
        localidad: string
      
        numeroExterior: string
      
        FechaDescarte?: string
      
        ObservacionesDescartado?: string
      
        Descartado?: boolean

    }
    export interface IInteresadosApp_VW {
              
        InteresadosID: number
      
        NombreInteresado: string
      
        Nombre?: string
      
        CreacionFecha: string
      
        NombreUsuario: string
      
        InicioProceso: boolean
      
        CreacionPersonaID: number
      
        CreacionUsuarioID: number
      
        TelefonoMovil: string
      
        TelefonoDomicilio?: string
      
        calle: string
      
        localidad: string
      
        numeroExterior: string
      
        FechaDescarte?: string
      
        ObservacionesDescartado?: string
      
        Descartado?: boolean

    }
    export interface IInteresadosDetalleApp_VW {
              
        InteresadosID: number
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        NombreCompleto: string
      
        FechaNacimiento: string
      
        SexoID: string
      
        TelefonoMovil: string
      
        LugarNacimiento: string
      
        AsentamientoID: number
      
        calle: string
      
        localidad: string
      
        numeroExterior: string
      
        TelefonoDomicilio?: string
      
        InicioProceso: boolean
      
        CreacionFecha: string
      
        CreacionPersonaID: number
      
        CreacionUsuarioID: number
      
        SucursalID?: number
      
        estadoPaisId: number
      
        CodigoPostal?: number

    }
    export interface ILogBuroConsolidado_VW {
              
        UsuarioIDConsolida: number
      
        PersonaIDConsolida: number
      
        NombreUsuarioConsolida: string
      
        FHConsolida: string
      
        ProspectoID: number
      
        BuroInternoEstatusID: number
      
        EstatusBuroCredito: string

    }
    export interface ILogMensajes {
              
        LogMensajeID: number
      
        Mensaje: string
      
        Fecha_hora: string
      
        ValidacionMesaID?: number
      
        PersonaID: number
      
        UsuarioID: number
      
        StatusProcesoID?: number
      
        Leido?: boolean
      
        EnviadoDesdeMesa: boolean
      
        ValidacionBuroMesaID?: number
      
        ValidacionLlamadasMesaID?: number

    }
    export interface ILogMensajes_VW {
              
        LogMensajeID: number
      
        Mensaje: string
      
        Fecha_hora: string
      
        AnalistaPersonaID: number
      
        AnalistaUsuarioID: number
      
        NombreCompleto?: string
      
        Leido?: boolean
      
        PromotorPersonaID?: number
      
        PromotorUsuarioID?: number
      
        ProspectoID?: number
      
        NombreProspecto?: string
      
        StatusProcesoID?: number
      
        Proceso?: string
      
        SucursalID?: number
      
        EnviadoDesdeMesa: boolean
      
        ProductoID?: number

    }
    export interface ILogMensajesApp_VW {
              
        LogMensajeID: number
      
        Mensaje: string
      
        Fecha_hora: string
      
        AnalistaPersonaID: number
      
        AnalistaUsuarioID: number
      
        NombreCompleto?: string
      
        Leido?: boolean
      
        PromotorPersonaID?: number
      
        PromotorUsuarioID?: number
      
        ProspectoID?: number
      
        NombreProspecto?: string
      
        StatusProcesoID?: number
      
        Proceso?: string
      
        SucursalID?: number
      
        EnviadoDesdeMesa: boolean
      
        ProductoID?: number

    }
    export interface ILogMensajesNoLeidosMesa_VW {
              
        NoLeidos?: number
      
        NombreProspecto: string
      
        ProspectoID: number
      
        SucursalID: number
      
        ProductoID: number
      
        PromotorPersonaID: number
      
        PromotorUsuarioID: number
      
        PersonaAnalistaID?: number
      
        UsuarioAnalistaID?: number
      
        PersonaAnalistaBUROID?: number
      
        UsuarioAnalistaBuroID?: number
      
        PersonaAnalistaLlamadasID?: number
      
        UsuarioAnalistaLlamadasID?: number

    }
    export interface ILogMensajesNoLeidosProspecto_VW {
              
        NoLeidos?: number
      
        NombreProspecto: string
      
        ProspectoID: number
      
        SucursalID: number
      
        ProductoID: number
      
        PromotorPersonaID: number
      
        PromotorUsuarioID: number
      
        PersonaAnalistaID?: number
      
        UsuarioAnalistaID?: number
      
        PersonaAnalistaBUROID?: number
      
        UsuarioAnalistaBuroID?: number
      
        PersonaAnalistaLlamadasID?: number
      
        UsuarioAnalistaLlamadasID?: number

    }
    export interface ILogMensajesNoLeidosProspectoApp_VW {
              
        NoLeidos?: number
      
        NombreProspecto: string
      
        ProspectoID: number
      
        SucursalID: number
      
        ProductoID: number
      
        PromotorPersonaID: number
      
        PromotorUsuarioID: number
      
        PersonaAnalistaID?: number
      
        UsuarioAnalistaID?: number
      
        PersonaAnalistaBUROID?: number
      
        UsuarioAnalistaBuroID?: number
      
        PersonaAnalistaLlamadasID?: number
      
        UsuarioAnalistaLlamadasID?: number

    }
    export interface ILogMensajesProspectos_VW {
              
        LogMensajeID: number
      
        Mensaje: string
      
        Fecha_hora: string
      
        ValidacionMesaID?: number
      
        PersonaID: number
      
        NombreCompleto: string
      
        UsuarioID: number
      
        ProspectoID: number
      
        StatusProcesoID?: number
      
        Descripcion: string

    }
    export interface ILogTiempos {
              
        LogTiempoID: number
      
        AsignaAnalistaID: number
      
        Tiempo: string
      
        StatusProcesoID: number
      
        Validado?: boolean

    }
    export interface ILogTiemposPorPantalla {
              
        LogTiemposPorPantallaID: number
      
        FechaInicio?: string
      
        FechaFinal?: string
      
        PantallaProcesoID?: number
      
        ProspectoID?: number
      
        AsignaAnalistaID?: number
      
        RevisionBuro_Tiempo?: string
      
        VerificacionLlamadas_Tiempo?: string
      
        ExpedienteActivacion_Tiempo?: string

    }
    export interface IMatrizProcesos {
              
        MatrizProcesosID: number
      
        ProductoID: number
      
        Activo: boolean

    }
    export interface IMatrizProcesosDetalle {
              
        MatrizProcesosDetalleID: number
      
        MatrizProcesosID: number
      
        StatusProcesoID: number
      
        CapturaObligatoria: boolean
      
        Notificacion: boolean
      
        NotaObligatoria: boolean
      
        DictamenObligatorio: boolean

    }
    export interface IMensajes {
              
        MensajeID: number
      
        Mensaje: string

    }
    export interface IMensajesRelacion {
              
        MensajeID: number
      
        StatusProcesoID: number
      
        TipoDocumentoID?: number
      
        Activo: boolean

    }
    export interface IMensajesRelacion_VW {
              
        StatusProcesoID: number
      
        Descripcion: string
      
        Activo: boolean
      
        MensajeID?: number
      
        TipoDocumentoID?: number
      
        Mensaje?: string
      
        NombreDocumento?: string

    }
    export interface IMensajesRelacionDocumento_VW {
              
        TipoDocumentoID: number
      
        NombreDocumento: string
      
        MensajeID?: number
      
        StatusProcesoID?: number
      
        Activo?: boolean

    }
    export interface IMesaCredito {
              
        MesaCreditoID: number
      
        Nombre: string
      
        Clave: string
      
        Activo: boolean
      
        MostrarBuroPromotor?: boolean

    }
    export interface INivelesOrigen {
              
        DistribuidorNivelID: number
      
        DistribuidorNivel: string
      
        Activo: boolean
      
        PorcComisionBase?: number
      
        CapitalColocadoMinimo?: number
      
        CapitalColocadoMaximo?: number
      
        ImporteProteccionSaldo?: number
      
        importeMaxCanje?: number
      
        maximoPrestamoPersonal?: number
      
        maximoImporteCanjeCliente?: number
      
        maximoImporteCanjeAval?: number

    }
    export interface INivelesOrigen_VW {
              
        DistribuidorNivelIDOrigen: number
      
        DistribuidorNivelOrigen: string

    }
    export interface INivelOrigen_Buro_LC {
              
        NivelOrigen_BuroID: number
      
        DistribuidorNivelOrigenID: number
      
        BuroInternoEstatusID: number
      
        DistribuidorNivelID: number
      
        LineaCredito: number
      
        LineaCreditoMinimo?: number

    }
    export interface INivelOrigen_Buro_LC_VW {
              
        NivelOrigen_BuroID: number
      
        DistribuidorNivelOrigenID: number
      
        NivelOrigen?: string
      
        BuroInternoEstatusID: number
      
        Nombre?: string
      
        DistribuidorNivelInternoID: number
      
        NivelInterno?: string
      
        LineaCredito: number
      
        LineaCreditoMinimo?: number

    }
    export interface IPantallaProceso {
              
        PantallaProcesoID: number
      
        PantallaProcesoDesc?: string

    }
    export interface Iparentesco {
              
        ParentescoID: number
      
        Parentesco: string

    }
    export interface IProductoMatrizProcesos_VW {
              
        MatrizProcesosDetalleID?: number
      
        MatrizProcesosID?: number
      
        StatusProcesoID: number
      
        Descripcion: string
      
        Activo: boolean
      
        CapturaObligatoria?: boolean
      
        Notificacion?: boolean
      
        NotaObligatoria?: boolean
      
        DictamenObligatorio?: boolean
      
        ProductoID?: number

    }
    export interface IProductoMesaCredito {
              
        ProductoMesaCreditoID: number
      
        MesaCreditoID: number
      
        ProductoID: number
      
        Activo: boolean

    }
    export interface IProspectos {
              
        ProspectoID: number
      
        SucursalID: number
      
        ComoSeEntero: string
      
        tieneAutoMoto?: boolean
      
        tieneDependientes?: boolean
      
        tieneExperiencia?: boolean
      
        StatusProcesoID?: number
      
        Activo: boolean
      
        fechaCreacion: string
      
        fechaUltimaActualizacion: string
      
        PromotorPersonaID: number
      
        PromotorUsuarioID: number
      
        EstatusAsignacionID?: number
      
        DistribuidorNivelID?: number
      
        MontoDictaminado?: number
      
        DistribuidoresEstatusID?: string
      
        BuroInternoEstatusID: number
      
        EstatusConsultaBuroID: number
      
        ProductoID: number
      
        Observacion?: string
      
        DistribuidorTiposID: number
      
        Contrato?: string
      
        Pagare?: string
      
        PagareReverso?: string
      
        ObservacionConsultaBuro?: string
      
        DistribuidorNivelInternoID?: number
      
        NivelOrigen_BuroID?: number
      
        PantallaProcesoID?: number
      
        Reasignar?: boolean
      
        Descartado?: boolean
      
        ObservacionesDescartado?: string
      
        FechaDescarte?: string

    }
    export interface IProspectos_VW {
              
        fechaCreacion: string
      
        PromotorUsuarioID: number
      
        PromotorPersonaID: number
      
        ProspectoID: number
      
        Nombre: string
      
        ZonaID?: number
      
        ZonaNombre?: string
      
        NombrePila: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        CURP: string
      
        RFC: string
      
        NombreProspecto: string
      
        Activo: boolean
      
        PantallaProcesoID?: number
      
        PrimerCanje?: number
      
        ActivoDesc: string
      
        AnalistaBuroID?: number
      
        NombreAnalistaBuro?: string
      
        PersonaAnalistaID?: number
      
        NombreAnalista?: string
      
        AnalistaLlamadasID?: number
      
        NombreAnalistaLlamadas?: string
      
        Descripcion: string
      
        StatusProcesoID?: number
      
        BuroInternoEstatusID: number
      
        BuroInternoEstatus: string
      
        BuroInternoEstatusColor: string
      
        EstatusConsultaBuroID: number
      
        EstatusConsultaBuroDesc?: string
      
        DistribuidorNivelID?: number
      
        DistribuidorNivel?: string
      
        DistribuidorTiposID: number
      
        DistribuidorTipos?: string
      
        MontoDictaminado?: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidoresEstatus?: string
      
        SucursalID: number
      
        ProductoID: number
      
        EmpresaId?: number
      
        EnMesa: number
      
        FechaEnMesa?: string
      
        FechaAsignacion?: string
      
        FechaAsignacionBuro?: string
      
        MsjNoLeidosMesa?: number
      
        MsjNoLeidosSucP?: number
      
        AsignadoValidado: number
      
        ColorAsignadoValidado: string
      
        ObservacionAsignaValidado?: string
      
        RevisionDocumentos: number
      
        ColorRevisionDocumentos: string
      
        ColorRevisionDocumentosDesc: string
      
        ObservacionRevisionDocumentos?: string
      
        RevisionBuro: number
      
        ColorRevisionBuro: string
      
        ColorRevisionBuroDesc: string
      
        ObservacionRevicionBuro?: string
      
        RevisionRefTitular: number
      
        ColorRevisionRefTitular: string
      
        ColorRevisionRefTitularDesc: string
      
        ObservacionRevisionRefTitular?: string
      
        RevisionRefAval: number
      
        ColorRevisionRefAval: string
      
        ColorRevisionRefAvalDesc: string
      
        ObservacionRevisionRefAval?: string
      
        VerificaTitular: number
      
        ColorVerificaTitular: string
      
        ColorVerificaTitularDesc: string
      
        ObservacionVerificaTitular	?: string
      
        VerificaAval: number
      
        ColorVerificaAval: string
      
        ColorVerificaAvalDesc: string
      
        ObservacionVerificaAval?: string
      
        RevisionDocumentosAval: number
      
        ColorRevisionDocumentosAval: string
      
        ObservacionRevisionDocsAval?: string
      
        Dictamen: number
      
        ColorDictamen: string
      
        ColorDictamenDesc: string
      
        ObservacionDictamen?: string
      
        Consolidacion: number
      
        ColorConsolidacion: string
      
        ColorConsolidacionDesc: string
      
        ObservacionConsolidacion?: string
      
        NivelOrigen_BuroID?: number
      
        DistribuidorNivelInternoID?: number
      
        Descartado?: boolean
      
        ObservacionesDescartado: string
      
        FechaDescarte?: string

    }
    export interface IProspectosApp_VW {
              
        PromotorUsuarioID: number
      
        PromotorPersonaID: number
      
        ProspectoID: number
      
        Nombre: string
      
        ZonaID?: number
      
        ZonaNombre?: string
      
        NombrePila: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        CURP: string
      
        RFC: string
      
        NombreProspecto: string
      
        Activo: boolean
      
        PantallaProcesoID?: number
      
        PrimerCanje?: number
      
        ActivoDesc: string
      
        AnalistaBuroID?: number
      
        NombreAnalistaBuro?: string
      
        PersonaAnalistaID?: number
      
        NombreAnalista?: string
      
        AnalistaLlamadasID?: number
      
        NombreAnalistaLlamadas?: string
      
        Descripcion: string
      
        StatusProcesoID?: number
      
        BuroInternoEstatusID: number
      
        BuroInternoEstatus: string
      
        BuroInternoEstatusColor: string
      
        EstatusConsultaBuroID: number
      
        EstatusConsultaBuroDesc?: string
      
        DistribuidorNivelID?: number
      
        DistribuidorNivel?: string
      
        DistribuidorTiposID: number
      
        DistribuidorTipos?: string
      
        MontoDictaminado?: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidoresEstatus?: string
      
        SucursalID: number
      
        ProductoID: number
      
        EnMesa: number
      
        FechaEnMesa?: string
      
        FechaAsignacion?: string
      
        FechaAsignacionBuro?: string
      
        MsjNoLeidosMesa?: number
      
        MsjNoLeidosSucP?: number
      
        AsignadoValidado: number
      
        ColorAsignadoValidado: string
      
        ObservacionAsignaValidado?: string
      
        RevisionDocumentos: number
      
        ColorRevisionDocumentos: string
      
        ColorRevisionDocumentosDesc: string
      
        ObservacionRevisionDocumentos?: string
      
        RevisionBuro: number
      
        ColorRevisionBuro: string
      
        ColorRevisionBuroDesc: string
      
        ObservacionRevicionBuro?: string
      
        RevisionRefTitular: number
      
        ColorRevisionRefTitular: string
      
        ColorRevisionRefTitularDesc: string
      
        ObservacionRevisionRefTitular?: string
      
        RevisionRefAval: number
      
        ColorRevisionRefAval: string
      
        ColorRevisionRefAvalDesc: string
      
        ObservacionRevisionRefAval?: string
      
        VerificaTitular: number
      
        ColorVerificaTitular: string
      
        ColorVerificaTitularDesc: string
      
        ObservacionVerificaTitular	?: string
      
        VerificaAval: number
      
        ColorVerificaAval: string
      
        ColorVerificaAvalDesc: string
      
        ObservacionVerificaAval?: string
      
        RevisionDocumentosAval: number
      
        ColorRevisionDocumentosAval: string
      
        ObservacionRevisionDocsAval?: string
      
        Dictamen: number
      
        ColorDictamen: string
      
        ColorDictamenDesc: string
      
        ObservacionDictamen?: string
      
        Consolidacion: number
      
        ColorConsolidacion: string
      
        ColorConsolidacionDesc: string
      
        ObservacionConsolidacion?: string
      
        NivelOrigen_BuroID?: number
      
        DistribuidorNivelInternoID?: number
      
        Descartado?: boolean
      
        ObservacionesDescartado: string
      
        FechaDescarte?: string

    }
    export interface IProspectosAsignaciones_VW {
              
        ProspectoID: number
      
        ProspectoNombre: string
      
        PromotorUsuarioID: number
      
        PromotorPersonaID: number
      
        PromotorNombre: string
      
        AnalistaBuroUsuarioID?: number
      
        AnalistaBuroPersonaID?: number
      
        AnalistaBuroNombre?: string
      
        AnalistaMesaUsuarioID?: number
      
        AnalistaMesaPersonaID?: number
      
        AnalistaMesaNombre?: string
      
        AnalistaLlamadaUsuarioID?: number
      
        AnalistaLlamadaPersonaID?: number
      
        AnalistaLlamadaNombre?: string
      
        SucursalID: number
      
        ProductoID: number

    }
    export interface IProspectosDatosGeneralesApp_VW {
              
        PersonaID: number
      
        LugarNacimientoId?: number
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        NombreCompleto: string
      
        FechaNacimiento: string
      
        SexoID: string
      
        Sexo: string
      
        CURP: string
      
        RFC: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        LugarNacimiento: string
      
        Observacion?: string
      
        AsentamientoID?: number
      
        CodigoPostal?: number
      
        Asentamiento?: string
      
        calle?: string
      
        localidad?: string
      
        numeroExterior?: string
      
        Municipio?: string
      
        Estado?: string
      
        DireccionProspecto?: string
      
        TelefonoDomicilio?: string
      
        TieneEmpleo: number
      
        Empresa?: string
      
        OcupacionID?: number
      
        Ocupacion?: string
      
        Sueldo?: number
      
        Antiguedad?: string
      
        AsentamientoIDEmpleo?: number
      
        AsentamientoEmpleo?: string
      
        CodigoPostalEmpleo?: number
      
        calleEmpleo?: string
      
        localidadEmpleo?: string
      
        numeroExteriorEmpleo?: string
      
        DireccionEmpresaProspecto?: string
      
        TelefonoEmpleo?: string
      
        EstadoCivilID?: string
      
        EstadoCivil: string
      
        TieneConyuge: number
      
        NombreConyuge: string
      
        TieneEmpleoConyuge: number
      
        EmpresaConyuge?: string
      
        OcupacionIDConyuge?: number
      
        OcupacionConyuge?: string
      
        SueldoConyuge?: number
      
        AntiguedadConyuge?: string
      
        AsentamientoIDEmpresaConyuge?: number
      
        CodigoPostalEmpleoConyuge?: number
      
        localidadEmpresaConyuge?: string
      
        calleEmpresaConyuge?: string
      
        NumeroExteriorEmpresaConyuge?: string
      
        DireccionEmpresaConyuge?: string
      
        TelefonoEmpresaConyuge?: string
      
        EstatusConsultaBuroID: number
      
        StatusProcesoID?: number
      
        Contrato?: string
      
        Pagare?: string
      
        PagareReverso?: string

    }
    export interface IProspectosDatosGenereles_VW {
              
        PersonaID: number
      
        LugarNacimientoId?: number
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        NombreCompleto: string
      
        FechaNacimiento: string
      
        SexoID: string
      
        Sexo: string
      
        CURP: string
      
        RFC: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        LugarNacimiento: string
      
        Observacion?: string
      
        AsentamientoID?: number
      
        CodigoPostal?: number
      
        Asentamiento?: string
      
        calle?: string
      
        localidad?: string
      
        numeroExterior?: string
      
        Municipio?: string
      
        Estado?: string
      
        DireccionProspecto?: string
      
        TelefonoDomicilio?: string
      
        TieneEmpleo: number
      
        Empresa?: string
      
        OcupacionID?: number
      
        Ocupacion?: string
      
        Sueldo?: number
      
        Antiguedad?: string
      
        AsentamientoIDEmpleo?: number
      
        AsentamientoEmpleo?: string
      
        CodigoPostalEmpleo?: number
      
        calleEmpleo?: string
      
        localidadEmpleo?: string
      
        numeroExteriorEmpleo?: string
      
        DireccionEmpresaProspecto?: string
      
        TelefonoEmpleo?: string
      
        EstadoCivilID?: string
      
        EstadoCivil: string
      
        TieneConyuge: number
      
        NombreConyuge: string
      
        TieneEmpleoConyuge: number
      
        EmpresaConyuge?: string
      
        OcupacionIDConyuge?: number
      
        OcupacionConyuge?: string
      
        SueldoConyuge?: number
      
        AntiguedadConyuge?: string
      
        AsentamientoIDEmpresaConyuge?: number
      
        CodigoPostalEmpleoConyuge?: number
      
        localidadEmpresaConyuge?: string
      
        calleEmpresaConyuge?: string
      
        NumeroExteriorEmpresaConyuge?: string
      
        DireccionEmpresaConyuge?: string
      
        TelefonoEmpresaConyuge?: string
      
        EstatusConsultaBuroID: number
      
        StatusProcesoID?: number
      
        Contrato?: string
      
        Pagare?: string
      
        PagareReverso?: string

    }
    export interface IProspectosDatosSocioeconomicos_VW {
              
        PersonaID: number
      
        RFC: string
      
        TipoViviendaID?: number
      
        TipoVivienda?: string
      
        numeroPersonasHabitan?: number
      
        valorAproximado?: number
      
        TieneOtraVivienda?: boolean
      
        TipoOtraViviendaID?: number
      
        TipoViviendaOtra?: string
      
        valorAproximadoOtra?: number
      
        calle?: string
      
        numeroExterior?: string
      
        AsentamientoID?: number
      
        localidad?: string
      
        DireccionOtraVivienda?: string
      
        ingresoSueldo?: number
      
        gananciasDV?: number
      
        ingresoConyuge?: number
      
        otrosIngresos?: number
      
        ingresoTotal?: number
      
        AlimetacionEgreso?: number
      
        TarjetasEgreso?: number
      
        RentaPagoViviendaEgreso?: number
      
        ServiciosDomesticosEgreso?: number
      
        OtroEgreso?: number
      
        DependientesEconomicos?: number
      
        EgresoTotal?: number
      
        tieneAutoMoto?: boolean
      
        tieneExperiencia?: boolean
      
        tieneDependientes?: boolean
      
        EstatusConsultaBuroID: number
      
        DistribuidorTiposID: number
      
        DistribuidorTipos?: string
      
        OtraViviendaCodigoPostal?: number

    }
    export interface IProspectosDatosSocioeconomicosApp_VW {
              
        PersonaID: number
      
        RFC: string
      
        TipoViviendaID?: number
      
        TipoVivienda?: string
      
        numeroPersonasHabitan?: number
      
        valorAproximado?: number
      
        TieneOtraVivienda?: boolean
      
        TipoOtraViviendaID?: number
      
        TipoViviendaOtra?: string
      
        valorAproximadoOtra?: number
      
        calle?: string
      
        numeroExterior?: string
      
        AsentamientoID?: number
      
        localidad?: string
      
        DireccionOtraVivienda?: string
      
        ingresoSueldo?: number
      
        gananciasDV?: number
      
        ingresoConyuge?: number
      
        otrosIngresos?: number
      
        ingresoTotal?: number
      
        AlimetacionEgreso?: number
      
        TarjetasEgreso?: number
      
        RentaPagoViviendaEgreso?: number
      
        ServiciosDomesticosEgreso?: number
      
        OtroEgreso?: number
      
        DependientesEconomicos?: number
      
        EgresoTotal?: number
      
        tieneAutoMoto?: boolean
      
        tieneExperiencia?: boolean
      
        tieneDependientes?: boolean
      
        EstatusConsultaBuroID: number
      
        DistribuidorTiposID: number
      
        DistribuidorTipos?: string
      
        OtraViviendaCodigoPostal?: number

    }
    export interface IProspectosDocumentos_VW {
              
        TipoDocumentoID: number
      
        NombreDocumento: string
      
        Clave: string
      
        Descripcion?: string
      
        Orden?: number
      
        DocumentoID?: number
      
        PersonaID?: number
      
        TipoPersonaID?: number
      
        Ruta?: string
      
        Autorizado?: boolean
      
        ConsultaBuro: boolean
      
        ProductoID: number
      
        Opcional?: boolean

    }
    export interface IProspectosDocumentosApp_VW {
              
        TipoDocumentoID: number
      
        NombreDocumento: string
      
        Clave: string
      
        Descripcion?: string
      
        Orden?: number
      
        DocumentoID?: number
      
        PersonaID?: number
      
        TipoPersonaID?: number
      
        Ruta?: string
      
        Autorizado?: boolean
      
        ConsultaBuro: boolean
      
        ProductoID: number
      
        Opcional?: boolean

    }
    export interface IProspectosExperienciaVentas_VW {
              
        ExperienciaVentasID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        FechaIngreso?: string
      
        LimiteCredito: number
      
        CreditoDisponible: number
      
        Status?: string
      
        EmpresaExperienciaID: number
      
        Descripcion: string
      
        EmpresaActivo: boolean

    }
    export interface IProspectosExperienciaVentasApp_VW {
              
        ExperienciaVentasID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        FechaIngreso?: string
      
        LimiteCredito: number
      
        CreditoDisponible: number
      
        Status?: string
      
        EmpresaExperienciaID: number
      
        Descripcion: string
      
        EmpresaActivo: boolean

    }
    export interface IProspectosStatusProcesos_VW {
              
        StatusProcesoID: number
      
        Descripcion: string
      
        PersonaID?: number
      
        TipoPersonaID?: number
      
        Resultado?: string
      
        Validado?: boolean
      
        CapturaObligatoria?: boolean
      
        DictamenObligatorio?: boolean
      
        ProductoID?: number

    }
    export interface IReferencias {
              
        ReferenciaID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        numeroReferencia: number
      
        nombre: string
      
        primerApellido: string
      
        segundoApellido: string
      
        parentesco: string
      
        celular: string
      
        domicilio: string
      
        edad: number
      
        Activo: boolean
      
        Validado?: boolean
      
        Observacion?: string

    }
    export interface IReferenciasApp_VW {
              
        ReferenciaID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        numeroReferencia: number
      
        nombre: string
      
        primerApellido: string
      
        segundoApellido: string
      
        parentesco: string
      
        celular: string
      
        domicilio: string
      
        edad: number
      
        Activo: boolean
      
        Validado?: boolean
      
        Observacion?: string

    }
    export interface IRelacionAutoMoto {
              
        RelacionAutoMotoID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        Modelo: string
      
        Marca: string
      
        Status: string

    }
    export interface IRelacionAutoMotoApp_VW {
              
        RelacionAutoMotoID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        Modelo: string
      
        Marca: string
      
        Status: string

    }
    export interface IStatusProceso {
              
        StatusProcesoID: number
      
        Descripcion: string
      
        Activo: boolean

    }
    export interface ITiemposAsignaAnalista_VW {
              
        LogTiempoID: number
      
        AsignaAnalistaID: number
      
        NombreCompleto: string
      
        Tiempo: string
      
        ProspectoID: number
      
        StatusProcesoID: number
      
        Descripcion: string
      
        Validado?: boolean

    }
    export interface ITipoDocumento {
              
        TipoDocumentoID: number
      
        CatalogoTipoDocumentoID: number
      
        Orden?: number
      
        Activo: boolean
      
        ProductoID: number
      
        ConsultaBuro: boolean
      
        Opcional?: boolean

    }
    export interface ITipoDocumento_VW {
              
        TipoDocumentoID?: number
      
        CatalogoTipoDocumentoID: number
      
        Orden?: number
      
        Activo?: boolean
      
        ProductoID?: number
      
        ConsultaBuro?: boolean
      
        Opcional?: boolean
      
        NombreDocumento: string

    }
    export interface ITipoDocumentoAval {
              
        TipoDocumentoAvalID: number
      
        CatalogoTipoDocumentoID: number
      
        Orden?: number
      
        Activo: boolean
      
        ProductoID: number

    }
    export interface ITipoDocumentoAval_VW {
              
        TipoDocumentoAvalID?: number
      
        CatalogoTipoDocumentoID: number
      
        Orden?: number
      
        Activo?: boolean
      
        ProductoID?: number
      
        NombreDocumento: string

    }
    export interface ITipoPersona {
              
        TipoPersonaID: number
      
        Clave: string
      
        Descripcion: string

    }
    export interface ITipoPersonaPrueba {
              
        TipoPersonaID: number
      
        Clave: string
      
        Descripcion: string

    }
    export interface ITipoVivienda {
              
        TipoViviendaID: number
      
        Descripcion: string
      
        Activo: boolean

    }
    export interface ITuberia {
              
        TuberiaID: number
      
        PersonaID: number
      
        TipoPersonaID: number
      
        StatusProcesoID: number
      
        TuberiaResultadoID: number
      
        Validado?: boolean
      
        FechaRegistro: string
      
        FechaValidacion?: string
      
        PersonaAnalistaID: number
      
        UsuarioAnalistaID: number
      
        Observacion?: string

    }
    export interface ITuberiaResultado {
              
        TuberiaResultadoID: number
      
        Resultado: string

    }
    export interface IValidacionBuroMesa {
              
        ValidacionBuroMesaID: number
      
        ProspectoID: number
      
        AsignaAnalistaID: number

    }
    export interface IValidacionLlamadasMesa {
              
        ValidacionLlamadasMesaID: number
      
        ProspectoID: number
      
        AsignaAnalistaID: number

    }
    export interface IValidacionMesa {
              
        ValidacionMesaID: number
      
        ProspectoID: number
      
        AsignaAnalistaID: number
      
        enSucursal: boolean
      
        EstatusValidacionID: number

    }
}