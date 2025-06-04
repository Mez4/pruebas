export namespace DBConfia_Pagos {
        
    export interface ICodigosAutorizacion {
              
        CodigoAutorizacionID: number
      
        AutorizacionTipoID: number
      
        FHGeneracion: string
      
        Fecha: string
      
        CODIGO?: string
      
        Cancelado: boolean
      
        Utilizado: boolean
      
        FHUtilizacion?: string
      
        Referencia?: number
      
        Observaciones?: string
      
        UsuarioIDUtiliza?: number
      
        USUGenera: number

    }
    export interface ICodigosAutorizacion_VW {
              
        CodigoAutorizacionID: number
      
        FHGeneracion: string
      
        Fecha: string
      
        CODIGO?: string
      
        Cancelado: boolean
      
        Utilizado: boolean
      
        UsuarioIDUtiliza?: number
      
        FHUtilizacion?: string
      
        Referencia?: number
      
        Observaciones?: string
      
        USUGenera: number
      
        AutorizacionTipo: string
      
        AutorizacionTipoID: number
      
        Creo: string
      
        Utiliza: string

    }
    export interface ICodigosAutorizacionDetalle {
              
        CodigoAutorizacionID: number
      
        AutorizacionTipoID: number

    }
    export interface IreferenciaOxxo {
              
        solicitudRefID: number
      
        nombre: string
      
        referencia?: string
      
        telefono?: string
      
        email?: string
      
        corporate: boolean
      
        expires_at: string
      
        tipProducto: number
      
        referenciaProducto: number
      
        url_barcode?: string
      
        fhRegistro: string
      
        fhActualizacion: string
      
        parent_id?: string
      
        id_oxxo?: string
      
        estatusID: string
      
        intentos: number

    }
    export interface IrpmmxSTPCredenciales {
              
        id_prestador?: string
      
        Prestador?: string
      
        usuario?: string
      
        contrasena?: string

    }
    export interface IrpmmxSTPResponse {
              
        rmpmxSTPresponseId: number
      
        reference: string
      
        barCode?: string
      
        payFormat?: string
      
        message?: string
      
        error?: string
      
        folio?: number
      
        dateResponse: string
      
        clabeInterbancaria?: string
      
        account?: string
      
        fhRegistro: string
      
        usuario: string
      
        empresa: string
      
        expirationDate: string

    }
    export interface IVW_rpmmxSTPResponse {
              
        rmpmxSTPresponseId: number
      
        reference: string
      
        barCode?: string
      
        payFormat?: string
      
        message?: string
      
        error?: string
      
        folio?: number
      
        dateResponse: string
      
        clabeInterbancaria?: string
      
        account?: string
      
        fhRegistro: string
      
        usuario: string
      
        empresa: string
      
        expirationDate: string
      
        refapl?: number

    }
    export interface IVW_rpmmxSTPResponse_UltReg {
              
        reference: string
      
        fhRegistro?: string

    }
}