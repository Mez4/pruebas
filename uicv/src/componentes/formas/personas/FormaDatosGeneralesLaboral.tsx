import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2, CustomSelect2 } from '../../global'
import { Ocupaciones, BuscarAsentamiento, Sexos, ControlAsentamientos, EstadosPais, OrientacionVialidadesTipo, VialidadesTipo, EstadoCivil, Escolaridad, ViviendasTipo, TipoVivienda } from '../../selectores'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
    // TieneEmpleo?: number,
    // OcupacionID?: number,
    // AsentID?: number
}

export const FormaDatosGeneralesLaboral = ({ Prefijo, Titulo, SubTitulo, /*TieneEmpleo, OcupacionID, AsentID*/ }: DireccionTipo) => {

    const [ocupacion, setOcupacion] = React.useState(0)

    const [showAsentamiento, setShowAsentamiento] = React.useState(false)
    const [AsentamientoID, setAsentamientoID] = React.useState(0)

    const [TrabajaDisplay, setTrabajaDisplay] = React.useState('none')
    const [trabaja, setTrabaja] = React.useState('')

    const InitialValues: any = {}
    InitialValues[`${Prefijo}Trabaja`] = ''

    InitialValues[`${Prefijo}Empresa`] = ''
    InitialValues[`${Prefijo}OcupacionID`] = 0
    InitialValues[`${Prefijo}SueldoMensual`] = 0.00
    InitialValues[`${Prefijo}Antiguedad`] = ''
    InitialValues[`${Prefijo}TelefonoLaboral`] = ''
    InitialValues[`${Prefijo}AsentamientoIDLaboral`] = ''
    // InitialValues[`${Prefijo}LocalidadLaboral`]      = ''
    InitialValues[`${Prefijo}NombreVialidad`] = ''
    InitialValues[`${Prefijo}NumeroExteriorLaboral`] = ''
    // InitialValues[`${Prefijo}AsentamientoID`] = ''
    // InitialValues[`${Prefijo}Localidad`] = ''
    // InitialValues[`${Prefijo}Calle`] = ''
    InitialValues[`${Prefijo}viviendaTipoIdLaboral`] = 0
    InitialValues[`${Prefijo}NumeroInteriorLaboral`] = ''
    InitialValues[`${Prefijo}vialidadTipoIdLaboral`] = 0
    InitialValues[`${Prefijo}orientacionVialidadTipoIdLaboral`] = 0





    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}Trabaja`] = Yup.boolean().typeError('Selecciona una opción').required()
    if (TrabajaDisplay === 'block') {

        ValSchemaObjecet[`${Prefijo}Empresa`] = Yup.string().required().min(3).max(50)
        ValSchemaObjecet[`${Prefijo}OcupacionID`] = Yup.number().typeError('Ingrese un número').required().min(1)
        ValSchemaObjecet[`${Prefijo}SueldoMensual`] = Yup.number().typeError('Ingrese un número').required().min(1)
        ValSchemaObjecet[`${Prefijo}Antiguedad`] = Yup.string().required().min(3).max(50)
        ValSchemaObjecet[`${Prefijo}TelefonoLaboral`] = Yup.string().required().min(10).max(10)
        ValSchemaObjecet[`${Prefijo}AsentamientoIDLaboral`] = Yup.number().typeError('Ingrese un número').required().min(1)
        // ValSchemaObjecet[`${Prefijo}LocalidadLaboral`]     = Yup.string().required()
        ValSchemaObjecet[`${Prefijo}NombreVialidad`] = Yup.string().required()
        ValSchemaObjecet[`${Prefijo}NumeroExteriorLaboral`] = Yup.string().required()
        // ValSchemaObjecet[`${Prefijo}NumeroInteriorLaboral`]= Yup.string().required()
        ValSchemaObjecet[`${Prefijo}vialidadTipoIdLaboral`] = Yup.number().required("Seleccione una opcion").moreThan(0, 'Seleccione una opcion')
        ValSchemaObjecet[`${Prefijo}orientacionVialidadTipoIdLaboral`] = Yup.number().required("Seleccione una opcion").moreThan(0, 'Seleccione una opcion')
        ValSchemaObjecet[`${Prefijo}viviendaTipoIdLaboral`] = Yup.number().required("Seleccione una opcion").moreThan(0, 'Seleccione una opcion')
    }

    const fnOpen = () => setShowAsentamiento(true)

    const fnCancelar = () => setShowAsentamiento(false)

    const ocupacionSelected = (val: number) => setOcupacion(val)

    const TrabajaSelected = (val: string) => {
        console.log(val, 'VAL')
        setTrabajaDisplay(val === 'true' ? 'block' : 'none')
        setTrabaja(val)
    }

    const cbAceptar = (id: number) => {
        setShowAsentamiento(false);
        setAsentamientoID(id);
    }

    // if(TieneEmpleo === 1 && trabaja === '')
    //     TrabajaSelected('true')
    // else if (TieneEmpleo === 0 && trabaja === '')
    //     TrabajaSelected('false')

    // if(OcupacionID && ocupacion === 0)
    //     setOcupacion(OcupacionID)

    // if(AsentID && AsentamientoID === 0)
    //     setAsentamientoID(AsentID)


    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <CustomSelect2 name={`${Prefijo}Trabaja`} disabled={false} options={[{ value: true, label: 'Si, tiene empleo.' }, { value: false, label: 'No, no tiene empleo.' }]} addDefault={false} label={'¿Trabaja?'} placeholder={'¿La Persona tiene empleo actualmente?'} accion={TrabajaSelected} valor={trabaja} />
                <div style={{ display: TrabajaDisplay }}>
                    <CustomFieldText2 {...cprops} label={'Empresa'} datoType='text' name={`${Prefijo}Empresa`} placeholder={'Empresa en que labora'} />
                    <Ocupaciones {...cprops} label={'Puesto'} name={`${Prefijo}OcupacionID`} accion={ocupacionSelected} valor={ocupacion} />
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Sueldo'} datoType='text' name={`${Prefijo}SueldoMensual`} placeholder={'Sueldo Mensual'} />
                        </div>

                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Antigüedad'} datoType='text' name={`${Prefijo}Antiguedad`} placeholder={'Antigüedad'} />
                        </div>
                    </div>
                    <h6 className={MODAL_TITLE_CLASS}>*Domicilio laboral</h6>
                    <ControlAsentamientos name={`${Prefijo}AsentamientoIDLaboral`} valor={AsentamientoID} fnOpen={fnOpen} />
                    {/* <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Calle'} name={`${Prefijo}NombreVialidad`} placeholder={'Calle'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Localidad'} name={`${Prefijo}LocalidadLaboral`} placeholder={'Localidad o ciudad'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Numero'} name={`${Prefijo}NumeroExteriorLaboral`} placeholder={'Numero Exterior'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Teléfono'} name={`${Prefijo}TelefonoLaboral`} placeholder={'Teléfono de Trabajo'} />
                        </div>
                    </div> */}
                    {/* <div> */}
                    {/* <h6 className={MODAL_TITLE_CLASS}>*Domicilio</h6> */}
                    {/* <ControlAsentamientos name={`${Prefijo}AsentamientoID`} valor={AsentamientoID} fnOpen={fnOpen} /> */}

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <ViviendasTipo {...cprops} label={'Tipo de Vivienda'} name={`${Prefijo}viviendaTipoIdLaboral`} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Calle'} datoType='text' name={`${Prefijo}NombreVialidad`} placeholder={'Calle'} />
                        </div>

                    </div>

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <VialidadesTipo {...cprops} label={'Tipo de Vialidad'} name={`${Prefijo}vialidadTipoIdLaboral`} placeholder={'vialidadTipoId'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Número Exterior'} datoType='text' name={`${Prefijo}NumeroExteriorLaboral`} placeholder={'Numero Exterior'} />
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <OrientacionVialidadesTipo {...cprops} label={'Orientación'} name={`${Prefijo}orientacionVialidadTipoIdLaboral`} placeholder={'orientacionVialidadTipoId'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            {/* <div className={"col-sm-12 col-md-6"}> */}
                            <CustomFieldText2 {...cprops} label={'Número Interior'} datoType='text' name={`${Prefijo}NumeroInteriorLaboral`} placeholder={'Numero Interior (Opcional)'} />
                            {/* </div> */}
                            <CustomFieldText2 {...cprops} label={'Tel.Domicilio'} datoType='text' name={`${Prefijo}TelefonoLaboral`} placeholder={'Teléfono Fijo'} />

                            {/* </div> */}
                        </div>
                    </div>
                </div>

                <ModalWin open={showAsentamiento}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                            {"Buscar Asentamiento"}
                        </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {showAsentamiento &&
                            <BuscarAsentamiento
                                initialValues={{
                                    EstadoId: 0,
                                    MunicipioId: 0,
                                    TipoAsentamientoId: 0,
                                    CodigoPostalID: 0,
                                    AsentamientoID: 0
                                }}
                                cbAceptar={cbAceptar}
                                fnCancelar={fnCancelar}
                            />}
                    </ModalWin.Body>
                </ModalWin>
            </div>
        )
    }
}