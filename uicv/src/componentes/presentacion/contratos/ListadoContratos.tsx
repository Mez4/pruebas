import React from 'react'

// Interfaces
import { IOidc } from '../../../interfaces/oidc/IOidc'
import { DBConfia_Creditos } from '../../../interfaces_db/DBConfia/Creditos'

// Componentes globales
import { Spinner } from '../../global'

// Iconos
import { FiRefreshCcw } from 'react-icons/fi'

// SubComponentes
import * as Funciones from './CompListadoContratos/Funciones'
import { FormateoDinero, FormateoNumero } from '../../../global/variables'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import moment from 'moment'

//** Columnas de la base de datos disponibles */
enum EColumnas {
    LineaCredito,
    LineaCreditoDisponible,
    SaldoActual,
    Capital,
    Interes,
    ManejoCuenta,
    Seguro,
    Cargo,
    IVA,
    Abonos,
    ImporteTotal,
    DiasAtraso,
    DiasAtrasoMaximo,
    SaldoAtrasado,
    CapitalPagado,
    NoCreditosActivos,
    PagosAtrasados,
    InteresPagado,
    IVAPagado,
    ManejoCuentaPagado,
    SeguroPagado,
    CargoPagado,
    FechaHoraUltimoPago,
    PagoPuntualUltmoPago,
    Reestructura,
    CapitalPendiente,
    InteresPendiente,
    IVAPendiente,
    ManejoCuentaPendiente,
    SeguroPendiente,
    CargoPendiente,
    Ciclo,
    convenioTipoNombre,
    convenioTipoActivo,
    DistribuidorID,
    DistribuidorNombre
}

