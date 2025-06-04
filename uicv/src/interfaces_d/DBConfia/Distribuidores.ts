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
    export interface IClientes {
              
        ProductoID?: number
      
        DistribuidorID: number
      
        PersonaID: number
      
        EsttausId?: boolean
      
        AsignacionFecha?: string
      
        bloqueado?: boolean
      
        CreditosActivos?: number
      
        CreditosTotales?: number

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
      
        DistribuidorNivelID?: number
      
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
      
        DistribuidorNivelID?: number
      
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
      
        DistribuidorNivelID?: number
      
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
    export interface ITabuladoresTipos {
              
        tabuladorTipoId: number
      
        tabuladorTipoDesc: string

    }
    export interface ITipoPago {
              
        TipoPagoID?: string
      
        TipoPagoDesc?: string
      
        Orden?: number

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
}