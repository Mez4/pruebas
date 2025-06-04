import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2, CustomSelect2 } from '../../global'
import { ControlAsentamientos, BuscarAsentamiento, EstadoCivil, Ocupaciones } from '../../selectores'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
    EstadoCivilID?: string,
    TieneEmpleo?: number,
    OcupacionID?: number,
    AsentID?: number
}

export const FormaDatosGeneralesECivil = ({ Prefijo, Titulo, SubTitulo, EstadoCivilID, TieneEmpleo, OcupacionID, AsentID }: DireccionTipo) => {

    const [showAsentamiento, setShowAsentamiento] = React.useState(false)

    const [AsentamientoID, setAsentamientoID] = React.useState(0)

    const [conyugeDisplay, setconyugeDisplay] = React.useState('none')
    const [conyugeTrabajaDisplay, setconyugeTrabajaDisplay] = React.useState('none')

    const [conyuge, setconyuge] = React.useState('')
    const [trabaja, setTrabaja] = React.useState('')
    const [ocupacion, setOcupacion] = React.useState(0)

    const InitialValues: any = {}
    InitialValues[`${Prefijo}EstadoCivilID`] = ''

    InitialValues[`${Prefijo}NombreConyuge`] = ''
    // InitialValues[`${Prefijo}APaternoConyuge`]              = '' 
    // InitialValues[`${Prefijo}AMaternoConyuge`]              = '' 
    InitialValues[`${Prefijo}Trabaja`] = ''

    InitialValues[`${Prefijo}EmpresaConyuge`] = ''
    InitialValues[`${Prefijo}OcupacionIDConyuge`] = 0
    InitialValues[`${Prefijo}SueldoMensualConyuge`] = 0.00
    InitialValues[`${Prefijo}AntiguedadConyuge`] = ''
    InitialValues[`${Prefijo}TelefonoLaboralConyuge`] = ''
    InitialValues[`${Prefijo}AsentamientoIDLaboralConyuge`] = ''
    InitialValues[`${Prefijo}LocalidadLaboralConyuge`] = ''
    InitialValues[`${Prefijo}CalleLaboralConyuge`] = ''
    InitialValues[`${Prefijo}NumeroExteriorLaboralConyuge`] = ''

    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}EstadoCivilID`] = Yup.string().required().min(1).max(1, 'Selecciona una opción valida')

    if (['C', 'U', 'L'].includes(conyuge)) {
        ValSchemaObjecet[`${Prefijo}NombreConyuge`] = Yup.string().required().min(3).max(120)
        //ValSchemaObjecet[`${Prefijo}APaternoConyuge`]           = Yup.string().required().min(3).max(120)
        ValSchemaObjecet[`${Prefijo}Trabaja`] = Yup.boolean().typeError('Selecciona una opción').required()
    }

    if (conyugeTrabajaDisplay === 'block') {
        ValSchemaObjecet[`${Prefijo}EmpresaConyuge`] = Yup.string().required().min(3).max(50)
        ValSchemaObjecet[`${Prefijo}OcupacionIDConyuge`] = Yup.number().typeError('Ingrese un número').required().min(1)
        ValSchemaObjecet[`${Prefijo}SueldoMensualConyuge`] = Yup.number().typeError('Ingrese un número').required().min(1)
        ValSchemaObjecet[`${Prefijo}AntiguedadConyuge`] = Yup.string().required().min(3).max(25)
        ValSchemaObjecet[`${Prefijo}TelefonoLaboralConyuge`] = Yup.string().required().min(10).max(10)
        ValSchemaObjecet[`${Prefijo}AsentamientoIDLaboralConyuge`] = Yup.number().typeError('Ingrese un número').required().min(1)
        ValSchemaObjecet[`${Prefijo}LocalidadLaboralConyuge`] = Yup.string().required().min(1).max(50)
        ValSchemaObjecet[`${Prefijo}CalleLaboralConyuge`] = Yup.string().required().min(1).max(50)
        ValSchemaObjecet[`${Prefijo}NumeroExteriorLaboralConyuge`] = Yup.string().required().min(1).max(10)
    }

    const fnOpen = () => setShowAsentamiento(true)

    const fnCancelar = () => setShowAsentamiento(false)

    const eCivilSelected = (val: string) => {
        if (['C', 'U', 'L'].includes(val)) {
            setconyugeDisplay('block')
            setconyuge(val)
        } else {
            setconyugeDisplay('none')
            setconyuge(val)
        }
    }

    const conyugeTrabajaSelected = (val: string) => {
        setconyugeTrabajaDisplay(val === 'true' ? 'block' : 'none')
        setTrabaja(val)
    }

    const ocupacionSelected = (val: number) => setOcupacion(val)

    const cbAceptar = (id: number) => {
        setShowAsentamiento(false);
        setAsentamientoID(id);
    }

    if (EstadoCivilID && conyuge === '')
        eCivilSelected(EstadoCivilID)

    if (TieneEmpleo === 1 && trabaja === '')
        conyugeTrabajaSelected('true')
    else if (TieneEmpleo === 0 && trabaja === '')
        conyugeTrabajaSelected('false')

    if (OcupacionID && ocupacion === 0)
        setOcupacion(OcupacionID)

    if (AsentID && AsentamientoID === 0)
        setAsentamientoID(AsentID)

    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <EstadoCivil {...cprops} label={'Estado Civil'} name={`${Prefijo}EstadoCivilID`} accion={eCivilSelected} valor={conyuge} />

                <div style={{ display: conyugeDisplay }}>
                    <hr />
                    <h5 className={MODAL_TITLE_CLASS}>Datos del Conyuge</h5>
                    <CustomFieldText2 {...cprops} label={'Nom. Completo'} datoType='text' name={`${Prefijo}NombreConyuge`} placeholder={'Nombre de conyuge'} />
                    {/* <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'A. Paterno'} name={`${Prefijo}APaternoConyuge`} placeholder={'Apellido Paterno de conyuge'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'A. Materno'} name={`${Prefijo}AMaternoConyuge`} placeholder={'Aprellido Materno conyuge'} />
                        </div>
                    </div> */}
                    <CustomSelect2 name={`${Prefijo}Trabaja`} disabled={false} options={[{ value: true, label: 'Si, trabaja.' }, { value: false, label: 'No, no tiene empleo.' }]} addDefault={false} label={'¿Trabaja?'} placeholder={'¿El conyuge del prospecto tiene empleo actualmente?'} accion={conyugeTrabajaSelected} valor={trabaja} />
                </div>

                <div style={{ display: conyugeTrabajaDisplay }}>
                    <hr />
                    <h5 className={MODAL_TITLE_CLASS}>Datos Laborales de Conyuge</h5>
                    <CustomFieldText2 {...cprops} label={'Empresa'} datoType='text' name={`${Prefijo}EmpresaConyuge`} placeholder={'Empresa en que labora el conyuge'} />
                    <Ocupaciones {...cprops} label={'Puesto'} name={`${Prefijo}OcupacionIDConyuge`} accion={ocupacionSelected} valor={ocupacion} />
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Sueldo'} name={`${Prefijo}SueldoMensualConyuge`} placeholder={'Sueldo Mensual de conyuge'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Antigüedad'} datoType='text' name={`${Prefijo}AntiguedadConyuge`} placeholder={'Antigüedad del conyuge'} />
                        </div>
                    </div>
                    <h6 className={MODAL_TITLE_CLASS}>*Domicilio laboral del conyuge</h6>
                    <ControlAsentamientos name={`${Prefijo}AsentamientoIDLaboralConyuge`} valor={AsentamientoID} fnOpen={fnOpen} />
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Calle'} datoType='text' name={`${Prefijo}CalleLaboralConyuge`} placeholder={'Calle'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Localidad'} datoType='text' name={`${Prefijo}LocalidadLaboralConyuge`} placeholder={'Localidad o ciudad'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Numero'} datoType='text' name={`${Prefijo}NumeroExteriorLaboralConyuge`} placeholder={'Numero Exterior'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Teléfono'} datoType='text' name={`${Prefijo}TelefonoLaboralConyuge`} placeholder={'Teléfono'} />
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