export namespace DBConfia_Catalogos {
        
    export interface IAvalTipos {
              
        avalTipoId: number
      
        avalTipo?: string
      
        activo: boolean
      
        color: string

    }
    export interface IBuroInternoEstatus {
              
        BuroInternoEstatusID: number
      
        Nombre: string
      
        PuedeCanjear: boolean
      
        Color: string

    }
    export interface ICiudadesEstado {
              
        ciudadEstadoId: number
      
        ciudadEstadoNombre: string
      
        estadoPaisId: number

    }
    export interface ICodigosPostales_VW {
              
        id_estado?: number
      
        id_municipio?: number
      
        CodigoPostalID: number
      
        CodigoPostal: number

    }
    export interface IDatosBancariosTipos {
              
        datoTipoID: number
      
        datoTipoDesc: string
      
        dispersion: boolean
      
        cobranza: boolean
      
        EnApp?: boolean

    }
    export interface IDistribuidoresTipos {
              
        DistribuidorTiposID: number
      
        DistribuidorTipos?: string

    }
    export interface IDocumentosGenerales {
              
        ID: number
      
        NombreDocumento?: string
      
        Archivo?: string
      
        Activo?: boolean

    }
    export interface IDocumentosTipos {
              
        documentosTipoId: number
      
        documentosTipoNombre?: string
      
        soloIMG: boolean
      
        activo: boolean
      
        claveDoc?: string
      
        ordenSistema: number

    }
    export interface IEscolaridades {
              
        EscolaridadID: number
      
        Escolaridad: string

    }
    export interface IEstadosCiviles {
              
        EstadoCivilID: string
      
        EstadoCivil: string

    }
    export interface IEstadosCoordinador {
              
        EstadoCoordinadorId: string
      
        Nombre: string
      
        Color: string
      
        CreacionFecha: string
      
        CreacionPersonaId: number
      
        ModificacionFecha?: string
      
        ModificacionPersonaId?: number
      
        CreacionUsuarioId: number
      
        ModificacionUsuarioId?: number

    }
    export interface IEstadosPais {
              
        estadoPaisId: number
      
        estadoPaisNombre: string
      
        abreviatura: string
      
        estadoPaisCodigo: string
      
        RENAPOA?: string

    }
    export interface IEstatusAplicacion {
              
        EstatusApID: number
      
        Clave: string
      
        Descripcion: string

    }
    export interface IEstatusConsultaBuro {
              
        EstatusConsultaBuroID: number
      
        Descripcion?: string

    }
    export interface IEstatusMesa {
              
        EstatusMesaID: number
      
        Descripcion: string

    }
    export interface IEstatusValidacion {
              
        EstatusValidacionID: number
      
        descripcion: string

    }
    export interface IEventosTipos {
              
        eventoTipoId: number
      
        eventoTipo: string

    }
    export interface IGastosRubros {
              
        gastosRubroID: number
      
        gastosRubroDesc: string
      
        activo: boolean

    }
    export interface IIdentificacionesTipos {
              
        identificacionTipoId: number
      
        identificacionDesc: string
      
        activo: boolean

    }
    export interface ILineasAdicionalesTipos {
              
        Id: number
      
        LineaAdicionalTipoDesc: string

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
      
        UsuarioIDRegistra: number
      
        TipoMovimiento: string
      
        CveMovimientoID: string
      
        NumeroCuenta: string
      
        Descripcion?: string
      
        Producto: string
      
        capturo: string
      
        CreditoID?: number
      
        GrupoID?: number
      
        NombreGrupo?: string
      
        Cliente?: string
      
        ClienteID?: number
      
        RequiereGrupo: boolean
      
        CreditosActivos?: number
      
        CreditosTotales?: number
      
        Logo?: any
      
        NombreCompleto?: string

    }
    export interface IMsjMotivosExpedientes {
              
        MsjMotivoExpedienteID: number
      
        Mensaje: string
      
        Clave: string
      
        MsjError: boolean
      
        Activo?: boolean

    }
    export interface IMunicipios_VW {
              
        id_estado?: number
      
        id_municipio?: number
      
        Municipio?: string

    }
    export interface IOcupacionCoord_VW {
              
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
      
        Id?: number
      
        Ocupacion?: string
      
        PuestoFinanciera?: boolean
      
        EsPromotor?: boolean
      
        EsCoordinador?: boolean
      
        EsCajero?: boolean
      
        EsGestor?: boolean
      
        EsDirector?: boolean

    }
    export interface IOcupaciones {
              
        Id: number
      
        Ocupacion?: string
      
        PuestoFinanciera?: boolean
      
        EsPromotor?: boolean
      
        EsCoordinador?: boolean
      
        EsCajero?: boolean
      
        EsGestor?: boolean
      
        EsDirector?: boolean

    }
    export interface IOrientacionVialidadTipos {
              
        orientacionVialidadTipoId: number
      
        orientacionVialidadTipo: string

    }
    export interface IPagareEstatus {
              
        pagareEstatusId: number
      
        pagareEstatusDesc: string

    }
    export interface IReferenciasTipos {
              
        referenciaTipoId: number
      
        referenciaTipo: string
      
        Activo: boolean
      
        esFamiliar: boolean
      
        esAval: boolean

    }
    export interface ISexos {
              
        SexoID: string
      
        Sexo: string

    }
    export interface ITipoArchivoDispersion {
              
        ArchivoDispersionID: number
      
        Clave: string
      
        Descripcion: string

    }
    export interface ITipoAsentamiento_VW {
              
        id_tipo_asentamiento?: number
      
        Tipo_asenta?: string

    }
    export interface ITipoDocumento {
              
        TipoDocumentoID: number
      
        NombreDocumento: string
      
        Clave: string
      
        Descripcion?: string
      
        Activo?: boolean

    }
    export interface ITiposDocumentos {
              
        documentosTipoId: number
      
        documentosTipoNombre?: string
      
        productoID: number
      
        extencion: string
      
        subtipo: string
      
        activo: boolean
      
        claveDoc: string
      
        nombreCorto: string
      
        documento?: string
      
        requeridoValidacion: boolean

    }
    export interface ITipoTraspaso {
              
        tipoTraspasoID: number
      
        nombre?: string
      
        activo?: boolean

    }
    export interface IValidacionMesa {
              
        CatValidacionMesaID: number
      
        Descripcion: string

    }
    export interface IVariablesGlobales {
              
        Id: number
      
        varName: string
      
        varValue?: any
      
        usuario: boolean

    }
    export interface IVialidadesTipos {
              
        vialidadTipoId: number
      
        vialidadTipo: string

    }
    export interface IViviendasTipos {
              
        ViviendaTipoId: number
      
        ViviendaTipo?: string
      
        Activa: boolean

    }
}