/**
 * Función para generar las columnas a utilizar en la tabla (Facil manejo de orden y contenido)
 * @param {EColumna} Columna Columna a mostrar
 * @returns Instancia a mostrar en la tabla
*/
const GenerarColumna = (Columna: EColumnas): IDataTableColumn => {
    switch (Columna) {
        case EColumnas.LineaCredito:
            return ({ name: 'L.Crédito', selector: 'LineaCredito', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.LineaCredito)}</span> })
        case EColumnas.LineaCreditoDisponible:
            return ({ name: 'L.C.Disponible', selector: 'LineaCreditoDisponible', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.LineaCreditoDisponible)}</span> })
        case EColumnas.SaldoActual:
            return ({ name: 'Saldo Actual', selector: 'SaldoActual', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.SaldoActual)}</span> })
        case EColumnas.Capital:
            return ({ name: 'Capital', selector: 'Capital', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Capital)}</span> })
        case EColumnas.Interes:
            return ({ name: 'Capital', selector: 'Capital', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Interes)}</span> })
        case EColumnas.ManejoCuenta:
            return ({ name: 'Manejo Cuenta', selector: 'ManejoCuenta', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.ManejoCuenta)}</span> })
        case EColumnas.Seguro:
            return ({ name: 'Seguro', selector: 'Seguro', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Seguro)}</span> })
        case EColumnas.Cargo:
            return ({ name: 'Cargo', selector: 'Cargo', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Cargo)}</span> })
        case EColumnas.IVA:
            return ({ name: 'IVA', selector: 'IVA', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.IVA)}</span> })
        case EColumnas.Abonos:
            return ({ name: 'Abonos', selector: 'Abonos', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Abonos)}</span> })
        case EColumnas.ImporteTotal:
            return ({ name: 'Importe Total', selector: 'ImporteTotal', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.ImporteTotal)}</span> })
        case EColumnas.DiasAtraso:
            return ({ name: 'Dias Atraso', selector: 'DiasAtraso', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.DiasAtraso)}</span> })
        case EColumnas.DiasAtrasoMaximo:
            return ({ name: 'D.Atraso Maximo', selector: 'DiasAtrasoMaximo', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.DiasAtrasoMaximo)}</span> })
        case EColumnas.SaldoAtrasado:
            return ({ name: 'Saldo Atrasado', selector: 'SaldoAtrasado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.SaldoAtrasado)}</span> })
        case EColumnas.CapitalPagado:
            return ({ name: 'Capital Pagado', selector: 'CapitalPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.CapitalPagado)}</span> })
        case EColumnas.NoCreditosActivos:
            return ({ name: 'No Creditos Activos', selector: 'NoCreditosActivos', sortable: true, cell: (cprops) => <span>{FormateoNumero.format(cprops.NoCreditosActivos)}</span> })
        case EColumnas.PagosAtrasados:
            return ({ name: 'Pagos Atrasados', selector: 'PagosAtrasados', sortable: true, cell: (cprops) => <span>{FormateoNumero.format(cprops.PagosAtrasados)}</span> })
        case EColumnas.InteresPagado:
            return ({ name: 'Interes Pagado', selector: 'InteresPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.InteresPagado)}</span> })
        case EColumnas.IVAPagado:
            return ({ name: 'IVA Pagado', selector: 'IVAPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.IVAPagado)}</span> })
        case EColumnas.ManejoCuentaPagado:
            return ({ name: 'Manejo Cuenta Pagado', selector: 'ManejoCuentaPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.ManejoCuentaPagado)}</span> })
        case EColumnas.SeguroPagado:
            return ({ name: 'Seguro Pagado', selector: 'SeguroPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.SeguroPagado)}</span> })
        case EColumnas.CargoPagado:
            return ({ name: 'Cargo Pagado', selector: 'CargoPagado', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.CargoPagado)}</span> })
        case EColumnas.FechaHoraUltimoPago:
            return ({ name: 'F.Ultimo Pago', selector: 'FechaHoraUltimoPago', sortable: true, cell: (cprops) => <span>{moment(cprops.FechaHoraUltimoPago).format('DD/MM/YYYY')}</span> })
        case EColumnas.PagoPuntualUltmoPago:
            return ({ name: 'P.Puntual Ultmo Pago', selector: 'PagoPuntualUltmoPago', sortable: true, cell: (cprops) => <span>{cprops.PagoPuntualUltmoPago}</span> })
        case EColumnas.Reestructura:
            return ({ name: 'Reestructura', selector: 'Reestructura', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.Reestructura)}</span> })
        case EColumnas.CapitalPendiente:
            return ({ name: 'Capital Pendiente', selector: 'CapitalPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.CapitalPendiente)}</span> })
        case EColumnas.InteresPendiente:
            return ({ name: 'Interes Pendiente', selector: 'InteresPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.InteresPendiente)}</span> })
        case EColumnas.IVAPendiente:
            return ({ name: 'IVA Pendiente', selector: 'IVAPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.IVAPendiente)}</span> })
        case EColumnas.ManejoCuentaPendiente:
            return ({ name: 'Manejo Cuenta Pendiente', selector: 'ManejoCuentaPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.ManejoCuentaPendiente)}</span> })
        case EColumnas.SeguroPendiente:
            return ({ name: 'Seguro Pendiente', selector: 'SeguroPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.SeguroPendiente)}</span> })
        case EColumnas.CargoPendiente:
            return ({ name: 'Cargo Pendiente', selector: 'CargoPendiente', sortable: true, cell: (cprops) => <span>{FormateoDinero.format(cprops.CargoPendiente)}</span> })
        case EColumnas.Ciclo:
            return ({ name: 'Ciclo', selector: 'Ciclo', sortable: true, cell: (cprops) => <span>{cprops.Ciclo}</span> })
        case EColumnas.convenioTipoNombre:
            return ({ name: 'Convenio', selector: 'convenioTipoNombre', sortable: true })
        case EColumnas.convenioTipoActivo:
            return ({ name: 'Convenio Activo', selector: 'convenioTipoActivo', sortable: true, cell: (cprops) => <span>{cprops.convenioTipoActivo ? "Si" : "No"}</span> })
        case EColumnas.DistribuidorID:
            return ({ name: 'DistribuidorID', selector: 'DistribuidorID', sortable: true })
        case EColumnas.DistribuidorNombre:
            return ({ name: 'Socia Nombre', selector: 'DistribuidorNombre', sortable: true })
    }
}

/** Funciones en nuestra tabla, util para agregar funciones a la misma */
type FuncionesTabla = {
    Control: React.ReactElement,
    Funcion(Contrato: DBConfia_Creditos.IContratos_VW): any
}

/**
 * Opciones de seguridad y detalle de los contratos a mostrar
 */
type ListadoContratosTipo = {

    // Instancia de seguridad del proyecto
    oidc: IOidc

    // Generamos un listado de strings, esto permitira agregar las columnas a la tabla dinamicamente
    Columnas: EColumnas[]

    // Funciones de la tabla
    Funciones: FuncionesTabla[]

    // Pasamos los datos de consulta a su propiedad
    DatosConsulta: {

        // Contratos de un socia en especifico
        DistribuidorID?: number

        // Contratos de un producto en especifico
        ProductoID?: number

        // Contratos registrados por una persona en especifico
        PersonaIDRegistro?: number

        // Contratos registrados por un usuario en especifico
        UsuarioIDRegistro?: string

        // Contratos creados en una fecha en especifico
        FechaInicio?: Date
        FechaFin?: Date
    },
    // mostrar: boolean,
}

/** Tipo de nuestros filtros */


/** Generamos un typo para el estado del control */
type ListadoContratosEstadoTipo = {
    Contratos: DBConfia_Creditos.IContratos_VW[],
    Cargando: boolean,
    Error: boolean,

}
/**
 * Tabla de contratos, util para mostrar contratos utilizando diferentes filtros
 * @param {TablaContratosTipo} props Propiedades del control
 * @returns {React.ReactElement} Componente de react
 */
const ListadoContratos = (props: ListadoContratosTipo) => {

    // Definimos el estado de nuestro control
    const [Estado, definirEstado] = React.useState<ListadoContratosEstadoTipo>({
        Contratos: [],
        Cargando: true,
        Error: false
        
    })

    // Definimos una funcion asincrona para consultar los datos del servidor
    const ConsultarDatos = async () => {

        // Cambiamos el estatus del componente
        definirEstado({ Cargando: true, Error: false, Contratos: [] })

        // Intentamos
        try {
            // Ejecutamos la funcion de consulta de datos
            var Contratos = await Funciones.BuscarContratos(props.oidc, { ...props.DatosConsulta })

            // Cambiamos el estado
            definirEstado({ Cargando: false, Error: false, Contratos })
        }
        catch (e) {
            // Cambiamos el estado
            definirEstado({ Cargando: false, Error: true, Contratos: [] })
        }
    }

    // Definimos el efecto para consultar los contratos al momento de cargar el control (o que modifiquen sus propiedades)
    React.useEffect(() => {

        // Consultamos los datos del servicio web
        ConsultarDatos()

        // eslint-disable-next-line
    }, [props.DatosConsulta.DistribuidorID, props.DatosConsulta.FechaFin, props.DatosConsulta.FechaInicio, props.DatosConsulta.PersonaIDRegistro, props.DatosConsulta.ProductoID, props.DatosConsulta.UsuarioIDRegistro])

    // Define the columns
    const Columns = React.useMemo(() => {

        // Columnas basicas a incluir en la tabla
        const Columnas: IDataTableColumn[] =
            [
                { name: 'Producto', selector: 'ProductoNombre', sortable: true, minWidth: "150px" },
                { name: 'Activo', selector: 'Activo', sortable: true, maxWidth: "50px", cell: (cprops) => <span>{cprops.Activo ? "SI" : "NO"}</span> },
            ]

        // Iteramos las columnas
        for (let c: number = 0; c < props.Columnas.length; c++)
            Columnas.push(GenerarColumna(props.Columnas[c]))

        // Generamos las acciones del componente
        if (props.Funciones.length > 0)
            Columnas.push({
                name: 'Acciones', sortable: false, minWidth: `${props.Funciones.length * 50}px`,
                cell: (cprops) =>
                    <div>
                        {props.Funciones.map((Fn, FnId) =>
                            <span key={`fn_${cprops.DistribuidorID}_${FnId}`} onClick={() => Fn.Funcion(cprops)}>
                                {Fn.Control}
                            </span>
                        )}
                    </div>
            })

        return Columnas
        //eslint-disable-next-line
    }, [])

    // Si el componente esta cargando lo mostramos
    if (Estado.Cargando && !Estado.Error)
        return (
            <div className="text-center">
                <Spinner />
                <br />
                <span>Obteniendo contratos</span>
            </div>
        )

    // Regresamos un mensaje de error y la posibilidad de actualizar el componente
    else if (!Estado.Cargando && Estado.Error)
        return (
            <div className="text-center">
                <span>Ocurrio un error al obtener los contratos</span>
                <br />
                <button onClick={ConsultarDatos} className="btn btn-sm btn-confia text-white"><FiRefreshCcw /> </button>
            </div>
        )

    // Si no se tuvo un error al consultar los datos
    else if (!Estado.Cargando && !Estado.Error)
        return (
            <DataTable
                data={Estado.Contratos}
                striped
                // pagination
                dense
                noHeader
                responsive
                keyField={"PersonaID"}
                columns={Columns}
            />
        )
    // Regresamos null por defecto
    return null
}

ListadoContratos.EColumnas = EColumnas

export default ListadoContratos