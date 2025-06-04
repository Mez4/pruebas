export namespace DBConfia_General {
        
    export interface IBitacoraCambios {
              
        BitacoraID: number
      
        FechaAfectacion?: string
      
        Accion?: string
      
        PersonaID: number
      
        Modulo: string
      
        Dato?: string
      
        DatoAnt?: string
      
        DatoNvo?: string

    }
    export interface ICatalogoEmpresas {
              
        CatEmpresaID: number
      
        NombreEmpresa: string
      
        FechaRegistro: string
      
        PersonaRegistraID: number
      
        UsuarioRegistraID: number
      
        FechaModifica?: string
      
        PersonaModificaID?: number
      
        UsuarioModificaID?: number

    }
    export interface ICodigoSMS {
              
        Id: number
      
        PersonaID: number
      
        Codigo: string
      
        FechaEnvio: string
      
        FechaCaduca: string
      
        Confirmado: boolean
      
        SMSId?: number
      
        CanjeAppId?: number
      
        TipoID?: number

    }
    export interface ICodigoSMSApp {
              
        Id: number
      
        PersonaID: number
      
        Codigo: string
      
        FechaEnvio: string
      
        FechaCaduca: string
      
        Confirmado: boolean
      
        SMSId?: number
      
        CanjeAppId?: number
      
        TipoID?: number

    }
    export interface IColoresProducto {
              
        ColorProductoID: number
      
        idTipoEmpresa?: number
      
        NombreColor?: string
      
        ValorColor?: number

    }
    export interface IColoresProducto_VW {
              
        ProductoID?: number
      
        NombreColor?: string
      
        ValorColor?: number

    }
    export interface IColoresProductoApp_VW {
              
        NombreColor?: string
      
        ValorColor?: number
      
        TipoEmpresaId: number
      
        EmpresaId: number

    }
    export interface IConfigTipoDispersionApp {
              
        ConfigTipoDispersionAppID: number
      
        Nombre: string
      
        Clave: string
      
        FechaRegistro: string
      
        Activo: boolean
      
        HabilitadoParaPP?: boolean

    }
    export interface IConsultaBuro {
              
        ConsultaBuroID: number
      
        PersonaID: number
      
        XmlResultBuroID: number
      
        ResultCode: number
      
        ResultDesc: string
      
        FechaRegistro: string
      
        UsuarioRegistraID: number
      
        PersonaRegistaID: number
      
        FechaConsulta?: string
      
        EstatusConsultaBuroID: number
      
        url?: string

    }
    export interface ICuentasSaldos {
              
        CuentasSaldosID: number
      
        Fecha: string
      
        CuentaID: number
      
        SaldoInicial: number
      
        Cargos: number
      
        Abonos: number
      
        SaldoFinal: number

    }
    export interface IDatoActualPersona {
              
        PersonaID: number
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        TelefonoMovil: string
      
        RFC: string
      
        FechaNacimiento: string
      
        NombreVialidad?: string
      
        NumeroInterior?: string
      
        NumeroExterior?: string
      
        CURP: string
      
        codigoPostal?: number
      
        id_asentamiento?: number
      
        Estado?: string
      
        Municipio?: string
      
        Asentamiento?: string
      
        Ciudad?: string
      
        Prospecto: number
      
        AltaDireccionFecha?: string
      
        AltaDireccionActualFecha?: string
      
        AsentamientoID?: number
      
        AsentamientoID1?: number

    }
    export interface IDatosBancariosPersonas_VW {
              
        personaID: number
      
        NombreCompleto: string
      
        datoBancario?: string
      
        datoTipoID: number
      
        datoTipoDesc: string
      
        BancoID: number
      
        BancoNombre: string
      
        Descripcion: string
      
        fechaRegistro: string
      
        activo: boolean

    }
    export interface IDirecciones {
              
        DireccionID: number
      
        vialidadTipoId: number
      
        orientacionVialidadTipoId?: number
      
        AsentamientoID?: number
      
        NombreVialidad: string
      
        NumeroExterior: string
      
        NumeroInterior?: string
      
        ReferenciasGeograficas?: string
      
        ViviendaTipoId?: number
      
        CreacionFecha: string
      
        CreacionPersonaID: number
      
        codigoPostal?: string
      
        CreacionUsuarioID: number

    }
    export interface IDirecciones_VW {
              
        PersonaID?: number
      
        DireccionID: number
      
        AsentamientoID?: number
      
        NombreVialidad: string
      
        Asentamiento?: string
      
        NumeroInterior?: string
      
        NumeroExterior: string
      
        Estado?: string
      
        Municipio?: string
      
        Ciudad?: string
      
        CodigoPostal?: number
      
        vialidadTipoId: number
      
        vialidadTipo: string
      
        orientacionVialidadTipoId?: number
      
        orientacionVialidadTipo: string
      
        oficina_postal?: string
      
        zona?: string
      
        ViviendaTipoId?: number
      
        ViviendaTipo?: string
      
        CreacionFecha: string
      
        CreacionPersonaID: number
      
        CreacionUsuarioID: number
      
        ReferenciasGeograficas?: string

    }
    export interface IDireccionesMigradas {
              
        IDDireccion: number
      
        PersonaID?: number
      
        IDExterno?: number
      
        Ciudad?: string
      
        Direccion?: string

    }
    export interface IDirectores {
              
        DirectorID: number
      
        PersonaID: number
      
        LineaCreditoPersonal: number
      
        PagareEstatusId?: number
      
        PagareCantidad?: number
      
        CreacionPersonaID: number
      
        CreacionFecha: string
      
        IdentificadorAnterior?: string
      
        FechaUltimoCredito?: string
      
        CreacionUsuarioID: number
      
        ZonaID?: number

    }
    export interface IDirectores_VW {
              
        DirectorID: number
      
        ZonaID?: number
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        NombreCompleto: string
      
        FechaNacimiento?: string
      
        LugarNacimiento: string
      
        CURP: string
      
        RFC: string
      
        SexoID: string
      
        EstadoCivilID?: string
      
        EscolaridadID?: number
      
        DependientesEconomicos?: number
      
        TelefonoDomicilio?: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        NombreConyuge: string
      
        Observaciones?: string
      
        identificacionTipoId?: number
      
        identificacionNumero?: string
      
        AsentamientoID?: number
      
        NombreVialidad?: string
      
        NumeroInterior?: string
      
        NumeroExterior?: string
      
        vialidadTipoId?: number
      
        orientacionVialidadTipoId?: number
      
        ViviendaTipoId?: number
      
        ReferenciasGeograficas?: string
      
        Empresa?: string
      
        Puesto?: string
      
        OcupacionID?: number
      
        Telefono?: string
      
        FechaIngreso?: string
      
        FechaTermino?: string
      
        SueldoMensual?: number
      
        vialidadTipoIdEmpleo?: number
      
        NombreVialidadEmpleo?: string
      
        orientacionVialidadTipoIdEmpleo?: number
      
        NumeroExteriorEmpleo?: string
      
        NumeroInteriorEmpleo?: string
      
        ReferenciasGeograficasEmpleo?: string
      
        AsentamientoIDEmpleo?: number
      
        viviendaTipoIdEmpleo?: number

    }
    export interface IEmpleos {
              
        EmpleoID: number
      
        PersonaID: number
      
        OcupacionID: number
      
        Empresa: string
      
        Puesto: string
      
        Telefono: string
      
        DireccionID: number
      
        FechaIngreso: string
      
        FechaTermino?: string
      
        SueldoMensual: number
      
        Activo?: boolean
      
        CreacionFecha: string
      
        CreacionPersonaID: number
      
        CreacionUsuarioID: number

    }
    export interface IEmpleos_VW {
              
        EmpleoID: number
      
        PersonaID: number
      
        OcupacionID: number
      
        Empresa: string
      
        Puesto: string
      
        Telefono: string
      
        DireccionID: number
      
        FechaIngreso: string
      
        FechaTermino?: string
      
        SueldoMensual: number
      
        Activo?: boolean
      
        CreacionFecha: string
      
        CreacionPersonaID: number
      
        CreacionUsuarioID: number
      
        Direccion_AsentamientoID?: number
      
        Direccion_NombreVialidad?: string
      
        Direccion_Asentamiento?: string
      
        Direccion_NumeroInterior?: string
      
        Direccion_NumeroExterior?: string
      
        Direccion_Estado?: string
      
        Direccion_Municipio?: string
      
        Direccion_Ciudad?: string
      
        Direccion_CodigoPostal?: number
      
        Direccion_vialidadTipoId?: number
      
        Direccion_vialidadTipo?: string
      
        Direccion_orientacionVialidadTipoId?: number
      
        Direccion_orientacionVialidadTipo?: string
      
        Direccion_oficina_postal?: string
      
        Direccion_zona?: string
      
        Direccion_ViviendaTipoId?: number
      
        Direccion_ViviendaTipo?: string

    }
    export interface IEmpresas {
              
        empresaId: number
      
        empresaNombre: string
      
        empresaRfc: string
      
        empresaDireccionFiscal: string
      
        empresaRegistroPatronal: string
      
        empresaRazonSocial: string
      
        PrefijoApp?: string
      
        EsPrestaStar?: boolean
      
        TipoEmpresaID?: number

    }
    export interface IEmpresas_VW {
              
        empresaId: number
      
        empresaNombre: string
      
        empresaRfc: string
      
        empresaDireccionFiscal: string
      
        empresaRegistroPatronal: string
      
        empresaRazonSocial: string
      
        PrefijoApp?: string
      
        EsPrestaStar?: boolean
      
        TipoEmpresaID?: number
      
        TipoEmpresa: string

    }
    export interface IEstatusBuroInterno {
              
        Tipo: string
      
        Descri: string
      
        Mostrar_en_Buro: boolean

    }
    export interface IGerentes {
              
        GerenteID: number
      
        SucursalID: number
      
        FechaHoraRegistro?: string
      
        PersonaIDRegistro?: number
      
        UsuarioIDRegistro?: number
      
        UsuarioID?: number

    }
    export interface ILogCambioDatos {
              
        LogCambioDatosID: number
      
        PersonaID: number
      
        Fecha: string
      
        Dato: string
      
        DatoAnterior: string
      
        DatoActualizado: string
      
        UsuarioModificaID: number

    }
    export interface ILogCelular {
              
        LogCelularID: number
      
        PersonaID: number
      
        Celular: string
      
        PersonaIDModifica: number
      
        UsuarioIDModifica: number
      
        FechaHora?: string

    }
    export interface ILogContrasenas {
              
        LogContrasenaID: number
      
        PersonaID: number
      
        PersonaIDModifica: number
      
        UsuarioIDModifica: number
      
        FechaHora?: string

    }
    export interface ILogImpresionDocumentos {
              
        Id: number
      
        UsuarioId: number
      
        PersonaId: number
      
        Fecha: string
      
        CreditoID: number
      
        TipoDocumentoId: number

    }
    export interface ILogSociasCaida {
              
        LogSociasCaidaID: number
      
        FechaCaida?: string
      
        DistribuidorID?: number
      
        DistribuidorNivelID?: number
      
        DistribuidorOrigenID?: number
      
        StatusBuroID?: number

    }
    export interface ILogSociasCaida_VW {
              
        DistribuidorID: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidorNivelID: number
      
        DistribuidorNivelOrigenID: number
      
        DistribuidorNivel: string
      
        Expr1: number
      
        Expr2: string
      
        BuroInternoEstatusID: number
      
        Nombre: string

    }
    export interface ILogTelefono {
              
        LogTelefonoID: number
      
        PersonaID: number
      
        Telefono: string
      
        PersonaIDModifica: number
      
        UsuarioIDModifica: number
      
        FechaHora: string

    }
    export interface IPersonas {
              
        PersonaID: number
      
        Nombre: string
      
        ApellidoPaterno: string
      
        ApellidoMaterno: string
      
        FechaNacimiento: string
      
        LugarNacimiento: string
      
        CURP: string
      
        RFC: string
      
        SexoID: string
      
        EstadoCivilID?: string
      
        EscolaridadID?: number
      
        IngresosMensuales: number
      
        DependientesEconomicos?: number
      
        TelefonoDomicilio?: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        NombreConyuge: string
      
        BuroInternoEstatusID?: number
      
        Observaciones?: string
      
        identificacionTipoId?: number
      
        identificacionNumero?: string
      
        canjeValeSolicitudId?: number
      
        GrupoID?: number
      
        NombreCompleto: string
      
        CreacionFecha: string
      
        CreacionPersonaID?: number
      
        CreacionUsuarioID?: number
      
        SoundexNombre?: string
      
        SoundexAPaterno?: string
      
        SoundexAMaterno?: string
      
        SACId?: number
      
        ModificacionFecha?: string
      
        ModificacionPersonaID?: number
      
        ModificacionUsuarioID?: number
      
        movCli?: number
      
        CveCli?: string
      
        PersonaIdExt?: number
      
        ArchivoEstatusID?: number
      
        FechaPrimerCanje?: string
      
        BloqueadoCliente?: boolean
      
        ImagenCliente?: string
      
        IDExterno?: string
      
        IDSisFecha?: string
      
        TipoExt?: string
      
        ProductoID?: number
      
        EstatusBuro?: string
      
        RutaFirma?: string

    }
    export interface IPersonas_VW {
              
        PersonaID: number
      
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
      
        SACId?: number
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        NombreConyuge: string
      
        BuroInternoEstatusID?: number
      
        BuroInternoColor?: string
      
        BuroInternoEstatus?: string
      
        BuroInternoEstatusPuedeCanjear?: boolean
      
        Observaciones?: string
      
        identificacionTipoId?: number
      
        identificacionTipo?: string
      
        identificacionNumero?: string
      
        canjeValeSolicitudId?: number
      
        NombreCompleto: string
      
        CreacionFecha: string
      
        CreacionPersonaID?: number
      
        CreacionUsuarioID?: number
      
        DistribuidorID?: number
      
        ClienteID?: number
      
        CoordinadorID?: number
      
        ProspectoID?: number
      
        ProspectoAval?: number
      
        creditoPromotorId?: number
      
        AnalistaID?: number
      
        DirectorMesaCreditoID?: number
      
        GestorCobranzaID?: number
      
        DirectorMesaCobranzaID?: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidoresEstatus?: string
      
        UsuarioID?: number
      
        FechaHoraRegistro?: string
      
        DistribuidorIDVR?: string

    }
    export interface IPersonasApp_VW {
              
        PersonaID: number
      
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
      
        SACId?: number
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        NombreConyuge: string
      
        BuroInternoEstatusID?: number
      
        BuroInternoColor?: string
      
        BuroInternoEstatus?: string
      
        BuroInternoEstatusPuedeCanjear?: boolean
      
        Observaciones?: string
      
        identificacionTipoId?: number
      
        identificacionTipo?: string
      
        identificacionNumero?: string
      
        canjeValeSolicitudId?: number
      
        NombreCompleto: string
      
        CreacionFecha: string
      
        CreacionPersonaID?: number
      
        CreacionUsuarioID?: number
      
        DistribuidorID?: number
      
        ClienteID?: number
      
        CoordinadorID?: number
      
        ProspectoID?: number
      
        ProspectoAval?: number
      
        creditoPromotorId?: number
      
        AnalistaID?: number
      
        DirectorMesaCreditoID?: number
      
        GestorCobranzaID?: number
      
        DirectorMesaCobranzaID?: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidoresEstatus?: string
      
        UsuarioID?: number
      
        FechaHoraRegistro?: string

    }
    export interface IPersonasDatosBancarios {
              
        personasDatosBancariosID: number
      
        personaID: number
      
        datoTipoID: number
      
        cveBancoRef: number
      
        datoBancario: string
      
        fechaRegistro: string
      
        activo: boolean

    }
    export interface IPersonasDatosBancarios_VW {
              
        personaID: number
      
        NombreCompleto: string
      
        datoBancario?: string
      
        datoTipoID: number
      
        datoTipoDesc: string
      
        BancoID: number
      
        BancoNombre: string
      
        Logo?: any
      
        Descripcion: string
      
        fechaRegistro: string
      
        activo: boolean
      
        personasDatosBancariosID: number

    }
    export interface IPersonasDirecciones {
              
        PersonaID: number
      
        DireccionID: number

    }
    export interface IPersonasDoc {
              
        PersonasDocID: number
      
        PersonaID: number
      
        TiposDocumentoID: number
      
        RutaDoc?: string
      
        Fecha: string
      
        Activo: boolean
      
        NomDoc?: string
      
        PersonaIDRegistro: number
      
        UsuarioIDRegistro: number

    }
    export interface IPersonasDocumentos_VW {
              
        id: number
      
        NombreDocumento: string
      
        ruta: string
      
        status: string
      
        PersonaID: number
      
        NombreCompleto: string
      
        clave: string

    }
    export interface IPersonasProducto_VW {
              
        PersonaID: number
      
        CURP: string
      
        RFC: string
      
        NombreCompleto: string
      
        DistribuidorID?: number
      
        ClienteID?: number
      
        CoordinadorID?: number
      
        DistribuidoresEstatusID?: string
      
        DistribuidoresEstatus?: string
      
        EmpresaID?: number

    }
    export interface IReporteConsultaBuro_VW {
              
        ConsultaBuroID: number
      
        DistribuidorID?: number
      
        PersonaID: number
      
        NombreCompleto: string
      
        Validado: number
      
        UsuarioIDValida: number
      
        PersonaIDValida: number
      
        NombreUsuarioValida: string
      
        FechaValida: string
      
        Consolidado: number
      
        UsuarioIDConsolida?: number
      
        PersonaIDConsolida?: number
      
        NombreUsuarioConsolida?: string
      
        FHConsolida?: string
      
        fechaCreacion: string
      
        UsuariIDRegistra: number
      
        PersonaIDRegistra: number
      
        NombreUsuarioRegistra: string
      
        EstatusBuroCredito?: string
      
        SucursalNombre: string

    }
    export interface IReporteMesaC_VW {
              
        SucursalID: number
      
        Sucursal_Nombre: string
      
        ZonaID: number
      
        ZonaNombre: string
      
        EmpresaId?: number
      
        empresaNombre: string
      
        DistribuidoresEstatusID?: string
      
        DistribuidorID: number
      
        PersonaNombre?: string
      
        LineaCredito: number
      
        NombreUsuarioConsolida?: string
      
        FHConsolida?: string
      
        NombreUsuarioValida?: string
      
        FechaValida?: string
      
        FechaHoraRegistro: string
      
        DistribuidorNivel: string
      
        EstatusBuroCredito: string
      
        Coordinador: string
      
        Promotor?: string

    }
    export interface ISucursalDistribuidores_VW {
              
        ProductoID: number
      
        SucursalID: number
      
        EmpresaId: number
      
        Nombre: string
      
        ZonaID: number
      
        DistribuidorID: number

    }
    export interface ISucursales {
              
        SucursalID: number
      
        Nombre: string
      
        distribuidorIdMin: number
      
        distribuidorIdMax: number
      
        importeLimiteCreditoDefault: number
      
        tabuladorTipoID: number
      
        ZonaID: number
      
        SucursalFisicaID: number
      
        DiasDeEntregaAprox?: number
      
        PersonaResponsableID?: number
      
        CreacionFecha?: string
      
        PermisoRangoFechas?: boolean
      
        ConvenioID?: number
      
        id_sucursal?: number
      
        id_origen?: string
      
        id_empresa?: number
      
        sistema?: string
      
        CostoPagoCanalesdePago ?: number
      
        IDEXterno?: number
      
        Eslogan?: string

    }
    export interface ISucursales_VW {
              
        SucursalID: number
      
        Nombre: string
      
        distribuidorIdMin: number
      
        distribuidorIdMax: number
      
        importeLimiteCreditoDefault: number
      
        tabuladorTipoID: number
      
        ZonaID: number
      
        ZonaNombre: string
      
        SucursalFisica: string
      
        SucursalFisicaID: number
      
        SucursalIDVR?: number
      
        tabuladorTipoDesc: string
      
        PersonaResponsableID: number
      
        NombreCompleto: string
      
        ConvenioID?: number
      
        id_sucursal?: number
      
        id_origen?: string
      
        id_empresa?: number
      
        sistema?: string
      
        Eslogan?: string

    }
    export interface ISucursalesFisicas {
              
        SucursalFisicaID: number
      
        Nombre: string
      
        DireccionID: number
      
        Telefono?: string

    }
    export interface ISucursalesFisicas_VW {
              
        SucursalFisicaID: number
      
        Nombre: string
      
        DireccionID: number
      
        AsentamientoID?: number
      
        NombreVialidad: string
      
        Asentamiento?: string
      
        NumeroInterior?: string
      
        NumeroExterior: string
      
        Estado?: string
      
        Municipio?: string
      
        Ciudad?: string
      
        CodigoPostal?: number
      
        vialidadTipoId: number
      
        vialidadTipo: string
      
        orientacionVialidadTipoId?: number
      
        orientacionVialidadTipo: string
      
        oficina_postal?: string
      
        zona?: string
      
        ViviendaTipoId?: number
      
        ViviendaTipo?: string
      
        Telefono?: string
      
        ReferenciasGeograficas?: string

    }
    export interface ISucursalesOrigen_VW {
              
        id_empresa: number
      
        id_sucursal: number
      
        id_origen: string
      
        sw_CV?: boolean
      
        sistema: string
      
        sw_estatus?: boolean
      
        SucursalOrigenID?: number

    }
    export interface ISucursalesProductos_VW {
              
        SucursalID: number
      
        Nombre: string
      
        distribuidorIdMin: number
      
        distribuidorIdMax: number
      
        importeLimiteCreditoDefault: number
      
        tabuladorTipoID: number
      
        ZonaID: number
      
        SucursalFisicaID: number
      
        DiasDeEntregaAprox?: number
      
        ProductoID: number
      
        Activo?: boolean
      
        ContratoCIE?: string

    }
    export interface ISucursalProductos {
              
        SucursalID: number
      
        ProductoID: number
      
        Activo?: boolean
      
        ContratoCIE?: string

    }
    export interface ISucursalProductos_VW {
              
        ProductoID: number
      
        Producto: string
      
        SucursalID: number
      
        ContratoCIE?: string

    }
    export interface ITipoCodigoSMS {
              
        TipoID: number
      
        Clave: string
      
        Descripcion: string

    }
    export interface ITiposEmpresas {
              
        TipoEmpresaID: number
      
        TipoEmpresa: string
      
        FechaRegistro: string
      
        PersonaRegistraID: number
      
        UsuarioRegistraID: number
      
        FechaModifica?: string
      
        PersonaModificaID?: number
      
        UsuarioModificaID?: number
      
        Color1?: string
      
        Color2?: string
      
        Color3?: string
      
        Color4?: string

    }
    export interface Ivw_getRANDValue {
              
        Value?: number

    }
    export interface IZonales {
              
        UsuarioID?: number
      
        ZonaID?: number
      
        ProductoID?: number

    }
    export interface IZonas {
              
        ZonaID: number
      
        Nombre: string
      
        Activa: boolean
      
        CreacionFecha: string
      
        CreacionUsuarioID: number
      
        PersonaResponsableID?: number

    }
    export interface IZonas_VW {
              
        ZonaID: number
      
        Nombre: string
      
        PersonaResponsableID: number
      
        NombreCompleto: string
      
        Activa: boolean

    }
}