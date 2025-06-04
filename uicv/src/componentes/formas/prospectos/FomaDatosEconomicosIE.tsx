import React from 'react'
import Yup from '../../../global/yupLocale'
import { CustomFieldText2, CustomSelect2 } from '../../global'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'

type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
    DependientesEconomicos?: number,
}

export const FormaDatosEconomicosIE = ({ Prefijo, Titulo, SubTitulo, DependientesEconomicos }: DireccionTipo) => {

    const [dependientes, setDependientes] = React.useState(-1)

    const InitialValues: any = {}
    InitialValues[`${Prefijo}IngresoSueldo`] = 0
    InitialValues[`${Prefijo}IngresoGananciasDV`] = 0
    InitialValues[`${Prefijo}IngresoConyuge`] = 0
    InitialValues[`${Prefijo}IngresoOtro`] = 0

    InitialValues[`${Prefijo}EgresoAlimentacion`] = 0
    InitialValues[`${Prefijo}EgresoTarjeta`] = 0
    InitialValues[`${Prefijo}EgresoVivienda`] = 0
    InitialValues[`${Prefijo}EgresosServiciosDomesticos`] = 0
    InitialValues[`${Prefijo}EgresoOtros`] = 0
    InitialValues[`${Prefijo}EgresoDependientes`] = 0

    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}IngresoSueldo`] = Yup.number().typeError('Ingrese un numero').required().min(0)
    ValSchemaObjecet[`${Prefijo}IngresoGananciasDV`] = Yup.number().typeError('Ingrese un numero').required().min(0)
    ValSchemaObjecet[`${Prefijo}IngresoConyuge`] = Yup.number().typeError('Ingrese un numero').required().min(0)
    ValSchemaObjecet[`${Prefijo}IngresoOtro`] = Yup.number().typeError('Ingrese un numero').required().min(0)

    ValSchemaObjecet[`${Prefijo}EgresoAlimentacion`] = Yup.number().typeError('Ingrese un numero').required().min(0)
    ValSchemaObjecet[`${Prefijo}EgresoTarjeta`] = Yup.number().typeError('Ingrese un numero').required().min(0)
    ValSchemaObjecet[`${Prefijo}EgresoVivienda`] = Yup.number().typeError('Ingrese un numero').required().min(0)
    ValSchemaObjecet[`${Prefijo}EgresosServiciosDomesticos`] = Yup.number().typeError('Ingrese un numero').required().min(0)
    ValSchemaObjecet[`${Prefijo}EgresoOtros`] = Yup.number().typeError('Ingrese un numero').required().min(0)
    ValSchemaObjecet[`${Prefijo}EgresoDependientes`] = Yup.number().typeError('Ingrese un numero').required().min(0)

    const options = [{ value: 0, label: '0 personas' },
    { value: 1, label: '1 persona' },
    { value: 2, label: '2 personas' },
    { value: 3, label: '3 personas' },
    { value: 4, label: '4 personas' },
    { value: 5, label: '5 personas' },
    { value: 6, label: '6 personas' },
    { value: 7, label: '7 personas' },
    { value: 8, label: '8 personas' },
    { value: 9, label: '9 personas' },
    { value: 10, label: '10 personas' }]

    const DependientesSelected = (val: number) => {
        //setTrabajaDisplay(val === 'true'? 'block' : 'none')
        setDependientes(val)
    }

    if (DependientesEconomicos && dependientes === -1)
        setDependientes(DependientesEconomicos)

    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <div>
                    <h6 className={MODAL_TITLE_CLASS}>*Ingresos MENSUALES</h6>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Sueldo'} datoType='text' name={`${Prefijo}IngresoSueldo`} placeholder={'Ingreso o Sueldo'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Ganancias DV'} datoType='text' name={`${Prefijo}IngresoGananciasDV`} placeholder={'Ganancias como DV'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Ingreso conyuge'} datoType='text' name={`${Prefijo}IngresoConyuge`} placeholder={'Ingresos del Conyuge'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Otro Ingreso'} datoType='text' name={`${Prefijo}IngresoOtro`} placeholder={'Otros ingresos'} />
                        </div>
                    </div>
                </div>

                <div>
                    <h6 className={MODAL_TITLE_CLASS}>*Egresos MENSUALES</h6>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Alimentación'} datoType='text' name={`${Prefijo}EgresoAlimentacion`} placeholder={'Gastos en Alimentación'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Tarjetas'} datoType='text' name={`${Prefijo}EgresoTarjeta`} placeholder={'Gastos de tarjetas de credito'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Vivienda'} datoType='text' name={`${Prefijo}EgresoVivienda`} placeholder={'Renta o pagos de la Vivienda'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'S. Domesticos'} datoType='text' name={`${Prefijo}EgresosServiciosDomesticos`} placeholder={'Gastos en Servicios Domesticos'} />
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomFieldText2 {...cprops} label={'Otros'} datoType='text' name={`${Prefijo}EgresoOtros`} placeholder={'Otros Gastos'} />
                        </div>
                        <div className={"col-sm-12 col-md-6"}>
                            <CustomSelect2 name={`${Prefijo}EgresoDependientes`} disabled={false} options={options} addDefault={false} label={'Dependientes'} placeholder={'Dependientes Economicos'} accion={DependientesSelected} valor={dependientes} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}