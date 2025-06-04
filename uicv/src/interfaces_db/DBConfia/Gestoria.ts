export namespace DBConfia_Gestoria {
        
    export interface IGestores {
              
        GestorID: number
      
        SucursalID: number
      
        GrupoID?: number
      
        CarteraVencida: boolean
      
        ImprimirRelacionesMasivas: boolean
      
        EstadoGestorId: string
      
        CreacionFecha: string
      
        CreacionPersonaId?: number
      
        ModificacionFecha?: string
      
        ModificacionPersonaId?: number
      
        CreacionUsuarioId?: number
      
        ModificacionUsuarioId?: number

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
    export interface IGestorUsuarios {
              
        UsuarioID: number
      
        GestorID: number
      
        Estatus: boolean
      
        UsuarioCreoID: number
      
        FechaCreacion: string
      
        UsuarioModificoID?: number
      
        FechaModificacion?: string

    }
    export interface IGlobalGestor_VW {
              
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
      
        CortesAtrasados?: number
      
        CapitalLiq?: number
      
        PagadoCorte?: number

    }
    export interface IGruposGestorDetalle {
              
        GrupoID: number
      
        DistribuidorID: number
      
        Estatus: boolean
      
        UsuarioCreoID: number
      
        FechaCreacion: string
      
        UsuarioModificoID?: number
      
        FechaModificacion?: string
      
        Reasignar?: boolean

    }
    export interface IGruposGestorDetalle_VW {
              
        GrupoID: number
      
        DistribuidorID: number
      
        Estatus: boolean
      
        UsuarioCreoID: number
      
        FechaCreacion: string
      
        UsuarioModificoID?: number
      
        FechaModificacion?: string
      
        NombreCompleto: string
      
        GestorID: number
      
        ClasificadorGrupoID: number
      
        SucursalID: number
      
        Coordinador: string
      
        Sucursal: string
      
        ProductoID: number
      
        Reasignar?: boolean

    }
    export interface IGruposGestores {
              
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
    export interface IGruposGestorUsuarios {
              
        GrupoID: number
      
        UsuarioID: number
      
        Estatus: boolean
      
        UsuarioCreoID: number
      
        FechaCreacion: string
      
        UsuarioModificoID?: number
      
        FechaModificacion?: string

    }
    export interface IGruposGestorUsuarios_VW {
              
        GrupoID: number
      
        UsuarioID: number
      
        Estatus: boolean
      
        ProductoID: number
      
        GestorID: number
      
        EsttGrupo: boolean
      
        Descripcion: string
      
        Producto: string
      
        Sucursal: string
      
        NombreCompleto: string
      
        ClasificadorGrupoID: number
      
        SucursalID: number

    }
}