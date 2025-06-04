export namespace DBConfia_Cobranza {
        
    export interface IAbonos_x_Corte {
              
        id: number
      
        abonoId: number
      
        corteId: number

    }
    export interface IAbonosGestores_VW {
              
        FechaCorte?: string
      
        DistribuidorID?: number
      
        UltRelacionImporte?: number
      
        Fecha?: string

    }
    export interface IAbonosGestoresDetalleSocias {
              
        GestorID?: number
      
        DistribuidorID: number
      
        TicketID?: number
      
        Total?: number
      
        Fecha: string
      
        Activo?: boolean

    }
    export interface IAbonosGestoresSocias {
              
        GestorID?: number
      
        DistribuidorID: number
      
        TicketID?: number
      
        Abono?: number
      
        TotalRelacion?: number
      
        PendienteRelacion?: number
      
        Fecha: string
      
        FechaCancela?: string
      
        FechaCorte?: string
      
        Activo?: boolean

    }
    export interface IActivosArticulos {
              
        ActivoArticulo: number
      
        Clave: string
      
        Descripcion: string
      
        Activo?: boolean

    }
    export interface IAnalistaCobranza {
              
        AnalistaCobranzaID?: number
      
        MesaCobranzaID?: number
      
        Activo?: number
      
        AccesoAppCobranza?: number

    }
    export interface IAsignacionCobranza {
              
        UsuarioIDRegistro?: number
      
        PersonaIDRegistro?: number
      
        DistribuidorID: number
      
        DiasAtraso: number
      
        MesaCobranzaID?: number
      
        limInferiorDias?: number
      
        limSuperiorDias?: number
      
        Capital?: number
      
        SaldoActual?: number
      
        MotivoID?: number
      
        ProductoID: number
      
        CobranzaID?: number
      
        FechaRegistro?: string

    }
    export interface IAsignaGestor {
              
        Id: number
      
        DistribuidorID: number
      
        AsignaGestorID: number
      
        EstatusValidacionID: number

    }
    export interface IAsignaGestorHistorial {
              
        AsignaGestorID: number
      
        FechaHoraAsignacion: string
      
        EncargadoPersonaAsignaID: number
      
        EncargadoUsuarioAsignaID: number
      
        PersonaGestorAsignadoID: number
      
        UsuarioGestorAsignadoID: number
      
        DistribuidorID: number
      
        DiasAtraso?: number
      
        MesaCobranzaID?: number

    }
    export interface IAvalesDistribuidorDatosGenerales_VR_VW {
              
        ProductoID?: number
      
        Referencia?: number
      
        NombreCompleto?: string
      
        FechaNacimiento?: string
      
        Sexo?: string
      
        CURP?: string
      
        EstadoCivil?: string
      
        TelefonoMovil?: string
      
        CorreoElectronico?: string
      
        LugarNacimiento?: string
      
        TelefonoDomicilio?: string
      
        RFC?: string
      
        DireccionID?: number
      
        NombreVialidad?: string
      
        CreacionFecha?: string
      
        NombreConyuge?: string

    }
    export interface IAvalesDistribuidorDatosGenerales_VW {
              
        NumeroFilas?: number
      
        DistribuidorID: number
      
        PersonaID: number
      
        NombreCompleto: string
      
        FechaNacimiento: string
      
        Sexo: string
      
        CURP: string
      
        EstadoCivil: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        LugarNacimiento: string
      
        TelefonoDomicilio?: string
      
        RFC: string
      
        DireccionID?: number
      
        NombreVialidad?: string
      
        CreacionFecha?: string
      
        NombreConyuge: string

    }
    export interface IBitacora {
              
        Id: number
      
        Usuario: number
      
        UsuarioPersona: number
      
        MesaCobranzaID?: number
      
        GestorId?: number
      
        EncargadoId?: number
      
        DistribuidorID?: number
      
        Clave?: string
      
        Fecha: string

    }
    export interface IBitacora_VW {
              
        Id: number
      
        UsuarioID: number
      
        UsuarioNombre: string
      
        PersonaLogueadaID: number
      
        PersonaLogueadaNombre: string
      
        GestorID?: number
      
        GestorNombre?: string
      
        EncargadoID?: number
      
        EncargadoNombre?: string
      
        DistribuidorID?: number
      
        DistribuidorNombre?: string
      
        MesaCobranzaID?: number
      
        MesaCobranzaNombre?: string
      
        Clave?: string
      
        Descripcion: string
      
        Fecha: string

    }
    export interface ICatalogoMesaProducto_VW {
              
        MesaCobranzaID: number
      
        Nombre: string
      
        Clave: string
      
        Activo: boolean
      
        ProductoID: number

    }
    export interface IClasificadores {
              
        ClasificadorID: number
      
        Clasificador?: string
      
        Activo?: boolean

    }
    export interface ICodigosCancelacion {
              
        UsuarioID: number
      
        PersonaID: number
      
        DistribuidorID: number
      
        TicketID: number
      
        Abono: number
      
        Fecha?: string
      
        FechaCaduca: string
      
        Codigo?: string
      
        SMSId?: number
      
        Activo: boolean

    }
    export interface IConvenioDetalle {
              
        ConvenioID: number
      
        NoPago: number
      
        FechaVencimiento: string
      
        Importe: number
      
        Saldo_Dep: number
      
        DiasAtraso?: number
      
        Saldo_Plazo?: number
      
        UsuarioID?: number
      
        FechaRegistro?: string
      
        UsuarioDeposito?: number
      
        FechaDeposito?: string

    }
    export interface IConvenios {
              
        ConvenioID: number
      
        ProductoID: number
      
        SucursalID: number
      
        DistribuidorID: number
      
        SaldoConveniado: number
      
        DiasAtraso?: number
      
        SaldoActual?: number
      
        Saldo_Deposito: number
      
        ImporteBonificar?: number
      
        PorcBon: number
      
        PagoIntencion?: number
      
        PorcPagInt: number
      
        ImporteConvenio?: number
      
        Plazos: number
      
        PlazosTotales: number
      
        EstatusId: number
      
        Activo: boolean
      
        Liquidado: boolean
      
        FechaUltimoPago?: string
      
        FechaVencimientoActual?: string
      
        UsuarioID: number
      
        FechaRegistro: string
      
        UsuarioPreAutoriza?: number
      
        FechaPreAutorizacion?: string
      
        UsuarioAutoriza?: number
      
        FechaAutorizacion?: string
      
        UsuarioCancela?: number
      
        FechaCancelacion?: string
      
        ConvenioIDAnterior?: number
      
        DocumentoConvenioID?: number

    }
    export interface IConvenios_VW {
              
        ConvenioID: number
      
        ProductoID: number
      
        SucursalID: number
      
        DistribuidorID: number
      
        SaldoConveniado: number
      
        SaldoActual?: number
      
        Saldo_Deposito: number
      
        ImporteBonificar?: number
      
        PorcBon: number
      
        PagoIntencion?: number
      
        PorcPagInt: number
      
        ImporteConvenio?: number
      
        Plazos: number
      
        PlazosTotales: number
      
        EstatusId: number
      
        Activo: boolean
      
        Liquidado: boolean
      
        FechaUltimoPago?: string
      
        FechaVencimientoActual?: string
      
        UsuarioID: number
      
        FechaRegistro: string
      
        UsuarioAutoriza?: number
      
        FechaAutorizacion?: string
      
        UsuarioCancela?: number
      
        FechaCancelacion?: string
      
        ConvenioIDAnterior?: number
      
        EstatusDesc?: string
      
        Color?: string
      
        Producto: string
      
        EmpresaId: number
      
        Sucursal: string
      
        Distribuidor: string
      
        NumeroDistribuidor?: number
      
        TelefonoMovil: string
      
        DocumentoConvenioID?: number

    }
    export interface IConveniosContratos {
              
        ConvenioID: number
      
        ContratoID: number
      
        ProductoID: number
      
        DistribuidorID: number
      
        SaldoConveniado: number
      
        DiasAtrasoAtrAlCorte: number
      
        PagosAtrAlCorte: number
      
        SaldoAtrAlCorte: number
      
        FechaHoraUltimoPago?: string
      
        SaldoActual?: number
      
        Saldo_Deposito?: number
      
        ImporteBonificar?: number
      
        PorcBon: number
      
        PagoIntencion?: number
      
        PorcPagInt?: number
      
        ImporteConvenio?: number
      
        Plazos: number
      
        PlazosTotales?: number
      
        Activo: boolean
      
        Liquidado: boolean
      
        UsuarioID: number
      
        FechaRegistro: string
      
        UsuarioCancela?: number
      
        FechaCancelacion?: string
      
        FechaUltimoPago?: string
      
        FechaVencimientoActual?: string
      
        PorcAbono?: number

    }
    export interface IConveniosEstatus {
              
        EstatusId: number
      
        EstatusDesc?: string
      
        Color?: string

    }
    export interface IConveniosTabulador {
              
        Id: number
      
        DiasAtrMin: number
      
        DiasAtrMax: number
      
        SaldoMin: number
      
        SaldoMax: number
      
        PorcQuita: number
      
        PlazosMin: number
      
        PlazosMax: number
      
        PorcPagInt?: number

    }
    export interface ICortes {
              
        corteId: number
      
        cobradorAsignado: string
      
        monto: number
      
        folioCorte: string
      
        creacionFecha?: string
      
        estatus: string

    }
    export interface IDatosGenerales_VW {
              
        NumeroFilas?: number
      
        PersonaID: number
      
        NombreCompleto: string
      
        FechaNacimiento: string
      
        Sexo: string
      
        CURP: string
      
        EstadoCivil: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        LugarNacimiento: string
      
        TelefonoDomicilio?: string
      
        RFC: string
      
        NombreVialidad?: string
      
        CreacionFecha?: string
      
        DireccionID?: number
      
        ReferenciasGeograficas?: string
      
        AsentamientoID?: number
      
        NumeroExterior?: string

    }
    export interface IDatosGeneralesUltimoRegistro_VW {
              
        FechaNacimiento: string
      
        Sexo: string
      
        CURP: string
      
        EstadoCivil: string
      
        TelefonoMovil: string
      
        CorreoElectronico?: string
      
        LugarNacimiento: string
      
        TelefonoDomicilio?: string
      
        RFC: string
      
        NombreVialidad?: string
      
        PersonaID: number
      
        NombreCompleto: string
      
        CreacionFecha?: string
      
        DireccionID?: number
      
        ReferenciasGeograficas?: string
      
        AsentamientoID?: number
      
        Municipio?: string
      
        Estado?: string
      
        Direccion: string

    }
    export interface IDatosReferencias_Dist_VR_VW {
              
        Producto?: string
      
        NombreCompleto?: string
      
        ProductoID?: number
      
        Referencia?: number
      
        CorresponsalID?: number
      
        Corresponsal?: string
      
        estatus?: boolean
      
        ReferenciaPago?: string
      
        Comision?: number
      
        Mecanica?: string

    }
    export interface IDatosReferencias_VR_VW {
              
        ProductoID?: number
      
        Referencia?: number
      
        CreditosDistribuidoresReferenciaID?: number
      
        Nombre?: string
      
        FechaHoraRegistro?: string
      
        referenciaTipoId?: number
      
        AniosDom?: number
      
        Tel?: string
      
        Cel?: string
      
        Domicilio?: string
      
        PersonaIDRegistro?: number
      
        UsuarioIDRegistro?: number
      
        Parentesco?: string
      
        Edad?: number

    }
    export interface IDirectoresMesaCobranza_VW {
              
        DirectorMesaCobranzaID: number
      
        PersonaID: number
      
        NombreCompleto: string
      
        Activo: boolean
      
        UsuarioID: number

    }
    export interface IDirectorMesaCobranza {
              
        DirectorMesaCobranzaID: number
      
        Activo: boolean

    }
    export interface IDistribuidoresDiasAtrasos_VW {
              
        DistribuidorID?: number
      
        DistribuidorDesc: string
      
        SucursalID?: number
      
        SucursalDesc?: string
      
        Sucursal?: string
      
        DiasAtraso: number
      
        ProductoID: number
      
        ProductoIDGrupo?: number
      
        GestorId: number
      
        GestorDesc?: string
      
        ColorAsignaGestor: string
      
        ColorReferencias: string
      
        ColorReferenciasAvales: string
      
        ColorAsignaCobranza: string
      
        Grupo: string
      
        ClasificadorGrupoID?: number
      
        TipoCobranzaID: number
      
        TipoCobranzaDescCorto?: string
      
        TipoCobranzaDescLargo?: string
      
        Capital: number
      
        SaldoActual?: number
      
        AsignGestorMesaCobranzaID: number
      
        AsignGestorMesaCobranzaDesc?: string
      
        MesaCobranzaID: number
      
        MesaCobranzaDesc?: string
      
        MotivoID: number
      
        Motivo?: string
      
        idRelMesaCredProd?: number
      
        FechaHoraAsignacion?: string

    }
    export interface IDistribuidoresTicket {
              
        TicketID: number
      
        Usuario_Logueado?: number
      
        persona_Logueada?: number
      
        DistribuidorID: number
      
        Monto: number
      
        Ruta?: string
      
        FechaRegistro: string
      
        Activo?: boolean
      
        GestorID?: number
      
        OrigenVR?: boolean
      
        Aplicado?: boolean
      
        SaldoAntes?: number
      
        SaldoDespues?: number
      
        ProductoID?: number
      
        Mercancia?: boolean
      
        TipoActivo?: number
      
        ObservacionesActivo?: string
      
        SistemaVR?: number
      
        DescSistemaVR?: string

    }
    export interface IDistribuidoresTicket_VW {
              
        TicketID: number
      
        Monto: number
      
        DistribuidorID: number
      
        Mercancia?: boolean
      
        TipoActivo?: number
      
        NombreDistribuidor?: string
      
        GestorID?: number
      
        NombreGestor?: string
      
        Activo?: boolean
      
        ProductoID?: number
      
        Ruta?: string
      
        FechaRegistro: string
      
        SaldoAntes?: number

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
    export interface IEncargadosMesasCobranza_VW {
              
        Encargado: number
      
        GestorCobranzaID: number
      
        PersonaID?: number
      
        NombreCompleto?: string
      
        Activo: boolean
      
        UsuarioID: number
      
        MesaCobranzaID: number
      
        mesaCobranza: string
      
        ProductoID?: number
      
        ProductoIDGrupo?: number
      
        DistribuidoresTotal?: number

    }
    export interface IEventos {
              
        EventoID: number
      
        ClaveEvento: string
      
        DescripcionEvento: string
      
        UsuarioID: number

    }
    export interface IFoliosCancelacion {
              
        id: number
      
        porCobrarId: number
      
        folioCancelacion: string
      
        usuarioGeneroFolio: string
      
        usuarioUtilizoFolio?: string
      
        utilizado?: boolean
      
        creacionFecha: string

    }
    export interface IGestorCobranza {
              
        GestorCobranzaID: number
      
        MesaCobranzaID: number
      
        Activo: boolean
      
        AccesoAppCobranza: boolean
      
        Externo?: boolean

    }
    export interface IGestoresCobranza_VW {
              
        GestorCobranzaID: number
      
        PersonaID?: number
      
        NombreCompleto?: string
      
        Activo: boolean
      
        UsuarioID: number
      
        MesaCobranzaID: number
      
        mesaCobranza: string
      
        limInferiorDias?: number
      
        limSuperiorDias?: number
      
        Externo?: boolean
      
        ExternoDesc: string

    }
    export interface IHistorialAsignacionCobranza {
              
        UsuarioIDRegistro?: number
      
        PersonaIDRegistro?: number
      
        DistribuidorID: number
      
        DiasAtraso: number
      
        MesaCobranzaID?: number
      
        limInferiorDias?: number
      
        limSuperiorDias?: number
      
        Capital?: number
      
        SaldoActual?: number
      
        MotivoID?: number
      
        ProductoID: number
      
        CobranzaID?: number
      
        FechaRegistro?: string

    }
    export interface IListaAsignarDistribuidor_VW {
              
        DistribuidorID?: number
      
        DistribuidorDesc: string
      
        Capital: number
      
        SaldoActual?: number
      
        DiasAtraso: number
      
        ProductoID: number
      
        MotivoID: number
      
        Clave?: string
      
        Motivo?: string
      
        TipoCobranza: string
      
        MesaCobranzaID: number

    }
    export interface IlogCambioDireccion {
              
        Id: number
      
        Usuario_Logueado?: number
      
        Persona_Logueada?: number
      
        DireccionID_Antigua?: number
      
        DireccionID_Nueva?: number
      
        Nota?: string
      
        Fecha_Registro?: string

    }
    export interface ILogEventos {
              
        LogEventoID: number
      
        EventoID: number
      
        FechaRegistro: string

    }
    export interface IMesaCobranza {
              
        MesaCobranzaID: number
      
        Nombre: string
      
        Clave: string
      
        Activo: boolean

    }
    export interface IMotivos {
              
        MotivoID: number
      
        Motivo: string
      
        Activo: boolean

    }
    export interface IMotivosAsignacion {
              
        MotivoID: number
      
        Descripcion?: string
      
        Clave: string

    }
    export interface IPerfilesApp {
              
        id: number
      
        cobradorAsignado: string
      
        perfil: string
      
        activo: boolean
      
        creacionFecha: string
      
        sucursalId: number
      
        nombreCompleto: string
      
        nivelJerarquicoApp: number
      
        numeroCelular: string
      
        sucursalesNivel: string

    }
    export interface IPersonasDoc_VW {
              
        PersonasDocID: number
      
        PersonaID: number
      
        TiposDocumentoID: number
      
        RutaDoc?: string
      
        Fecha: string
      
        Activo: boolean
      
        NomDoc?: string
      
        PersonaIDRegistro: number
      
        UsuarioIDRegistro: number
      
        Clave: string

    }
    export interface IPorCobrar {
              
        porCobrarId: number
      
        creditoId: number
      
        productoId: number
      
        sucursalId: number
      
        cobradorAsignado: string
      
        nombreCompleto: string
      
        celular?: string
      
        domicilio: string
      
        tipoCredito: string
      
        montoCobrar: number
      
        montoAbonado: number
      
        fechaUltimoPago: string
      
        estatus: string
      
        puedeRealizarQuita: boolean
      
        quitaPorcRangoMin: number
      
        quitaPorcRangoMax: number
      
        creacionFecha: string
      
        conciliado: boolean
      
        TipoSistema?: string

    }
    export interface IProcesos {
              
        ProcesoId: number
      
        Clave?: string
      
        Descripcion: string
      
        Activo?: boolean

    }
    export interface IReferencia_VR_VW {
              
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
    export interface IRelacionDirectorMesa {
              
        DirectorMesaCobranzaID: number
      
        MesaCobranzaID: number

    }
    export interface IRelacionDistribuidoresClientes_VW {
              
        DistribuidorID: number
      
        DistribuidorDesc: string
      
        ClienteID: number
      
        ClienteDesc: string
      
        FechaAsignacion: string
      
        TelefonoMovil: string
      
        Direccion: string
      
        ContratoID: number
      
        CreditoID: number
      
        DiasAtraso?: number
      
        SaldoActual?: number
      
        SaldoAtrasado: number
      
        ProductoID: number
      
        EstatusID: string

    }
    export interface IRelacionEncargadoMesa_VW {
              
        DirectorMesaCobranzaID: number
      
        NombreCompleto: string
      
        MesaCobranzaID?: number
      
        MesaCobranzaDesc?: string

    }
    export interface IRelacionGestoresDistribuidores_VR_VW {
              
        GestorID: number
      
        GestorDesc: string
      
        DistribuidorID?: number
      
        DistribuidorDesc?: string
      
        SucursalID: number
      
        SucursaDesc: string
      
        Grupo: string
      
        ClasificadorGrupoID: string
      
        FechaAsignacion?: string
      
        DiasAtrasoAsignado?: number
      
        DiasAtraso?: number
      
        Producto: string
      
        ProductoID: number
      
        ProductoIDGrupo: string
      
        TelefonoMovil?: string
      
        SaldoAtrasado?: number
      
        Activo?: string
      
        ColorTicket: string
      
        ColorReferencias: string
      
        ColorReferenciasAvales: string
      
        ContratoID: number
      
        ConvenioID: number
      
        SaldoActual: number
      
        EstatusId: number
      
        EstatusDesc?: string
      
        ColorEstConv?: string
      
        SistemaId?: number
      
        SistemaDsc?: string
      
        FhUltimoPago?: string

    }
    export interface IRelacionGestoresDistribuidores_VW {
              
        GestorID: number
      
        GestorDesc: string
      
        DistribuidorID: number
      
        DistribuidorDesc: string
      
        SucursalID: number
      
        SucursaDesc: string
      
        Grupo: string
      
        ClasificadorGrupoID?: number
      
        FechaAsignacion: string
      
        DiasAtrasoAsignado?: number
      
        DiasAtraso: number
      
        Producto?: string
      
        ProductoID: number
      
        ProductoIDGrupo?: number
      
        TelefonoMovil: string
      
        SaldoAtrasado: number
      
        Activo: boolean
      
        ColorTicket: string
      
        ColorReferencias: string
      
        ColorReferenciasAvales: string
      
        ContratoID: number
      
        ConvenioID?: number
      
        SaldoActual?: number
      
        EstatusId?: number
      
        EstatusDesc?: string
      
        ColorEstConv?: string
      
        EmpresaId: number
      
        empresaNombre: string

    }
    export interface IRelacionGestoresDistribuidoresAgrupado_VR_VW {
              
        GestorID: number
      
        GestorDesc: string
      
        TelefonoMovil: string
      
        ProductoID: number
      
        Producto?: string
      
        DistribuidorID?: number
      
        empresaId: number
      
        empresaNombre: string
      
        SucursalID: number
      
        SucursaDesc: string
      
        SaldoAtrasado?: number
      
        DistribuidorDesc?: string
      
        DiasAtraso?: number
      
        FhUltimoPago?: string
      
        SistemaId?: number
      
        SistemaDsc?: string

    }
    export interface IRelacionGestoresDistribuidoresAgrupado_VW {
              
        GestorID: number
      
        GestorDesc: string
      
        TelefonoMovil: string
      
        DistribuidorID: number
      
        empresaId: number
      
        empresaNombre: string
      
        SucursalID: number
      
        SucursaDesc: string
      
        SaldoAtrasado?: number
      
        DistribuidorDesc: string
      
        DiasAtraso?: number

    }
    export interface IRelacionMesaProducto {
              
        idRelMesaCredProd: number
      
        ProductoID: number
      
        idTabMora: number
      
        MesaCobranzaID: number
      
        Activo: boolean
      
        verifDom: boolean
      
        Monitoreo: boolean
      
        Cobranza: boolean
      
        Coordinador: boolean
      
        Legal: boolean

    }
    export interface IRelacionMesaProducto_VW {
              
        idRelMesaCredProd: number
      
        ProductoID: number
      
        Producto: string
      
        DirectorMesaCobranzaID: number
      
        NombreDirector?: string
      
        idTabMora: number
      
        MesaCobranzaID: number
      
        MesaCobranzaDesc: string
      
        Clave: string
      
        limInferiorDias: number
      
        limSuperiorDias: number
      
        Activo: boolean
      
        verifDom: boolean
      
        Monitoreo: boolean
      
        Cobranza: boolean
      
        Legal: boolean
      
        Coordinador: boolean

    }
    export interface ItabDiasMora {
              
        idTabMora: number
      
        ProductoID: number
      
        limInferiorDias: number
      
        limSuperiorDias: number
      
        diasMoraCartera?: number
      
        Activo: boolean

    }
    export interface ITicketsConciliacion {
              
        ticketID: number
      
        totalTickets: number
      
        conciliaTickets: number
      
        fechaConciliacion: string
      
        monto?: number

    }
    export interface ITicketsConciliacionDetalle {
              
        detalleID: number
      
        porCobrarId: number
      
        creditoId: number
      
        productoId: number
      
        sucursalId: number
      
        cobradorAsignado: string
      
        nombreCompleto: string
      
        celular?: string
      
        domicilio: string
      
        tipoCredito: string
      
        montoCobrar: number
      
        montoAbonado: number
      
        fechaUltimoPago: string
      
        estatus: string
      
        puedeRealizarQuita: boolean
      
        quitaPorcRangoMin: number
      
        quitaPorcRangoMax: number
      
        creacionFecha: string
      
        ticketID?: number

    }
    export interface ITipoCobranza {
              
        CobranzaID: number
      
        Nombre?: string
      
        NombreCorto?: string

    }
    export interface IVR_Paso_DatosDistGenerales {
              
        ProductoID?: number
      
        Referencia?: number
      
        NombreCompleto?: string
      
        FechaNacimiento?: string
      
        Sexo?: string
      
        CURP?: string
      
        EstadoCivil?: string
      
        TelefonoMovil?: string
      
        CorreoElectronico?: string
      
        LugarNacimiento?: string
      
        TelefonoDomicilio?: string
      
        RFC?: string
      
        DireccionID?: number
      
        NombreVialidad?: string
      
        CreacionFecha?: string
      
        NombreConyuge?: string

    }
    export interface IVR_Paso_DatosDistReferenciasPagos {
              
        ProductoID?: number
      
        Referencia?: number
      
        CorresponsalID?: number
      
        Corresponsal?: string
      
        estatus?: boolean
      
        ReferenciaPago?: string
      
        Comision?: number
      
        Mecanica?: string

    }
    export interface IVR_Paso_DatosGenerales {
              
        ProductoID?: number
      
        Referencia?: number
      
        NombreCompleto?: string
      
        FechaNacimiento?: string
      
        Sexo?: string
      
        CURP?: string
      
        EstadoCivil?: string
      
        TelefonoMovil?: string
      
        CorreoElectronico?: string
      
        LugarNacimiento?: string
      
        TelefonoDomicilio?: string
      
        RFC?: string
      
        DireccionID?: number
      
        NombreVialidad?: string
      
        CreacionFecha?: string
      
        NombreConyuge?: string

    }
    export interface IVR_Paso_DatosReferencias {
              
        ProductoID?: number
      
        Referencia?: number
      
        CreditosDistribuidoresReferenciaID?: number
      
        Nombre?: string
      
        FechaHoraRegistro?: string
      
        referenciaTipoId?: number
      
        AniosDom?: number
      
        Tel?: string
      
        Cel?: string
      
        Domicilio?: string
      
        PersonaIDRegistro?: number
      
        UsuarioIDRegistro?: number
      
        Parentesco?: string
      
        Edad?: number

    }
    export interface IVR_Paso_GlobalGestores {
              
        ProductoID?: number
      
        NombreProducto?: string
      
        Referencia?: number
      
        NombreCliente?: string
      
        SucursalCartera?: string
      
        ImporteT?: number
      
        SaldoAct?: number
      
        SaldoAtr?: number
      
        DiasAtr?: number
      
        Atrasos?: number
      
        VR_GestorID?: number
      
        NombreGestor?: string
      
        LineaCreditoTipoID?: number
      
        FhUltimoPago?: string
      
        FhAsignaGestor?: string
      
        EstatusCartera?: string
      
        CobradoPorGestor?: number
      
        Activo?: boolean
      
        FechaAlta?: string
      
        FechaBaja?: string
      
        Nocda?: number
      
        NombreTitularCredito?: string
      
        telCel?: string
      
        telCasa?: string
      
        direccion?: string
      
        CoordinacionNombre?: string
      
        SucursalCarteraAnt?: string
      
        CV_GestorID?: number
      
        CV_SucursalID?: number
      
        SistemaId?: number
      
        SistemaDsc?: string

    }
}