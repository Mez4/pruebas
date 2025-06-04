import { IOidc } from "../../../../../../interfaces/oidc/IOidc"
import { iUI } from "../../../../../../interfaces/ui/iUI"
import FieldDrawer from "../../../../../global/FieldDrawer"

type FormCumpleType = {
    oidc: IOidc,
    ui: iUI,
    InitialValues: any,
    Fields: any
    onSubmit(props: any): any
    fnExportData(): void
}

export default function CForm(props: FormCumpleType) {
    return (
        <div>
            <FieldDrawer
                LoadingMod={false}
                onSubmit={props.onSubmit}
                FnExportarData={props.fnExportData}
                initialValues={props.InitialValues}
                fields={props.Fields}
            />
        </div>
    )
}