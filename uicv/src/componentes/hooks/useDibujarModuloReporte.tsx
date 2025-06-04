import React from 'react'
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router'
import { IEstado } from '../../interfaces/redux/IEstado'
import { IPermiso } from '../../interfaces/seguridad/IPermiso'
import { DefinirModulo } from '../../redux/ui/acciones'
import axios from 'axios'
import { GetServerUrl } from '../../global/variables'
import { toast } from 'react-toastify'
import moment from 'moment'


const useAppSelector: TypedUseSelectorHook<IEstado> = useSelector

type ModuloInfo = {
    Nombre: string
}

type GeneradorReportes = {
    Modulo: ModuloInfo;
    Componentes: never[];
    FnReportes(jsonParams?: any): Promise<any>;
    SetInitialValues: any;
    ResponseData: any;
    Error: boolean;
    IsMounted: boolean,
    LoadingComps: boolean,
    FnReporteList(): Promise<any>,
}

type GeneradorReportesHook = {
    PantallaID: number
    // Accion: number
}


type ResObtenerStateInicial = {
    Componentes: never[];
    Modulo: ModuloInfo;
}

type ReqObtenerState = {
    PantallaID: number,
    Accion: number,
    JsonData: any
}


type ResComponenteInt = {
    Tipo: string,
    Label: string,
    Selector: string
    Inicial: any
}


const Acciones = { GetComponentes: 0, EnviarForm: 1 }

const DataTypeParser = {
    D: (val) => val ? moment(val, "DD/MM/YYYY").toDate() : moment().subtract(6, 'h').toDate(),
    N: (val) => parseInt(val),
}


/**
 * Hook para dar acceso a los modulos
 * @param {number} PantallaID la pantalla que está registrada de la cual buscaremos los parametros
 * @param {number} Accion Si lo usaremos para obtener los componentes o consumir el SP registrado
 * @returns {ModuloInfo} Modulo - Retorna el nombre del modulo
 * @returns {ReqObtenerState[]} Componentes - Retorna la lista de los componentes
 * @returns {Function} FnReportes - Es la funcion con la que consumes el reporte que consultaste 
 * @returns {Function} SetInitialValues - Es con el que seteas los valores dependiendo el Tipo que se mando en BD
 * @returns {any} ResponseData - Es la data que recibes de la peticón con "accion = 1" 
 * @returns {boolean} Error - Es un booleano para definir si hubo un error
 * @returns {boolean} IsMounted - Booleano para comprobar si el componente se montó correctamente
 */
export const useDibujarModuloReporte = (props: GeneradorReportesHook): GeneradorReportes => {
    const [isMounted, setIsMounted] = React.useState(false);
    const [ModuloInfo, setModuloInfo] = React.useState<ModuloInfo>({ Nombre: '' })
    const [ResponseData, setResponseData] = React.useState<any>([])
    const [LoadingComps, setLoadingComps] = React.useState(false)
    const [Componentes, setComponentes] = React.useState([])
    const [Error, setError] = React.useState(false)

    // Accedemos al dispatch
    const dispatch = useDispatch()

    // Obtenemos acceso a nuestro estado en redux
    const estado = useAppSelector<IEstado>(estado => estado)
    const { productoId } = useParams<{ productoId: string | undefined }>()

    const FnReportes = (reqData: ReqObtenerState) =>
        axios.post(`${GetServerUrl()}creditos/reportes/GeneradorReportesRapidos`, reqData, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${estado.oidc.user.access_token}`
            }
        })
            .then(respuesta => {
                const res = respuesta.data
                if (reqData.Accion == Acciones.GetComponentes) {
                    setComponentes(res.Componentes)
                    setModuloInfo(res.Modulo)
                    setIsMounted(true)
                } else {
                    setResponseData(res)
                }
            })
            .catch(error => {
                console.error(error.response)
                if (reqData.Accion = Acciones.GetComponentes) {
                    toast.error('Ha habido un error obteniendo los componentes')
                    setError(true)
                } else {
                    toast.error(error.response?.data?.message)
                    setError(true)
                }
            }).finally(() => setLoadingComps(prev => false))

    const FnReporteList = () =>
        axios.get(`${GetServerUrl()}creditos/reportes/GetReportesRapidos`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${estado.oidc.user.access_token}`
            }
        })
            .then(respuesta => respuesta.data)
            .catch(error => error)


    // Usamos un memo para nuestro productoId
    React.useEffect(() => {
        if (props.PantallaID > 0) {
            setLoadingComps(true)
            FnReportes({ PantallaID: props.PantallaID, Accion: 0, JsonData: null })
        }
    }, [props.PantallaID])

    const SetInitialValues = (initialValues?: object) => {
        const newStateValue = {}
        Componentes.map((comp: ResComponenteInt) => {
            if (Object.keys(DataTypeParser).includes(comp.Tipo)) {
                newStateValue[comp.Selector] = DataTypeParser[comp.Tipo](comp.Inicial)
            }
            else
                newStateValue[comp.Selector] = comp.Inicial
        })
        return { ...newStateValue, ...initialValues }
    }

    return {
        Componentes: Componentes,
        ResponseData: ResponseData,
        Modulo: ModuloInfo,
        Error: Error,
        IsMounted: isMounted,
        LoadingComps: LoadingComps,
        SetInitialValues: (initialValues?: object): any =>
            SetInitialValues(initialValues),
        FnReporteList: () => FnReporteList(),
        FnReportes: (jsonData: any) => FnReportes({
            PantallaID: props.PantallaID,
            Accion: 1,
            JsonData: JSON.stringify(jsonData)
        })/* .then(res => setResponseData(res)) */
    }
}
