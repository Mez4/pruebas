export namespace DBConfia_MesaCredito {
        
    export interface IAvales {
              
        id: number
      
        idProspecto: number
      
        nombre: string
      
        primerApellido: string
      
        rfc: string
      
        segundoApellido: string
      
        fechaNacimiento: string
      
        idSexo: string
      
        curp: string
      
        correo: string
      
        telefono: string
      
        celular: string
      
        idEstadoCivil: number
      
        dependientesEconomicos: string
      
        nombreConyuge: string
      
        parentesco: string
      
        status?: string

    }
    export interface ICarpeta {
              
        id: number
      
        carpeta: string
      
        productoId: number
      
        estatusCreditoId: number
      
        solicitudCreditoId: number
      
        fechaAlta: string
      
        fechaMod: string
      
        fechaBaja: string
      
        usuarioID: number
      
        activo: boolean

    }
    export interface IDictamen {
              
        id: number
      
        SucursalID?: number
      
        AnalistaID?: number
      
        SolicitudCreditoID?: number
      
        MontoCredito?: number
      
        ClasificacionCredito?: string
      
        FechaSolicitud?: string
      
        FechaDictamen?: string
      
        Estatus?: boolean

    }
    export interface IDirectorMesa {
              
        DirectorMesaID: number
      
        MesaCreditoID: number
      
        PersonaID: number
      
        UsuarioID: number

    }
    export interface IDocumentos {
              
        id: number
      
        documentoTipoId: number
      
        carpetaId: number
      
        url: string
      
        fechaAlta: string
      
        fechaMod: string
      
        fechaBaja: string
      
        usuarioID: number
      
        activo: boolean

    }
    export interface IDomicilio {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        calle: string
      
        numeroInterior: string
      
        numeroExterior: string
      
        colonia: string
      
        localidad: string
      
        cp: string
      
        municipio: string
      
        estado: string

    }
    export interface IEgresos {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        egresos: number
      
        alimentacion: number
      
        tarjetaCreido: number
      
        rentaPagoVivienda: number
      
        serviciosDomesticos: number
      
        otros: number
      
        egresoTotal: number

    }
    export interface IEstadoBuro {
              
        id: number
      
        idEstado: number
      
        abreviaturaBuro: string

    }
    export interface IEstatusAsignacion {
              
        ID: number
      
        Nombre: string
      
        UsuarioRegistraID: number
      
        FechaHoraRegistro: string

    }
    export interface IEstatusCredito {
              
        id: number
      
        estatusCredito: string

    }
    export interface IEstatusValidacion {
              
        ID: number
      
        Nombre: string
      
        UsuarioRegistraID: number
      
        FechaHoraRegistro: string

    }
    export interface IExperienciaVentas {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        nombreEmpresa: string
      
        fechaIngreso: string
      
        limiteCredito: number
      
        creditoDisponible: number
      
        status: string

    }
    export interface IGrupos {
              
        GrupoID: number
      
        NombreGrupo: string
      
        Ciclos: number
      
        CoordinadorID: number
      
        SucursalID: number
      
        ContratoValidado: boolean
      
        FhContratoValidado: string
      
        UsuarioIdContratoValidado: number

    }
    export interface IInformacionLaboral {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        tipoPersona: string
      
        empresa: string
      
        puesto: string
      
        sueldo: number
      
        antiguedad: string
      
        telefono: string
      
        calle: string
      
        numeroInterior: string
      
        numeroExterior: string
      
        idAsentamiento: number
      
        localidad: string
      
        cp: string

    }
    export interface IInformacionOtraVivienda {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        idTipoVivienda: number
      
        idAsentamiento: number
      
        calle: string
      
        numero: string
      
        localidad: string
      
        direccion: string
      
        valorAproximado: number

    }
    export interface IInformacionVivienda {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        idTipoVivienda: number
      
        tieneOtraVivienda: string
      
        numeroPersonasHabitan: string
      
        valorAproximado: number

    }
    export interface IIngresos {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        ingresoSueldo: number
      
        gananciasDV: number
      
        ingresoConyuge: number
      
        otrosIngresos: number
      
        ingresoTotal: number

    }
    export interface ILogMensajes {
              
        MensajeID: number
      
        mensaje: string
      
        EstatusMesaID: number
      
        fecha_hora: string
      
        ValidacionMesaID: number
      
        PersonaID: number
      
        UsuarioID: number

    }
    export interface ILogSolicitud {
              
        LogID: number
      
        FechaCreacion: string
      
        Nota: string
      
        SolicitudMesaCreditoID: number

    }
    export interface ILogTiempos {
              
        TiempoID: number
      
        AsignaAnalistaID: number
      
        Tiempo: string
      
        Motivo: string

    }
    export interface IMesasCreditos {
              
        MesaCreditoID: number
      
        Nombre: string
      
        Clave: string
      
        Activo: boolean

    }
    export interface IProductosCredMesa {
              
        ProdCredMesaID: number
      
        MesaCreditoID: number
      
        ProductoID: number
      
        Activo?: boolean

    }
    export interface IProspectos {
              
        id: number
      
        nombre: string
      
        segundoNombre: string
      
        primerApellido: string
      
        segundoApellido: string
      
        fechaNacimiento: string
      
        resultadoBuroCredito: string
      
        idPromotor: number
      
        idConsulta: number
      
        idSucursal: number
      
        comoSeEntero: string
      
        idSexo: string
      
        curp: string
      
        rfc: string
      
        correo: string
      
        telefono: string
      
        celular: string
      
        dependientesEconomicos: string
      
        nombreConyuge: string
      
        tieneAuto: string
      
        cantidadAuto: string
      
        marcaAuto: string
      
        modeloAuto: string
      
        status?: string
      
        fechaCreacion: string
      
        idEstadoCivil?: string

    }
    export interface IReferencias {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        numeroReferencia: number
      
        nombre: string
      
        primerApellido: string
      
        segundoApellido: string
      
        parentesco: string
      
        celular: string
      
        domicilio: string
      
        edad: string
      
        status?: string

    }
    export interface ISolicitudesCredito {
              
        ID: number
      
        PersonaID?: number
      
        ProductoID?: number
      
        SucursalID: number
      
        ProspectoID: number
      
        UsuarioRegistraID: number
      
        FechaHoraRegistro: string
      
        FechaHoraResolucion?: string
      
        EstatusValidacionID: number
      
        EstatusAsignacionID: number

    }
    export interface ISolicitudesCreditoHistorial {
              
        ID: number
      
        SolicitudCreditoID?: number
      
        EstatusValidacionID?: number
      
        ValidacionMesaID: number
      
        DocumentoID: number
      
        Comentarios?: string
      
        UsuarioRegistraID: number
      
        FechaHoraRegistro: string

    }
    export interface ISolicitudMesaCredito {
              
        SolicitudMesaCreditoID: number
      
        PersonaID?: number
      
        ProductoID?: number
      
        SucursalID: number
      
        FechaHoraRegistro: string
      
        FechaHoraResolucion?: string
      
        EstatusValidacionID: number
      
        GrupoID?: number
      
        CreditoID?: number
      
        PersonaRegistraID: number
      
        UsuarioRegistraID: number

    }
    export interface ITipoDocumento {
              
        id: number
      
        clave: string
      
        descripcion: string
      
        status: string

    }
    export interface ITipoPersona {
              
        id: number
      
        clave: string
      
        descripcion: string

    }
    export interface ITuberia {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        proceso: string
      
        resultado: string

    }
    export interface IUsuarioAnalistaMesa {
              
        UsuarioAnalistaMesaID: number
      
        MesaCreditoID: number
      
        Activo: boolean
      
        PersonaID?: number
      
        UsuarioID: number

    }
    export interface IUsuariosPermitidos {
              
        id: number
      
        idUsuario: number

    }
    export interface IValidacionMesa {
              
        ValidacionMesaID: number
      
        SolicitudMesaCreditoID: number
      
        AsignaAnalistaID: number
      
        enSucursal: boolean
      
        CatValidacionMesaID: number

    }
}