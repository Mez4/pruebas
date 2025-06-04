import { DBConfia_Indicadores } from "../../../../../../../interfaces_db/DBConfia/Indicadores"

// Tipo de calidad
type TCalidad = {
    Monto: number, Calidad: number, Saldo: number, CuentasConvenio: number, SaldoConvenio: number, CalidadConvenio: number
}

type TDetalleCoordinador = {
    CoordinadorID: number
    CoordinadorNombre: string

    // Detalle del Coordinador
    Total: number
    Recuperacion: number
    PRecuperacion: number
    Pendientes: number
    Pendiente: number

    // Pago anticipado
    Anticipado__Total: number
    Anticipado__Recuperacion: number
    Anticipado__PRecuperacion: number
    Anticipado__Pendientes: number
    Anticipado__Pendiente: number

    // Pago puntual
    Puntual__Total: number
    Puntual__Recuperacion: number
    Puntual__PRecuperacion: number
    Puntual__Pendientes: number
    Puntual__Pendiente: number

    // Pago acumulado
    Acumulado__Total: number
    Acumulado__Recuperacion: number
    Acumulado__PRecuperacion: number
    Acumulado__Pendientes: number
    Acumulado__Pendiente: number

    // Impuntual acumulado
    Impuntual__Total: number
    Impuntual__Recuperacion: number
    Impuntual__PRecuperacion: number
    Impuntual__Pendientes: number
    Impuntual__Pendiente: number

    // Tardio acumulado
    Tardio__Total: number
    Tardio__Recuperacion: number
    Tardio__PRecuperacion: number
    Tardio__Pendientes: number
    Tardio__Pendiente: number
}

type TDistribuidoraIndicador = DBConfia_Indicadores.IHistoricos_Socias_DetalleGroup_VW & { Orden: number }

type TIndicador = {
    TotalesCoordinadores: TDetalleCoordinador,
    Coordinadores: [TDetalleCoordinador],
    Distribuidoras: TDistribuidoraIndicador[],
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
}

export default TIndicador