import React from 'react'
import * as Yup from 'yup'
import { CustomFieldDatePicker2, CustomFieldText2, CustomSelect2 } from '../../global'
import { Ocupaciones } from '../../selectores'


export const FormaEmpleo = () => {

    const [ocupacion, setOcupacion] = React.useState(0)

    const ocupacionSelected = (val: number) => setOcupacion(val)

    return {
        InitialValues: { FormaEmpleo__Empresa: '', FormaEmpleo__Puesto: '', FormaEmpleo__OcupacionID: '', FormaEmpleo__Telefono: '', FormaEmpleo__FechaIngreso: '', FormaEmpleo__FechaTermino: '', FormaEmpleo__SueldoMensual: '' },
        Propiedades: {},
        Titulo: "Empleo",
        SubTitulo: "Detalles laborales",
        ValidationSchema: Yup.object().shape({
            FormaEmpleo__Empresa: Yup.string().required().min(3).max(120),
            FormaEmpleo__Puesto: Yup.string().required().min(3).max(120),
            //FormaEmpleo__OcupacionID: Yup.string().required(),
            FormaEmpleo__Telefono: Yup.string().required().min(10).max(10),
            /*    FormaEmpleo__FechaIngreso: Yup.string().required(),
               FormaEmpleo__FechaTermino: Yup.string(),
               FormaEmpleo__SueldoMensual: Yup.number().required().min(2) */
        }),
        Componente: (cprops: any) => (
            <div>
                <CustomFieldText2 disabled={cprops.Cargando} label={'Empresa'} datoType='text' name={'FormaEmpleo__Empresa'} placeholder={'Empresa Empleadora'} />
                <CustomFieldText2 disabled={cprops.Cargando} label={'Puesto'} datoType='text' name={'FormaEmpleo__Puesto'} placeholder={'Puesto Laboral'} />
                {/*                 <Ocupaciones disabled={cprops.Cargando} name={'FormaEmpleo__OcupacionID'} accion={ocupacionSelected} valor={ocupacion} />
 */}                <CustomFieldText2 disabled={cprops.Cargando} label={'Teléfono'} datoType='text' name={'FormaEmpleo__Telefono'} placeholder={'Teléfono'} />
                {/* <CustomFieldDatePicker2 disabled={cprops.Cargando} label={'F.Inicio'} name={'FormaEmpleo__FechaIngreso'} placeholder={'Fecha inicio'} />
                <CustomFieldDatePicker2 disabled={cprops.Cargando} label={'F.Fin'} name={'FormaEmpleo__FechaTermino'} placeholder={'Fecha fin'} /> */}
                {/*             <CustomFieldText2 disabled={cprops.Cargando} label={'Sueldo MMMensual'} name={'FormaEmpleo__SueldoMensual'} placeholder={'XXXXXXXXXX'} />
 */}        {/* <CustomSelect2 name={`FormaEmpleo__SueldoMensual`} disabled={false} options={[{ value: 9999, label: '0 - 10,000' }, { value: 12500, label: '10,001 - 12,500' }, { value: 15000, label: '12,501 - 15,000' }, { value: 20000, label: '15,001 - 20,000' }, { value: 25000, label: '20,001 - 25,000' }, { value: 30000, label: '25,001 - 30,000' }, { value: 35000, label: '30,001 - 35,000' }, { value: 40000, label: '35,001 - 40,000' }, { value: 60000, label: '40,001 - 60,000' }, { value: 80000, label: '60,001 - 80,000' }, { value: 100000, label: '80,001 - +100,000' }]} addDefault={false} label={'Sueldo Mensual'} placeholder={'Elige rango del Sueldo Mensual'} />
 */}
            </div>
        )
    }
}
