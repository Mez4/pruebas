export namespace DBConfia_BuroCredito {
        
    export interface IConsulta {
              
        id: number
      
        idDatosPersonales: number
      
        rutaConsulta: string
      
        rutaRespuesta: string
      
        error: string
      
        DeclaracionConsumidor: string
      
        comentario: string

    }
    export interface IConsultasEfectuada {
              
        id: number
      
        idConsulta: number
      
        FechaConsulta: number
      
        IdentificacionBuro: number
      
        ClaveOtorgante: string
      
        NombreOtorgante: string
      
        TelefonoOtorgante: number
      
        TipoContrato: string
      
        ClaveUnidadMonetaria: string
      
        ImporteContrato: number
      
        IndicadorTipoResponsabilidad: string
      
        ConsumidorNuevo: string
      
        ResultadoFinal: string
      
        IdentificadorOrigenConsulta: string

    }
    export interface ICuentas {
              
        id: number
      
        idConsulta: number
      
        SaldoVencido: number
      
        SaldoActual: string
      
        IdentificadorCAN: string
      
        NumeroCuentaActual: number
      
        NumeroPagosVencidos: number
      
        ModoReportar: string
      
        TipoCuenta: string
      
        ClaveUnidadMonetaria: string
      
        HistoricoPagos: string
      
        CreditoMaximo: number
      
        FechaUltimaCompra: string
      
        FormaPagoActual: string
      
        FechaUltimoPago: string
      
        Garantia: string
      
        FechaActualizacion: number
      
        ValorActivoValuacion: number
      
        FechaCierreCuenta: number
      
        FechaReporte: string
      
        ClaveObservacion: string
      
        NumeroPagos: number
      
        UltimaFechaSaldoCero: number
      
        RegistroImpugnado: number
      
        FechaAperturaCuenta: string
      
        HistoricoCAN: string
      
        FechaMasAntiguaHistoricoCAN: string
      
        IndicadorTipoResponsabilidad: string
      
        FechaCancelacionCAN: string
      
        TipoContrato: string
      
        FechaMasRecienteHistoricoCAN: string
      
        NombreOtorgante: string
      
        LimiteCredito: number
      
        FechaAperturaCAN: string
      
        IdentificadorCredito: string
      
        ClaveOtorgante: string
      
        MontoPagar: number
      
        FechaMasRecienteHistoricoPagos: number
      
        MopHistoricoMorosidadMasGrave: string
      
        FechaHistoricaMorosidadMasGrave: number
      
        ImporteSaldoMorosidadHistMasGrave: number
      
        FechaMasAntiguaHistoricoPagos: number
      
        TotalPagosCalificadosMOP3: number
      
        TotalPagosCalificadosMOP4: number
      
        FechaInicioReestructura: number
      
        TotalPagosCalificadosMOP5: number
      
        TotalPagosCalificadosMOP2: number
      
        NumeroTelefonoOtorgante: number
      
        TotalPagosReportados: number
      
        IdentificadorSociedadInformacionCrediticia: number
      
        MontoUltimoPago: number
      
        FrecuenciaPagos: string

    }
    export interface IDatosPersonales {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        rfc: string
      
        fechaNacimiento: string
      
        apellidoMaterno: string
      
        apellidoPaterno: string
      
        primerNombre: string
      
        segundoNombre: string
      
        nacionalidad: string
      
        sexo: string
      
        residencia: string

    }
    export interface IErrorAR {
              
        id: number
      
        idConsulta: number
      
        ReferenciaOperador: string
      
        SujetoNoAutenticado: string
      
        ClaveOPasswordErroneo: string
      
        ErrorSistemaBC: string
      
        EtiquetaSegmentoErronea: string
      
        FaltaCampoRequerido: string
      
        ErrorReporteBloqueado: string

    }
    export interface IErrorUR {
              
        id: number
      
        idConsulta: number
      
        NumeroReferenciaOperador: string
      
        SolicitudClienteErronea: string
      
        VersionProporcionadaErronea: string
      
        ProductoSolicitadoErroneo: string
      
        PasswordOClaveErronea: string
      
        SegmentoRequeridoNoProporcionado: string
      
        UltimaInformacionValidaCliente: string
      
        InformacionErroneaParaConsulta: string
      
        ValorErroneoCampoRelacionado: string
      
        ErrorSistemaBuroCredito: string
      
        EtiquetaSegmentoErronea: string
      
        OrdenErroneoSegmento: string
      
        NumeroErroneoSegmentos: string
      
        FaltaCampoRequerido: string
      
        ErrorReporteBloqueado: string

    }
    export interface IHawkAlert {
              
        id: number
      
        idConsulta: number
      
        tipoHawAlert: string
      
        FechaReporte: string
      
        CodigoClave: string
      
        TipoInstitucion: string
      
        Mensaje: string

    }
    export interface IResumenReporte {
              
        id: number
      
        idConsulta: number
      
        FechaIngresoBD: string
      
        NumeroMOP7: string
      
        NumeroMOP6: number
      
        NumeroMOP5: string
      
        NumeroMOP4: string
      
        NumeroMOP3: string
      
        NumeroMOP2: string
      
        NumeroMOP1: string
      
        NumeroMOP0: string
      
        NumeroMOPUR: string
      
        NumeroCuentas: string
      
        CuentasPagosFijosHipotecas: string
      
        CuentasRevolventesAbiertas: string
      
        CuentasCerradas: string
      
        CuentasNegativasActuales: string
      
        CuentasClavesHistoriaNegativa: string
      
        CuentasDisputa: string
      
        NumeroSolicitudesUltimos6Meses: string
      
        NuevaDireccionReportadaUltimos60Dias: string
      
        MensajesAlerta: string
      
        ExistenciaDeclaracionesConsumidor: string
      
        TipoMoneda: string
      
        TotalLimitesCreditoRevolventes: string
      
        TotalCreditosMaximosRevolventes: string
      
        TotalSaldosActualesRevolventes: string
      
        TotalSaldosVencidosRevolventes: string
      
        TotalPagosRevolventes: string
      
        PctLimiteCreditoUtilizadoRevolventes: string
      
        TotalCreditosMaximosPagosFijos: string
      
        TotalSaldosActualesPagosFijos: string
      
        TotalSaldosVencidosPagosFijos: string
      
        TotalPagosPagosFijos: string
      
        NumeroMOP96: string
      
        NumeroMOP97: string
      
        NumeroMOP99: string
      
        FechaAperturaCuentaMasAntigua: string
      
        FechaAperturaCuentaMasReciente: string
      
        TotalSolicitudesReporte: string
      
        FechaSolicitudReporteMasReciente: string
      
        NumeroTotalCuentasDespachoCobranza: string
      
        FechaAperturaCuentaMasRecienteDespachoCobranza: string
      
        FechaSolicitudMasRecienteDespachoCobranza: string
      
        NumeroTotalSolicitudesDespachosCobranza: string

    }
    export interface IScore {
              
        id: number
      
        idConsulta: number
      
        nombreScore: string
      
        CodigoScore: string
      
        ValorScore: string
      
        CodigoError: string

    }
    export interface IScoreCodigoRazon {
              
        id: number
      
        idScore: number
      
        codigoRazon: number

    }
}