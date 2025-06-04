import { DBConfia_Indicadores } from '../../../../../../../interfaces_db/DBConfia/Indicadores'

// Tipo de calidad
type TCalidad = {
    Monto: number, Calidad: number, Saldo: number, CuentasConvenio: number, SaldoConvenio: number, CalidadConvenio: number
}

// Tipo del indicador
export type TIndicador = {
    CarteraPorConcepto:
    {
        Total: number
        Recuperado: number
        Pendiente: number
        PRecuperado: number
        PPendiente: number
        Cuentas: number
        Conceptos: {
            Etiqueta: string
            Monto: number
            Recuperado: number
            Pendiente: number
            PRecuperado: number
            Peso: number
            Cuentas: number
        }[]
    },
    ResumenCartera:
    {
        Pendiente: number
        C090: TCalidad
        C115: TCalidad
        C145: TCalidad
        C4690: TCalidad
        C91: TCalidad
        Productos: {
            Producto: string
            C090: TCalidad
            C115: TCalidad
            C145: TCalidad
            C4690: TCalidad
            C91: TCalidad
        }[]
    },
    Distribuidoras: TDistribuidoraIndicador[]
}

type TDistribuidoraIndicador = DBConfia_Indicadores.IHistoricos_Socias_DetalleGroup_VW & { Orden: number }