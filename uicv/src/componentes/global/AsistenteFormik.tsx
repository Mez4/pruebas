import React from 'react'
import { Formik, Form } from 'formik'
import { wait } from '@testing-library/react'
import { FormikWizard } from 'formik-wizard-form';

// Generate the form data for edit functions
const GenerarDatosForma = (initialFormData: any, Element: any) => {
    let returnValue = {}
    Object.keys(initialFormData).forEach(key => {
        returnValue = Element.hasOwnProperty(key) ? { ...returnValue, [key]: Element[key] } : { ...returnValue, [key]: '' }
    })
    return returnValue
}

// Interface para cada uno de los pasos del wizard
interface Paso {
    Titulo: string,
    SubTitulo?: string,
    Componente: any,
    Propiedades: any,
    InitialValues: any,
    ValidationSchema?: any,
}

// Tipo para el wizard
type AsistenteType = {

    // Se debe de prevenir el formateo de la forma
    ConservarDatos?: boolean

    // Datos basicos del asistente
    Pasos: Paso[],
    MostrarPasos: boolean,
    Datos?: any,

    // Clases de personalizacion de listado
    CLASE__LISTADO_PASOS__CONTENEDOR?: string,
    CLASE__LISTADO_PASOS__PROGRESO?: string,
    CLASE__LISTADO_PASOS__TERMINADO?: string,
    CLASE__LISTADO_PASOS__LI__TITULO?: string,
    CLASE__LISTADO_PASOS__LI__SUBTITULO?: string,

    // Botones
    CLASE__BOTONES__DIV?: string,
    CLASE__BOTONES__CANCELAR?: string,
    CLASE__BOTONES__ANTERIOR?: string,
    CLASE__BOTONES__SIGUIENTE?: string,
    CLASE__BOTONES__TERMINAR?: string,

    // Funciones
    FN__CANCELAR(): any,
    PROMESA__PROCESAR(Datos: any): Promise<any>,
    FN__LIMPIAR?(Datos: any, DatosPromesa: any): any,
    FN__ERROR(e: any): any
}

// Component context
interface AsistenteContextType {
    asistente: AsistenteType,
    estado: { PasoActual: number, Cargando: boolean, Datos: any },
    definirEstado(estado: { PasoActual: number, Cargando: boolean, Datos: any }): any,
    btnClicked: string,
    setBtnClicked: any
}

// Creamos el contexto de la aplicacion
const YEAFormWizardContext = React.createContext({} as AsistenteContextType)

/**
 * Componente mostrando el listado de los pasos de la forma
 * @returns {React.Component}  Forma del asistente
 */
const AsistenteFormikPasos = () => (
    <YEAFormWizardContext.Consumer>
        {(cv) => {
            if (cv.asistente.MostrarPasos === false) return null
            else {
                return (
                    <div>
                        <h4 className={cv.asistente.CLASE__LISTADO_PASOS__LI__TITULO}>{cv.asistente.Pasos[cv.estado.PasoActual].Titulo}</h4>
                        {
                            cv.asistente.Pasos[cv.estado.PasoActual].SubTitulo !== undefined &&
                            <div className={cv.asistente.CLASE__LISTADO_PASOS__LI__SUBTITULO}>{cv.asistente.Pasos[cv.estado.PasoActual].SubTitulo}</div>
                        }
                        <div className={`progress  ${cv.asistente.CLASE__LISTADO_PASOS__CONTENEDOR}`}>
                            <div
                                className={`progress-bar ${cv.asistente.Pasos.length === cv.estado.PasoActual ? cv.asistente.CLASE__LISTADO_PASOS__PROGRESO : cv.asistente.CLASE__LISTADO_PASOS__TERMINADO}`}
                                role='progressbar'
                                style={{ width: (100 / cv.asistente.Pasos.length) * (cv.estado.PasoActual + 1) + '%' }}
                                aria-valuenow={(100 / cv.asistente.Pasos.length) * (cv.estado.PasoActual + 1)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                        <hr />
                    </div>
                )
            }
        }}
    </YEAFormWizardContext.Consumer>
)

/** Tipo del presentador de forma */
type AsistenteFormikPresentadorType = {
    children: any,
    InitialValues: any,
    validationSchema?: any,
}
/**
 * Presentador de las formas de formik
 * @param props
 * @returns
 */
const AsistenteFormikPresentador = ({ children, InitialValues, validationSchema }: AsistenteFormikPresentadorType) => (
    <YEAFormWizardContext.Consumer>
        {(cv => (
            <Formik
                key={`frm_${cv.estado.PasoActual}`}
                enableReinitialize={true}
                initialValues={InitialValues}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    console.log('lol', cv.btnClicked)
                    if(cv.btnClicked === 'ANTERIOR'){
                        cv.definirEstado({ Datos: { ...cv.estado.Datos, ...values }, PasoActual: cv.estado.PasoActual - 1, Cargando: false })
                    }else{
                        if ((cv.estado.PasoActual + 1) === cv.asistente.Pasos.length) {

                            // Ponemos la forma a cargar
                            cv.definirEstado({ ...cv.estado, Cargando: true })

                            // Llamamos nuestra funcióon de procesar los datos
                            cv.asistente.PROMESA__PROCESAR({ ...cv.estado.Datos, ...values })
                                .then((DatosPromesa: any) => {

                                    // Checamos si tenemos que hacer limpieza de nuestros componentes
                                    if (cv.asistente.FN__LIMPIAR !== undefined)
                                        cv.asistente.FN__LIMPIAR({ ...cv.estado.Datos, ...values }, DatosPromesa)

                                    // Actualizamos el estado
                                    cv.definirEstado({ PasoActual: 0, Datos: cv.estado.Datos, Cargando: false })

                                    // Limpiamos formik
                                    actions.setSubmitting(false)

                                    // Validamos si debemos de limpiar el form
                                    if (cv.asistente.ConservarDatos === false)
                                        actions.resetForm({})
                                })
                                .catch((e) => {
                                    console.log('errorFormik', e)
                                    cv.asistente.FN__ERROR(e)
                                    cv.definirEstado({ ...cv.estado, Cargando: false, Datos: cv.estado.Datos })
                                })
                        }
                        else {
                            // Clean up
                            cv.definirEstado({ Datos: { ...cv.estado.Datos, ...values }, PasoActual: cv.estado.PasoActual + 1, Cargando: false })
                            wait()
                        }
                    }
                }}>
                <Form>
                    {children}
                </Form>
            </Formik>
        )
        )}
    </YEAFormWizardContext.Consumer>
)

