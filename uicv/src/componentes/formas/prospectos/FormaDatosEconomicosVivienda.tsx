import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2, CustomSelect2 } from '../../global'
import { ControlAsentamientos, Ocupaciones, BuscarAsentamiento, TipoVivienda } from '../../selectores'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
    Habitantes?: number,
    TieneOtraVivienda?: boolean,
    TipoViviendaID?: number,
    TipoOtraViviendaID?: number,
    AsentID?: number,
    BC?: number,
}

export const FormaDatosVivienda = ({ Prefijo, Titulo, SubTitulo, Habitantes, TieneOtraVivienda, TipoViviendaID, TipoOtraViviendaID, AsentID, BC }: DireccionTipo) => {

    const [tipoVivienda, setTipoVivienda] = React.useState(0)
    const [tipoOtraVivienda, setTipoOtraVivienda] = React.useState(0)

    const [showAsentamiento, setShowAsentamiento] = React.useState(false)
    const [AsentamientoID, setAsentamientoID] = React.useState(0)

    const [habitantes, setHabitantes] = React.useState(0)
    const [otraVivienda, setOtraVivienda] = React.useState('')
    const [OtraViviendaDisplay, setOtraViviendaDisplay] = React.useState('none')

    const InitialValues: any = {}
    InitialValues[`${Prefijo}RFC`] = ''
    InitialValues[`${Prefijo}ValorVivienda`] = ''
    InitialValues[`${Prefijo}HabitantesVivienda`] = ''
    InitialValues[`${Prefijo}TipoViviendaID`] = ''
    InitialValues[`${Prefijo}OtraVivienda`] = ''
    InitialValues[`${Prefijo}ValorOtraVivienda`] = ''
    InitialValues[`${Prefijo}TipoOtraViviendaID`] = ''
    InitialValues[`${Prefijo}AsentamientoIDOtraVivienda`] = ''
    InitialValues[`${Prefijo}CalleOtraVivienda`] = ''
    InitialValues[`${Prefijo}LocalidadOtraVivienda`] = ''
    InitialValues[`${Prefijo}NumeroExteriorOtraVivienda`] = ''

    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}RFC`] = Yup.string().required().min(10).max(13)
    ValSchemaObjecet[`${Prefijo}ValorVivienda`] = Yup.number().typeError('Ingrese un numero').required().min(0)
    ValSchemaObjecet[`${Prefijo}HabitantesVivienda`] = Yup.number().typeError('Ingrese un numero').required().min(1)
    ValSchemaObjecet[`${Prefijo}TipoViviendaID`] = Yup.number().typeError('Ingrese una opcion').required().min(1)
    ValSchemaObjecet[`${Prefijo}OtraVivienda`] = Yup.boolean().typeError('Selecciona una opción').required()

    if (OtraViviendaDisplay === 'block') {
        ValSchemaObjecet[`${Prefijo}ValorOtraVivienda`] = Yup.number().typeError('Ingrese un numero').required().min(1)
        ValSchemaObjecet[`${Prefijo}TipoOtraViviendaID`] = Yup.number().typeError('Ingrese una opcion').required().min(1)
        ValSchemaObjecet[`${Prefijo}AsentamientoIDOtraVivienda`] = Yup.number().typeError('Ingrese un número').required().min(1)
        ValSchemaObjecet[`${Prefijo}CalleOtraVivienda`] = Yup.string().required()
        ValSchemaObjecet[`${Prefijo}LocalidadOtraVivienda`] = Yup.string().required()
        ValSchemaObjecet[`${Prefijo}NumeroExteriorOtraVivienda`] = Yup.string().required()
    }

    const optionsHabitantes = [{ value: 1, label: '1 persona' },
    { value: 2, label: '2 personas' },
    { value: 3, label: '3 personas' },
    { value: 4, label: '4 personas' },
    { value: 5, label: '5 personas' },
    { value: 6, label: '6 personas' },
    { value: 7, label: '7 personas' },
    { value: 8, label: '8 personas' },
    { value: 9, label: '9 personas' },
    { value: 10, label: '10 personas' }]

    const fnOpen = () => setShowAsentamiento(true)

    const fnCancelar = () => setShowAsentamiento(false)

    const tipoViviendaSelected = (val: number) => setTipoVivienda(val)
    const tipoOtraViviendaSelected = (val: number) => setTipoOtraVivienda(val)

    const HabitantesSelected = (val: number) => {
        //setTrabajaDisplay(val === 'true'? 'block' : 'none')
        setHabitantes(val)
    }

    const otraViviendaSelected = (val: string) => {
        setOtraViviendaDisplay(val === 'true' ? 'block' : 'none')
        setOtraVivienda(val)
    }

    const cbAceptar = (id: number) => {
        setShowAsentamiento(false);
        setAsentamientoID(id);
    }

    if (Habitantes && habitantes === 0)
        HabitantesSelected(Habitantes)

    if (TieneOtraVivienda === true && otraVivienda === '')
        otraViviendaSelected('true')
    else if (TieneOtraVivienda === false && otraVivienda === '')
        otraViviendaSelected('false')

    if (TipoViviendaID && tipoVivienda === 0)
        tipoViviendaSelected(TipoViviendaID)

    if (TipoOtraViviendaID && tipoOtraVivienda === 0)
        tipoOtraViviendaSelected(TipoOtraViviendaID)

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
                <CustomFieldText2 {...cprops} disabled={BC == 2} label={'RFC'} name={`${Prefijo}RFC`} placeholder={'RFC'} />
                <div className={"row"}>
                    <h6 className={MODAL_TITLE_CLASS}>*Informacíon de Vivienda</h6>
                    <div className={"col-sm-12 col-md-6"}>
                        <TipoVivienda {...cprops} label={'Tipo Vivienda'}  name={`${Prefijo}TipoViviendaID`} accion={tipoViviendaSelected} valor={tipoVivienda} />
                    </div>
                    <div className={"col-sm-12 col-md-6"}>
                        <CustomSelect2 name={`${Prefijo}HabitantesVivienda`} disabled={false} options={optionsHabitantes} addDefault={false} label={'¿Habitantes?'} placeholder={'¿Cuantas personas habitan?'} accion={HabitantesSelected} valor={habitantes} />
                    </div>
                </div>
                <CustomFieldText2 {...cprops} label={'Valor Aprox.'} datoType='text' name={`${Prefijo}ValorVivienda`} placeholder={'$0,000.00'} />

                <CustomSelect2 name={`${Prefijo}OtraVivienda`} disabled={false} options={[{ value: true, label: 'Si, tiene otra Vivienda.' }, { value: false, label: 'No, no tiene otra vivienda.' }]} addDefault={false} label={'¿Otra Vivienda?'} placeholder={'¿El prospecto cuenta con otra vivienda?'} accion={otraViviendaSelected} valor={otraVivienda} />
                <div style={{ display: OtraViviendaDisplay }}>
                    <h6 className={MODAL_TITLE_CLASS}>*Información de Otra Vivienda</h6>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Valor Aprox.'} datoType='text' name={`${Prefijo}ValorOtraVivienda`} placeholder={'$0,000.00'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <TipoVivienda {...cprops} label={'Tipo Vivienda'} name={`${Prefijo}TipoOtraViviendaID`} accion={tipoOtraViviendaSelected} valor={tipoOtraVivienda} />
                        </div>
                    </div>

                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <ControlAsentamientos name={`${Prefijo}AsentamientoIDOtraVivienda`} valor={AsentamientoID} fnOpen={fnOpen} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Calle'} datoType='text' name={`${Prefijo}CalleOtraVivienda`} placeholder={'Calle'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Localidad'} datoType='text' name={`${Prefijo}LocalidadOtraVivienda`} placeholder={'Localidad o ciudad'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Numero'} datoType='text' name={`${Prefijo}NumeroExteriorOtraVivienda`} placeholder={'Numero Exterior'} />
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