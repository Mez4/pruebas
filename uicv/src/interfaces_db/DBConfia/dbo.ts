export namespace DBConfia_dbo {
        
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
      
        Sucursal: string
      
        Distribuidor: string
      
        Cliente?: string

    }
    export interface IASSOCIATED_POLICY {
              
        POLICY_ID: string
      
        ASSOCIATED_POLICY_ID: string

    }
    export interface IAUTHENTICATION_EXECUTION {
              
        ID: string
      
        ALIAS?: string
      
        AUTHENTICATOR?: string
      
        REALM_ID?: string
      
        FLOW_ID?: string
      
        REQUIREMENT?: number
      
        PRIORITY?: number
      
        AUTHENTICATOR_FLOW: boolean
      
        AUTH_FLOW_ID?: string
      
        AUTH_CONFIG?: string

    }
    export interface IAUTHENTICATION_FLOW {
              
        ID: string
      
        ALIAS?: string
      
        DESCRIPTION?: string
      
        REALM_ID?: string
      
        PROVIDER_ID: string
      
        TOP_LEVEL: boolean
      
        BUILT_IN: boolean

    }
    export interface IAUTHENTICATOR_CONFIG {
              
        ID: string
      
        ALIAS?: string
      
        REALM_ID?: string

    }
    export interface IAUTHENTICATOR_CONFIG_ENTRY {
              
        AUTHENTICATOR_ID: string
      
        VALUE?: string
      
        NAME: string

    }
    export interface IBROKER_LINK {
              
        IDENTITY_PROVIDER: string
      
        STORAGE_PROVIDER_ID?: string
      
        REALM_ID: string
      
        BROKER_USER_ID?: string
      
        BROKER_USERNAME?: string
      
        TOKEN?: string
      
        USER_ID: string

    }
    export interface ICLIENT {
              
        ID: string
      
        ENABLED: boolean
      
        FULL_SCOPE_ALLOWED: boolean
      
        CLIENT_ID?: string
      
        NOT_BEFORE?: number
      
        PUBLIC_CLIENT: boolean
      
        SECRET?: string
      
        BASE_URL?: string
      
        BEARER_ONLY: boolean
      
        MANAGEMENT_URL?: string
      
        SURROGATE_AUTH_REQUIRED: boolean
      
        REALM_ID?: string
      
        PROTOCOL?: string
      
        NODE_REREG_TIMEOUT?: number
      
        FRONTCHANNEL_LOGOUT: boolean
      
        CONSENT_REQUIRED: boolean
      
        NAME?: string
      
        SERVICE_ACCOUNTS_ENABLED: boolean
      
        CLIENT_AUTHENTICATOR_TYPE?: string
      
        ROOT_URL?: string
      
        DESCRIPTION?: string
      
        REGISTRATION_TOKEN?: string
      
        STANDARD_FLOW_ENABLED: boolean
      
        IMPLICIT_FLOW_ENABLED: boolean
      
        DIRECT_ACCESS_GRANTS_ENABLED: boolean
      
        ALWAYS_DISPLAY_IN_CONSOLE: boolean

    }
    export interface ICLIENT_ATTRIBUTES {
              
        CLIENT_ID: string
      
        VALUE?: string
      
        NAME: string

    }
    export interface ICLIENT_AUTH_FLOW_BINDINGS {
              
        CLIENT_ID: string
      
        FLOW_ID?: string
      
        BINDING_NAME: string

    }
    export interface ICLIENT_INITIAL_ACCESS {
              
        ID: string
      
        REALM_ID: string
      
        TIMESTAMP?: number
      
        EXPIRATION?: number
      
        COUNT?: number
      
        REMAINING_COUNT?: number

    }
    export interface ICLIENT_NODE_REGISTRATIONS {
              
        CLIENT_ID: string
      
        VALUE?: number
      
        NAME: string

    }
    export interface ICLIENT_SCOPE {
              
        ID: string
      
        NAME?: string
      
        REALM_ID?: string
      
        DESCRIPTION?: string
      
        PROTOCOL?: string

    }
    export interface ICLIENT_SCOPE_ATTRIBUTES {
              
        SCOPE_ID: string
      
        VALUE?: string
      
        NAME: string

    }
    export interface ICLIENT_SCOPE_CLIENT {
              
        CLIENT_ID: string
      
        SCOPE_ID: string
      
        DEFAULT_SCOPE: boolean

    }
    export interface ICLIENT_SCOPE_ROLE_MAPPING {
              
        SCOPE_ID: string
      
        ROLE_ID: string

    }
    export interface ICLIENT_SESSION {
              
        ID: string
      
        CLIENT_ID?: string
      
        REDIRECT_URI?: string
      
        STATE?: string
      
        TIMESTAMP?: number
      
        SESSION_ID?: string
      
        AUTH_METHOD?: string
      
        REALM_ID?: string
      
        AUTH_USER_ID?: string
      
        CURRENT_ACTION?: string

    }
    export interface ICLIENT_SESSION_AUTH_STATUS {
              
        AUTHENTICATOR: string
      
        STATUS?: number
      
        CLIENT_SESSION: string

    }
    export interface ICLIENT_SESSION_NOTE {
              
        NAME: string
      
        VALUE?: string
      
        CLIENT_SESSION: string

    }
    export interface ICLIENT_SESSION_PROT_MAPPER {
              
        PROTOCOL_MAPPER_ID: string
      
        CLIENT_SESSION: string

    }
    export interface ICLIENT_SESSION_ROLE {
              
        ROLE_ID: string
      
        CLIENT_SESSION: string

    }
    export interface ICLIENT_USER_SESSION_NOTE {
              
        NAME: string
      
        VALUE?: string
      
        CLIENT_SESSION: string

    }
    export interface ICOMPONENT {
              
        ID: string
      
        NAME?: string
      
        PARENT_ID?: string
      
        PROVIDER_ID?: string
      
        PROVIDER_TYPE?: string
      
        REALM_ID?: string
      
        SUB_TYPE?: string

    }
    export interface ICOMPONENT_CONFIG {
              
        ID: string
      
        COMPONENT_ID: string
      
        NAME: string
      
        VALUE?: string

    }
    export interface ICOMPOSITE_ROLE {
              
        COMPOSITE: string
      
        CHILD_ROLE: string

    }
    export interface ICREDENTIAL {
              
        ID: string
      
        SALT?: any
      
        TYPE?: string
      
        USER_ID?: string
      
        CREATED_DATE?: number
      
        USER_LABEL?: string
      
        SECRET_DATA?: string
      
        CREDENTIAL_DATA?: string
      
        PRIORITY?: number

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
    export interface IDATABASECHANGELOG {
              
        ID: string
      
        AUTHOR: string
      
        FILENAME: string
      
        DATEEXECUTED: string
      
        ORDEREXECUTED: number
      
        EXECTYPE: string
      
        MD5SUM?: string
      
        DESCRIPTION?: string
      
        COMMENTS?: string
      
        TAG?: string
      
        LIQUIBASE?: string
      
        CONTEXTS?: string
      
        LABELS?: string
      
        DEPLOYMENT_ID?: string

    }
    export interface IDATABASECHANGELOGLOCK {
              
        ID: number
      
        LOCKED: boolean
      
        LOCKGRANTED?: string
      
        LOCKEDBY?: string

    }
    export interface IDEFAULT_CLIENT_SCOPE {
              
        REALM_ID: string
      
        SCOPE_ID: string
      
        DEFAULT_SCOPE: boolean

    }
    export interface IDesembolsosFiniquitos {
              
        Id: number
      
        Cia: number
      
        IDSB: number
      
        PersonaID: number
      
        CuentaBancoID: number
      
        Desembolsado: boolean
      
        Cancelado: boolean
      
        Importe: number
      
        MovimientoID: number
      
        UsuarioCreoId: number
      
        FechaCreo: string
      
        UsuarioDesembolsoId?: number
      
        FechaDesembolso?: string
      
        UsuarioCanceloId?: number
      
        FechaCancelo?: string

    }
    export interface IDestinatarios_VW {
              
        DestinatarioId: number
      
        SMSId: number
      
        Destinatario: number
      
        RefV?: string
      
        RefI?: number
      
        IDProridadMensajes?: number

    }
    export interface IDocumentoConvenios {
              
        DocumentoConvenioID: number
      
        UsuarioRegistroID: number
      
        FechaRegistro: string
      
        ConvenioID: number
      
        Ruta: string
      
        Activo: boolean
      
        UsuarioReemplazoID?: number
      
        FechaReemplazo?: string

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
    export interface Idvscortepart {
              
        DistribuidorID: number

    }
    export interface IDvsNoAplicados {
              
        Distribuidorid?: number
      
        SucursalID?: number
      
        Importe?: number
      
        FechaPago?: string
      
        CajaID?: number

    }
    export interface IEmpleado_VW {
              
        MB_CIASID: number
      
        Emp_nie: number
      
        Emp_TitProf?: string
      
        Emp_LugCas?: string
      
        Emp_direcc?: string
      
        Emp_telefo?: string
      
        Emp_car_espe?: number
      
        Emp_car_famil?: number
      
        Emp_pre_natal?: number
      
        Emp_tramoaf?: number
      
        Emp_naco?: number
      
        Emp_Pasaporte?: string
      
        Emp_CalMig?: string
      
        Emp_CartaNat?: string
      
        Emp_esco?: number
      
        Emp_prco?: number
      
        Emp_ecco?: number
      
        Emp_idco?: number
      
        Emp_accidente?: string
      
        Emp_ferol?: string
      
        Emp_sitmil?: string
      
        Emp_grusan?: string
      
        Emp_DrCalle?: string
      
        Emp_DrNumI?: string
      
        Emp_DrNumE?: string
      
        Emp_DrColonia?: string
      
        Emp_DrCodigoP?: string
      
        Emp_DrCodigoP2?: string
      
        Emp_DrMunicipio?: string
      
        Emp_DrOrientacion?: string
      
        Emp_Cve_elector?: string
      
        Emp_Alergias?: string
      
        Emp_TelEmergencias?: string
      
        Emp_ContEmergencias?: string
      
        Emp_NomPadre?: string
      
        Emp_PadreFN?: string
      
        Emp_PadreVive?: string
      
        Emp_PadreDE?: string
      
        Emp_NomMadre?: string
      
        Emp_MadreFN?: string
      
        Emp_MadreVive?: string
      
        Emp_MadreDE?: string
      
        Emp_NacLugar?: string
      
        Emp_NacCiudad?: string
      
        Emp_Aniversario?: string
      
        ClinID?: string
      
        Emp_poliza?: string
      
        ASG_ID?: number
      
        IDSE_Imp?: string
      
        INFV_CAL?: number
      
        Emp_DirEst?: string
      
        Emp_Temp?: string
      
        Emp_FIProy?: string
      
        Emp_TraAnt?: string
      
        Emp_cedprof?: string
      
        Emp_Licencia?: string
      
        Emp_Cartilla?: string
      
        Emp_Checa?: string
      
        Emp_Tras?: string
      
        Emp_EmpPro?: number
      
        Emp_NSocio?: number
      
        Emp_material?: string
      
        Emp_igf?: number
      
        Emp_dormitorio?: number
      
        Emp_conservacion?: string
      
        Emp_equipamiento?: string
      
        Emp_servicios?: string
      
        Emp_higuiene?: string
      
        Emp_SUCURP?: string
      
        Emp_SUJor?: number
      
        Emp_SUTipSal?: number
      
        Emp_SUCveUbi?: string
      
        Emp_SUCreINF?: string
      
        Emp_SUCreDV?: number
      
        Emp_SUTipDsc?: number
      
        Emp_SUIniDsc?: string
      
        Emp_SUValDsc?: number
      
        Emp_SUPrcDsc?: number
      
        Emp_SUSDIB?: number
      
        Emp_SUCons?: number
      
        Emp_SUTipMov?: string
      
        Emp_SUFecMov?: string
      
        Emp_SULTCod?: number
      
        Emp_SUSDIF?: number
      
        Emp_SUSDIV?: number
      
        Emp_SUSDIN?: number
      
        Emp_SUSDITopDF?: number
      
        Emp_SUFacSal?: number
      
        Emp_SUPrcInf?: number
      
        Emp_SUPrcEstado?: number
      
        Tsin_cod?: string
      
        Mb_Cod_Ban?: string
      
        Emp_ctacte?: string
      
        Emp_CtaAdic?: string
      
        DpCodigo?: number
      
        CtCodigo?: number
      
        Emp_declara?: string
      
        Emp_PTU?: string
      
        Emp_mpco?: number
      
        Emp_cuota_ahorro?: number
      
        Emp_bien?: string
      
        Emp_etapa?: number
      
        Emp_actualizado?: number
      
        Emp_Comisi?: string
      
        Emp_DctoIm?: string
      
        Emp_CobObj?: number
      
        Emp_Despensa?: number
      
        Emp_Asistencia?: number
      
        Vales_Cod?: string
      
        Pres_Grupo?: number
      
        Emp_categ?: number
      
        Emp_ahorro?: number
      
        Emp_pfija?: number
      
        Emp_Ban_afore?: string
      
        Emp_Cta_afore?: string
      
        AreCodArea?: number
      
        Emp_fechanacimiento?: string
      
        Emp_sexo?: string
      
        Emp_estado_civil?: string
      
        Emp_foto?: string
      
        Emp_tipco?: number
      
        PsCodigo?: number
      
        Emp_PlzCod?: number
      
        Emp_fefct?: string
      
        Emp_sueldo_mes?: number
      
        Emp_tipcco?: string
      
        Emp_tipjo?: number
      
        Emp_jor?: string
      
        Emp_tipnv4?: string
      
        Emp_carfec?: string
      
        Emp_catfec?: string
      
        Emp_CtaAux?: string
      
        Emp_imss?: string
      
        Emp_DigVer?: number
      
        Emp_desltr?: string
      
        Emp_sueldo_fiscal?: number
      
        Emp_Puntualidad?: number
      
        Emp_sueldo_base?: number
      
        Emp_sueldo_nfiscal?: number
      
        Emp_sueldo_efectivo?: number
      
        Emp_descar?: string
      
        Rol_cod?: number
      
        Emp_dignie?: string
      
        Emp_rut?: string
      
        Emp_digito?: string
      
        Emp_frec?: string
      
        Emp_FecCon?: string
      
        Emp_fevac?: string
      
        Emp_feprg?: string
      
        Emp_diavac?: number
      
        Emp_vacprg?: number
      
        Emp_prgext?: number
      
        Emp_FecAltaIMSS?: string
      
        Emp_fecha_ingreso?: string
      
        Emp_fecfin?: string
      
        ETCId?: string
      
        Emp_sueldo_dia?: number
      
        Emp_CtaSuc?: string
      
        Emp_lpObra?: string
      
        Emp_DrCiudad?: string
      
        Emp_DrEstado?: string
      
        NMINEDID?: number
      
        Emp_lpco?: number
      
        Emp_patern?: string
      
        Emp_matern?: string
      
        Emp_nombres?: string
      
        Est_cod?: string
      
        NMPLINID?: number
      
        Es_cod?: string
      
        Emp_CGCA01ID?: string
      
        Emp_CGCA02ID?: string
      
        Emp_CGCA03ID?: string
      
        Emp_CGCA04ID?: string
      
        Emp_CGCA05ID?: string
      
        Emp_CGCA06ID?: string
      
        Emp_CGCA07ID?: string
      
        Emp_CGCA08ID?: string
      
        Emp_CGCA09ID?: string
      
        Emp_CGCA10ID?: string
      
        Emp_ALIAS?: string
      
        Emp_GrupoNom?: number
      
        Emp_DC?: number
      
        Emp_CU?: number
      
        Emp_Fte?: string
      
        Emp_puesto?: number
      
        Emp_EsMadre?: string
      
        Emp_EMail?: string
      
        Emp_JefeInm?: number
      
        Emp_JefeCia?: number
      
        Emp_cncdir?: number
      
        NMTPPLZID?: string
      
        Emp_LyEsRN?: string
      
        Emp_PswEnc?: string
      
        Emp_Key?: string
      
        Emp_pwd?: string
      
        Emp_Ctrl?: number
      
        NmSucID: number
      
        GSangId?: number
      
        Emp_tel4?: string
      
        Emp_tel3?: string
      
        Emp_tel2?: string
      
        EMP01ID?: string
      
        EMP02ID?: string
      
        EMP_RFC_TMP?: string
      
        EMP_CURP_TMP?: string
      
        Id_Horario?: number
      
        wDespensaEfvo?: number
      
        wDespensapor?: number
      
        emp_edo?: string
      
        EMP_FECFIN2?: string
      
        Emp_fecnss?: string
      
        Emp_gratif?: number
      
        Emp_CandBan?: string
      
        Emp_asignacion?: string
      
        Emp_segmento?: string
      
        Emp_jefedirecto?: string
      
        Emp_tarjetavales?: string
      
        Emp_Esc_cod?: number
      
        Emp_coordinador?: number
      
        Emp_Enc_Nomina?: string
      
        Emp_Cont_num?: number
      
        Est_cod_fin?: string
      
        Exp_Validado?: string
      
        Cvecli?: string
      
        Est_nom_apl?: string
      
        IdBancario?: string
      
        Est_empl_finiquito?: string
      
        IdEmpVR?: number
      
        Tipo_Traspaso?: string
      
        Emp_nie_ant?: number
      
        Regimen?: number
      
        Sindicato?: number
      
        Mb_Cod_Ban2?: string
      
        Emp_ctacte2?: string
      
        Emp_CtaAdic2?: string
      
        ID_SISTEMA_CARTERA?: number
      
        ID_SISTEMA_PRESPER?: number
      
        PsCodigoSal?: number
      
        PuestoFiscal?: string
      
        Emp_SUImpDsc?: number
      
        NombreCompleto: string
      
        Nombre: string
      
        PersonaID: number
      
        IdSucRenta?: number
      
        ProductoID?: number
      
        SucursalID: number
      
        PuestoNomina?: string
      
        PuestoCV?: number

    }
    export interface IEVENT_ENTITY {
              
        ID: string
      
        CLIENT_ID?: string
      
        DETAILS_JSON?: string
      
        ERROR?: string
      
        IP_ADDRESS?: string
      
        REALM_ID?: string
      
        SESSION_ID?: string
      
        EVENT_TIME?: number
      
        TYPE?: string
      
        USER_ID?: string

    }
    export interface IFED_USER_ATTRIBUTE {
              
        ID: string
      
        NAME: string
      
        USER_ID: string
      
        REALM_ID: string
      
        STORAGE_PROVIDER_ID?: string
      
        VALUE?: string

    }
    export interface IFED_USER_CONSENT {
              
        ID: string
      
        CLIENT_ID?: string
      
        USER_ID: string
      
        REALM_ID: string
      
        STORAGE_PROVIDER_ID?: string
      
        CREATED_DATE?: number
      
        LAST_UPDATED_DATE?: number
      
        CLIENT_STORAGE_PROVIDER?: string
      
        EXTERNAL_CLIENT_ID?: string

    }
    export interface IFED_USER_CONSENT_CL_SCOPE {
              
        USER_CONSENT_ID: string
      
        SCOPE_ID: string

    }
    export interface IFED_USER_CREDENTIAL {
              
        ID: string
      
        SALT?: any
      
        TYPE?: string
      
        CREATED_DATE?: number
      
        USER_ID: string
      
        REALM_ID: string
      
        STORAGE_PROVIDER_ID?: string
      
        USER_LABEL?: string
      
        SECRET_DATA?: string
      
        CREDENTIAL_DATA?: string
      
        PRIORITY?: number

    }
    export interface IFED_USER_GROUP_MEMBERSHIP {
              
        GROUP_ID: string
      
        USER_ID: string
      
        REALM_ID: string
      
        STORAGE_PROVIDER_ID?: string

    }
    export interface IFED_USER_REQUIRED_ACTION {
              
        REQUIRED_ACTION: string
      
        USER_ID: string
      
        REALM_ID: string
      
        STORAGE_PROVIDER_ID?: string

    }
    export interface IFED_USER_ROLE_MAPPING {
              
        ROLE_ID: string
      
        USER_ID: string
      
        REALM_ID: string
      
        STORAGE_PROVIDER_ID?: string

    }
    export interface IFEDERATED_IDENTITY {
              
        IDENTITY_PROVIDER: string
      
        REALM_ID?: string
      
        FEDERATED_USER_ID?: string
      
        FEDERATED_USERNAME?: string
      
        TOKEN?: string
      
        USER_ID: string

    }
    export interface IFEDERATED_USER {
              
        ID: string
      
        STORAGE_PROVIDER_ID?: string
      
        REALM_ID: string

    }
    export interface IGestores_VW {
              
        GestorID: number
      
        ZonaID?: number
      
        ZonaNombre?: string
      
        SucursalID: number
      
        SucursalNombre?: string
      
        CarteraVencida: boolean
      
        ImprimirRelacionesMasivas: boolean
      
        EstadoGestorId: string
      
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
    export interface IGROUP_ATTRIBUTE {
              
        ID: string
      
        NAME: string
      
        VALUE?: string
      
        GROUP_ID: string

    }
    export interface IGROUP_ROLE_MAPPING {
              
        ROLE_ID: string
      
        GROUP_ID: string

    }
    export interface IGruposGestores_VW {
              
        GrupoID: number
      
        ProductoID: number
      
        SucursalID: number
      
        GestorID: number
      
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
    export interface IIDENTITY_PROVIDER {
              
        INTERNAL_ID: string
      
        ENABLED: boolean
      
        PROVIDER_ALIAS?: string
      
        PROVIDER_ID?: string
      
        STORE_TOKEN: boolean
      
        AUTHENTICATE_BY_DEFAULT: boolean
      
        REALM_ID?: string
      
        ADD_TOKEN_ROLE: boolean
      
        TRUST_EMAIL: boolean
      
        FIRST_BROKER_LOGIN_FLOW_ID?: string
      
        POST_BROKER_LOGIN_FLOW_ID?: string
      
        PROVIDER_DISPLAY_NAME?: string
      
        LINK_ONLY: boolean

    }
    export interface IIDENTITY_PROVIDER_CONFIG {
              
        IDENTITY_PROVIDER_ID: string
      
        VALUE?: string
      
        NAME: string

    }
    export interface IIDENTITY_PROVIDER_MAPPER {
              
        ID: string
      
        NAME: string
      
        IDP_ALIAS: string
      
        IDP_MAPPER_NAME: string
      
        REALM_ID: string

    }
    export interface IIDP_MAPPER_CONFIG {
              
        IDP_MAPPER_ID: string
      
        VALUE?: string
      
        NAME: string

    }
    export interface IIDSOCIAS {
              
        NombreCompleto?: string
      
        DistribuidorID_CV?: string
      
        SucursalID_VR?: string
      
        SucursalID_CV?: string
      
        DistribuidorID_VR?: string
      
        Nota?: string

    }
    export interface Iimagenes_app {
              
        id_empresa?: string
      
        tabla?: string
      
        movimiento?: string
      
        renglon?: number
      
        fecha?: string
      
        id_usuario?: string
      
        foto?: any
      
        fum?: string

    }
    export interface IInventarioUniformes {
              
        Id: string
      
        Usuario: number
      
        Producto: number
      
        IdProfesor: string
      
        NumeroPiezas: number
      
        FechaPedido: string

    }
    export interface IKEYCLOAK_GROUP {
              
        ID: string
      
        NAME?: string
      
        PARENT_GROUP: string
      
        REALM_ID?: string

    }
    export interface IKEYCLOAK_ROLE {
              
        ID: string
      
        CLIENT_REALM_CONSTRAINT?: string
      
        CLIENT_ROLE: boolean
      
        DESCRIPTION?: string
      
        NAME?: string
      
        REALM_ID?: string
      
        CLIENT?: string
      
        REALM?: string

    }
    export interface IMensajesSMS_VW {
              
        SMSId: number
      
        mensaje: string
      
        estatusEnvioID: string
      
        fhRegistro?: string
      
        fhEnviado?: string
      
        ultimoResultado?: string
      
        fhUltimoIntentoEnvio?: string
      
        fhEnviar?: string
      
        Intentos?: number
      
        sistemaId: number
      
        provedorID: number

    }
    export interface IMIGRATION_MODEL {
              
        ID: string
      
        VERSION?: string
      
        UPDATE_TIME: number

    }
    export interface IOFFLINE_CLIENT_SESSION {
              
        USER_SESSION_ID: string
      
        CLIENT_ID: string
      
        OFFLINE_FLAG: string
      
        TIMESTAMP?: number
      
        DATA?: string
      
        CLIENT_STORAGE_PROVIDER: string
      
        EXTERNAL_CLIENT_ID: string

    }
    export interface IOFFLINE_USER_SESSION {
              
        USER_SESSION_ID: string
      
        USER_ID?: string
      
        REALM_ID: string
      
        CREATED_ON: number
      
        OFFLINE_FLAG: string
      
        DATA?: string
      
        LAST_SESSION_REFRESH: number

    }
    export interface IpagosDistrib {
              
        DistribuidorID?: number
      
        Nombre?: string
      
        Monto?: number
      
        FechaPago?: string
      
        Aplicado?: boolean

    }
    export interface IPagosProcesadosBBVA {
              
        PersonaID?: number
      
        SucursalID?: number
      
        Sucursal_Nombre?: string
      
        RefPagoID?: number
      
        ProductoID?: number
      
        Importe?: number
      
        FechaPago?: string
      
        FechaIns?: string
      
        FechaArchivo?: string
      
        EstatusApp?: string
      
        CorresponsalPagoID?: number
      
        EmpresaID?: number
      
        AplicacionID?: number
      
        FechaAplicacion?: string
      
        PagosProcesadoID?: number
      
        SistemaID?: number

    }
    export interface IPOLICY_CONFIG {
              
        POLICY_ID: string
      
        NAME: string
      
        VALUE?: string

    }
    export interface IPROTOCOL_MAPPER {
              
        ID: string
      
        NAME: string
      
        PROTOCOL: string
      
        PROTOCOL_MAPPER_NAME: string
      
        CLIENT_ID?: string
      
        CLIENT_SCOPE_ID?: string

    }
    export interface IPROTOCOL_MAPPER_CONFIG {
              
        PROTOCOL_MAPPER_ID: string
      
        VALUE?: string
      
        NAME: string

    }
    export interface IREALM {
              
        ID: string
      
        ACCESS_CODE_LIFESPAN?: number
      
        USER_ACTION_LIFESPAN?: number
      
        ACCESS_TOKEN_LIFESPAN?: number
      
        ACCOUNT_THEME?: string
      
        ADMIN_THEME?: string
      
        EMAIL_THEME?: string
      
        ENABLED: boolean
      
        EVENTS_ENABLED: boolean
      
        EVENTS_EXPIRATION?: number
      
        LOGIN_THEME?: string
      
        NAME?: string
      
        NOT_BEFORE?: number
      
        PASSWORD_POLICY?: string
      
        REGISTRATION_ALLOWED: boolean
      
        REMEMBER_ME: boolean
      
        RESET_PASSWORD_ALLOWED: boolean
      
        SOCIAL: boolean
      
        SSL_REQUIRED?: string
      
        SSO_IDLE_TIMEOUT?: number
      
        SSO_MAX_LIFESPAN?: number
      
        UPDATE_PROFILE_ON_SOC_LOGIN: boolean
      
        VERIFY_EMAIL: boolean
      
        MASTER_ADMIN_CLIENT?: string
      
        LOGIN_LIFESPAN?: number
      
        INTERNATIONALIZATION_ENABLED: boolean
      
        DEFAULT_LOCALE?: string
      
        REG_EMAIL_AS_USERNAME: boolean
      
        ADMIN_EVENTS_ENABLED: boolean
      
        ADMIN_EVENTS_DETAILS_ENABLED: boolean
      
        EDIT_USERNAME_ALLOWED: boolean
      
        OTP_POLICY_COUNTER?: number
      
        OTP_POLICY_WINDOW?: number
      
        OTP_POLICY_PERIOD?: number
      
        OTP_POLICY_DIGITS?: number
      
        OTP_POLICY_ALG?: string
      
        OTP_POLICY_TYPE?: string
      
        BROWSER_FLOW?: string
      
        REGISTRATION_FLOW?: string
      
        DIRECT_GRANT_FLOW?: string
      
        RESET_CREDENTIALS_FLOW?: string
      
        CLIENT_AUTH_FLOW?: string
      
        OFFLINE_SESSION_IDLE_TIMEOUT?: number
      
        REVOKE_REFRESH_TOKEN: boolean
      
        ACCESS_TOKEN_LIFE_IMPLICIT?: number
      
        LOGIN_WITH_EMAIL_ALLOWED: boolean
      
        DUPLICATE_EMAILS_ALLOWED: boolean
      
        DOCKER_AUTH_FLOW?: string
      
        REFRESH_TOKEN_MAX_REUSE?: number
      
        ALLOW_USER_MANAGED_ACCESS: boolean
      
        SSO_MAX_LIFESPAN_REMEMBER_ME: number
      
        SSO_IDLE_TIMEOUT_REMEMBER_ME: number
      
        DEFAULT_ROLE?: string

    }
    export interface IREALM_ATTRIBUTE {
              
        NAME: string
      
        REALM_ID: string
      
        VALUE?: string

    }
    export interface IREALM_DEFAULT_GROUPS {
              
        REALM_ID: string
      
        GROUP_ID: string

    }
    export interface IREALM_ENABLED_EVENT_TYPES {
              
        REALM_ID: string
      
        VALUE: string

    }
    export interface IREALM_EVENTS_LISTENERS {
              
        REALM_ID: string
      
        VALUE: string

    }
    export interface IREALM_LOCALIZATIONS {
              
        REALM_ID: string
      
        LOCALE: string
      
        TEXTS: string

    }
    export interface IREALM_REQUIRED_CREDENTIAL {
              
        TYPE: string
      
        FORM_LABEL?: string
      
        INPUT: boolean
      
        SECRET: boolean
      
        REALM_ID: string

    }
    export interface IREALM_SMTP_CONFIG {
              
        REALM_ID: string
      
        VALUE?: string
      
        NAME: string

    }
    export interface IREALM_SUPPORTED_LOCALES {
              
        REALM_ID: string
      
        VALUE: string

    }
    export interface IREDIRECT_URIS {
              
        CLIENT_ID: string
      
        VALUE: string

    }
    export interface IReferenciasConekta_VW {
              
        ReferenciaConektaID: number
      
        Nombre?: string
      
        Telefono?: string
      
        Correo?: string
      
        Barcode_url?: string
      
        Reference?: string
      
        FechaRegistro?: string
      
        PersonaID?: number

    }
    export interface IReferenciasConektaApp_VW {
              
        ReferenciaConektaID: number
      
        TelefonoReferencia?: string
      
        DistribuidorID?: number
      
        Correo?: string
      
        Barcode_url?: string
      
        Reference?: string
      
        FechaRegistro?: string
      
        ComisionOxxo: number

    }
    export interface IREQUIRED_ACTION_CONFIG {
              
        REQUIRED_ACTION_ID: string
      
        VALUE?: string
      
        NAME: string

    }
    export interface IREQUIRED_ACTION_PROVIDER {
              
        ID: string
      
        ALIAS?: string
      
        NAME?: string
      
        REALM_ID?: string
      
        ENABLED: boolean
      
        DEFAULT_ACTION: boolean
      
        PROVIDER_ID?: string
      
        PRIORITY?: number

    }
    export interface IRESOURCE_ATTRIBUTE {
              
        ID: string
      
        NAME: string
      
        VALUE?: string
      
        RESOURCE_ID: string

    }
    export interface IRESOURCE_POLICY {
              
        RESOURCE_ID: string
      
        POLICY_ID: string

    }
    export interface IRESOURCE_SCOPE {
              
        RESOURCE_ID: string
      
        SCOPE_ID: string

    }
    export interface IRESOURCE_SERVER {
              
        ID: string
      
        ALLOW_RS_REMOTE_MGMT: boolean
      
        POLICY_ENFORCE_MODE: string
      
        DECISION_STRATEGY: number

    }
    export interface IRESOURCE_SERVER_PERM_TICKET {
              
        ID: string
      
        OWNER: string
      
        REQUESTER: string
      
        CREATED_TIMESTAMP: number
      
        GRANTED_TIMESTAMP?: number
      
        RESOURCE_ID: string
      
        SCOPE_ID?: string
      
        RESOURCE_SERVER_ID: string
      
        POLICY_ID?: string

    }
    export interface IRESOURCE_SERVER_POLICY {
              
        ID: string
      
        NAME: string
      
        DESCRIPTION?: string
      
        TYPE: string
      
        DECISION_STRATEGY?: string
      
        LOGIC?: string
      
        RESOURCE_SERVER_ID: string
      
        OWNER?: string

    }
    export interface IRESOURCE_SERVER_RESOURCE {
              
        ID: string
      
        NAME: string
      
        TYPE?: string
      
        ICON_URI?: string
      
        OWNER: string
      
        RESOURCE_SERVER_ID: string
      
        OWNER_MANAGED_ACCESS: boolean
      
        DISPLAY_NAME?: string

    }
    export interface IRESOURCE_SERVER_SCOPE {
              
        ID: string
      
        NAME: string
      
        ICON_URI?: string
      
        RESOURCE_SERVER_ID: string
      
        DISPLAY_NAME?: string

    }
    export interface IRESOURCE_URIS {
              
        RESOURCE_ID: string
      
        VALUE: string

    }
    export interface IROLE_ATTRIBUTE {
              
        ID: string
      
        ROLE_ID: string
      
        NAME: string
      
        VALUE?: string

    }
    export interface IROLES_REL_VW {
              
        ID?: string
      
        DESCRIPTION?: string
      
        NAME?: string
      
        REALM_ID?: string
      
        CLIENT?: string
      
        PARENT_ID?: string
      
        PARENT_NAME?: string
      
        rdepth?: number

    }
    export interface IROLES_VW {
              
        ID: string
      
        DESCRIPTION?: string
      
        NAME?: string
      
        REALM_ID?: string
      
        CLIENT?: string
      
        PARENT_ID?: string
      
        PARENT_NAME?: string

    }
    export interface IRPM_ReferenciasSPEI_VW {
              
        empresaid: number
      
        empresa?: string
      
        TipoReferencia: string
      
        Referenciaid: number
      
        prefijoPagoSoriana?: string
      
        ReferenciaSoriana?: string
      
        Description?: string
      
        Amount?: number
      
        Account?: string
      
        CustomerEmail?: string
      
        CustomerName?: string
      
        ExpirationDate?: string
      
        Estatus?: string
      
        clabe_spei?: string
      
        fhGeneracion?: string
      
        ProspectoID?: number

    }
    export interface ISCOPE_MAPPING {
              
        CLIENT_ID: string
      
        ROLE_ID: string

    }
    export interface ISCOPE_POLICY {
              
        SCOPE_ID: string
      
        POLICY_ID: string

    }
    export interface ISistema {
              
        SistemaId: number
      
        NombreSistema?: string
      
        AbrevSistema?: string

    }
    export interface Isysdiagrams {
              
        name: string
      
        principal_id: number
      
        diagram_id: number
      
        version?: number
      
        definition?: any

    }
    export interface ItasasPlazosTemp {
              
        DetalleID: number
      
        Renglon?: number
      
        TabuladorTasa: number
      
        IdentificadorId: number
      
        Nivel: string
      
        plazosMin: number
      
        plazosMax: number
      
        importeMin: number
      
        importeMax: number
      
        tasa: number
      
        seguroPlazo: number
      
        cat: number
      
        activo?: boolean
      
        plazosEspeciales?: boolean

    }
    export interface ITemporalAplicadorCV {
              
        IDTemp: number
      
        RMPMXPagoID?: number
      
        TRANSACTION_ID: string
      
        TRANSACTION_DATE: string
      
        AUTHORIZATION: string
      
        REFERENCE?: string
      
        fHRegistro?: string
      
        CVDistribuidorID?: number
      
        SucursalID?: number
      
        Sucursal_Nombre?: string
      
        AMOUNT?: number
      
        AMOUNT_MN?: number
      
        PagoTotal?: number
      
        GenPPI?: boolean
      
        PagoIgualado?: boolean
      
        MontoCPT?: number
      
        EstatusPago?: string
      
        MontoDNI?: number
      
        FechaTraduccion?: string

    }
    export interface ITemporalAplicadorCVBBVA {
              
        IDTemp: number
      
        PersonaID?: number
      
        SucursalID?: number
      
        Sucursal_Nombre?: string
      
        RefPagoID?: number
      
        ProductoID?: number
      
        Importe?: number
      
        FechaPago?: string
      
        FechaIns?: string
      
        FechaArchivo?: string
      
        EstatusApp?: string
      
        CorresponsalPagoID?: number
      
        EmpresaID?: number
      
        AplicacionID?: number
      
        FechaAplicacion?: string
      
        AMOUNT_MN?: number
      
        PagoTotal?: number
      
        GenPPI?: boolean
      
        PagoIgualado?: boolean
      
        MontoCPT?: number
      
        MontoDNI?: number

    }
    export interface ITienditaCelulares_VW {
              
        id_empresa: number
      
        id_sku: number
      
        id_padre: number
      
        id_estructura: number
      
        marca?: string
      
        estilo?: string
      
        color?: string
      
        id_composicion: number
      
        id_corrida: number
      
        id_talla: number
      
        id_tipo_category: number
      
        fecha_captura: string
      
        fecha_llegada: string
      
        sw_estatus: number
      
        codigo_barras: string
      
        referencia: string
      
        iva: number
      
        fum: string

    }
    export interface Itmp_paso_pagos {
              
        creditoid?: number
      
        plazo?: number
      
        abono?: number
      
        fecha_pago?: string
      
        fechora_cap?: string

    }
    export interface Itmp_Personas_Diplicadas_20220219 {
              
        PersonaID?: number
      
        PersonaID1: number
      
        NombreCompleto: string

    }
    export interface Itmp_planpagos {
              
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
      
        monto?: number
      
        imp_total?: number
      
        plazos_real?: number

    }
    export interface IUSER_ATTRIBUTE {
              
        NAME: string
      
        VALUE?: string
      
        USER_ID: string
      
        ID: string

    }
    export interface IUSER_CONSENT {
              
        ID: string
      
        CLIENT_ID?: string
      
        USER_ID: string
      
        CREATED_DATE?: number
      
        LAST_UPDATED_DATE?: number
      
        CLIENT_STORAGE_PROVIDER?: string
      
        EXTERNAL_CLIENT_ID?: string

    }
    export interface IUSER_CONSENT_CLIENT_SCOPE {
              
        USER_CONSENT_ID: string
      
        SCOPE_ID: string

    }
    export interface IUSER_ENTITY {
              
        ID: string
      
        EMAIL?: string
      
        EMAIL_CONSTRAINT?: string
      
        EMAIL_VERIFIED: boolean
      
        ENABLED: boolean
      
        FEDERATION_LINK?: string
      
        FIRST_NAME?: string
      
        LAST_NAME?: string
      
        REALM_ID?: string
      
        USERNAME?: string
      
        CREATED_TIMESTAMP?: number
      
        SERVICE_ACCOUNT_CLIENT_LINK?: string
      
        NOT_BEFORE: number

    }
    export interface IUSER_FEDERATION_CONFIG {
              
        USER_FEDERATION_PROVIDER_ID: string
      
        VALUE?: string
      
        NAME: string

    }
    export interface IUSER_FEDERATION_MAPPER {
              
        ID: string
      
        NAME: string
      
        FEDERATION_PROVIDER_ID: string
      
        FEDERATION_MAPPER_TYPE: string
      
        REALM_ID: string

    }
    export interface IUSER_FEDERATION_MAPPER_CONFIG {
              
        USER_FEDERATION_MAPPER_ID: string
      
        VALUE?: string
      
        NAME: string

    }
    export interface IUSER_FEDERATION_PROVIDER {
              
        ID: string
      
        CHANGED_SYNC_PERIOD?: number
      
        DISPLAY_NAME?: string
      
        FULL_SYNC_PERIOD?: number
      
        LAST_SYNC?: number
      
        PRIORITY?: number
      
        PROVIDER_NAME?: string
      
        REALM_ID?: string

    }
    export interface IUSER_GROUP_MEMBERSHIP {
              
        GROUP_ID: string
      
        USER_ID: string

    }
    export interface IUSER_REQUIRED_ACTION {
              
        USER_ID: string
      
        REQUIRED_ACTION: string

    }
    export interface IUSER_ROLE_MAPPING {
              
        ROLE_ID: string
      
        USER_ID: string

    }
    export interface IUSER_ROLES_REL_VW {
              
        USER_ID: string
      
        EMAIL?: string
      
        USERNAME?: string
      
        ENABLED: boolean
      
        FIRST_NAME?: string
      
        LAST_NAME?: string
      
        ROLE_ID_MAIN?: string
      
        ROLE_ID?: string
      
        ROLE_NAME?: string
      
        ROLE_DESCRIPTION?: string
      
        ROLE_DEPTH?: number
      
        ROLE_KIND: string

    }
    export interface IUSER_ROLES_VW {
              
        ID: string
      
        EMAIL?: string
      
        USERNAME?: string
      
        ENABLED: boolean
      
        FIRST_NAME?: string
      
        LAST_NAME?: string
      
        NAME: string
      
        ROLE_ID?: string
      
        ROLE_NAME?: string
      
        ROLE_DESCRIPTION?: string
      
        CLIENT?: string

    }
    export interface IUSER_SESSION {
              
        ID: string
      
        AUTH_METHOD?: string
      
        IP_ADDRESS?: string
      
        LAST_SESSION_REFRESH?: number
      
        LOGIN_USERNAME?: string
      
        REALM_ID?: string
      
        REMEMBER_ME: boolean
      
        STARTED?: number
      
        USER_ID?: string
      
        USER_SESSION_STATE?: number
      
        BROKER_SESSION_ID?: string
      
        BROKER_USER_ID?: string

    }
    export interface IUSER_SESSION_NOTE {
              
        USER_SESSION: string
      
        NAME: string
      
        VALUE?: string

    }
    export interface IUSERNAME_LOGIN_FAILURE {
              
        REALM_ID: string
      
        USERNAME: string
      
        FAILED_LOGIN_NOT_BEFORE?: number
      
        LAST_FAILURE?: number
      
        LAST_IP_FAILURE?: string
      
        NUM_FAILURES?: number

    }
    export interface IvwRandom {
              
        Rnd?: number

    }
    export interface IWEB_ORIGINS {
              
        CLIENT_ID: string
      
        VALUE: string

    }
}