/**
 * Genera los botones para navegar en la forma
 * @returns 
 */
const AsistenteFormikBotones = () => (
    <YEAFormWizardContext.Consumer>
        {(cv => (
            <div className={cv.asistente.CLASE__BOTONES__DIV}>
                <button disabled={cv.estado.Cargando} type="button" className={cv.asistente.CLASE__BOTONES__CANCELAR} onClick={(event) => {

                    // Clean up
                    cv.definirEstado({ Datos: cv.estado.Datos, PasoActual: 0, Cargando: false })

                    // Default cancel action
                    cv.asistente.FN__CANCELAR()

                    // Details
                    event.preventDefault()

                }}>Cancelar</button>
                {
                    cv.asistente.Pasos.length > 1 &&
                    <button
                        //type="button"
                        type="submit"
                        className={cv.asistente.CLASE__BOTONES__ANTERIOR}
                        disabled={(cv.estado.PasoActual === 0 ? true : false) || cv.estado.Cargando}
                        onClick={(event) => {
                            cv.setBtnClicked('ANTERIOR')
                            // cv.definirEstado({ ...cv.estado, PasoActual: cv.estado.PasoActual - 1 })
                            // event.preventDefault()
                        }}
                    >
                        Anterior
                    </button>
                }
                <button
                    disabled={cv.estado.Cargando}
                    type="submit"
                    className={(cv.estado.PasoActual + 1) === cv.asistente.Pasos.length ? cv.asistente.CLASE__BOTONES__TERMINAR : cv.asistente.CLASE__BOTONES__SIGUIENTE}
                    onClick={(event) => {
                        cv.setBtnClicked('SIGUIENTE')
                    }}
                >
                    {
                        (cv.estado.PasoActual + 1) === cv.asistente.Pasos.length
                            ? (cv.estado.Cargando ? <div className="spinner-border spinner-border-sm" role="status"><span className="sr-only">Loading...</span></div> : "Terminar")
                            : "Siguiente"
                    }
                </button>
            </div>
        ))}
    </YEAFormWizardContext.Consumer>
)

/**
 * Asistente de Formik
 * @param props Propiedades que controla como se comporta el asistente
 */
const AsistenteFormik = (props: AsistenteType) => {

    // Generate a global object to hold the data
    const [estado, definirEstado] = React.useState({ PasoActual: 0, Cargando: false, Datos: props.Datos ?? {} })

    const [btnClicked, setBtnClicked] = React.useState('');

    // Configuracion por defecto del wizard
    const valores: AsistenteContextType = {
        asistente: {
            ...{
                Pasos: [],
                MostrarPasos: true,

                // ***
                CLASE__LISTADO_PASOS__DIV: '',
                CLASE__LISTADO_PASOS__UL: '',
                CLASE__LISTADO_PASOS__TERMINADO: '',
                CLASE__LISTADO_PASOS__MARKER: '',
                CLASE__LISTADO_PASOS__LI__ACTUAL: '',
                CLASE__LISTADO_PASOS__LI__COMPLETADO: '',
                CLASE__LISTADO_PASOS__LI__TITULO: '',
                CLASE__LISTADO_PASOS__LI__SUBTITULO: '',

                // ***
                CLASE__BOTONES__DIV: '',
                CLASE__BOTONES__CANCELAR: '',
                CLASE__BOTONES__ANTERIOR: '',
                CLASE__BOTONES__SIGUIENTE: '',
                CLASE__BOTONES__TERMINAR: '',

                // Funciones
                FN__CANCELAR: () => alert("Cancelar"),
                PROMESA__PROCESAR: () => new Promise((Resolver) => Resolver(true)),
            },
            ...props
        },
        estado,
        definirEstado,
        btnClicked,
        setBtnClicked
    }

    // Hacemos referencia a nustro componente
    const FormaActual = props.Pasos[estado.PasoActual].Componente

    // Pasamos los valores iniciales
    // console.log('Valores temporales', props.Pasos[estado.PasoActual].InitialValues)
    // console.log('Initial values', GenerarDatosForma(props.Pasos[estado.PasoActual].InitialValues, estado.Datos))

    // Obtenemos los valores
    return (
        <YEAFormWizardContext.Provider value={valores}>
            <AsistenteFormikPasos />
            <AsistenteFormikPresentador InitialValues={GenerarDatosForma(props.Pasos[estado.PasoActual].InitialValues, estado.Datos)} validationSchema={props.Pasos[estado.PasoActual].ValidationSchema}>
                <>
                    <FormaActual {...props.Pasos[estado.PasoActual].Propiedades} Cargando={estado.Cargando} />
                    <AsistenteFormikBotones />
                </>
            </AsistenteFormikPresentador>
        </YEAFormWizardContext.Provider>
    )
}

export default AsistenteFormik