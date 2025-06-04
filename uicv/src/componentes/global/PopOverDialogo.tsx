import React from 'react'
import Tippy, { TippyProps } from '@tippyjs/react/headless'

type PopOverDialogoTipo = {
    TippyProps: TippyProps,
    Launcher: string | React.ReactElement
}
const PopOverDialogo = ({ TippyProps, Launcher }: PopOverDialogoTipo) => {

    // Definimos el estado de la aplicación
    const [Visible, definirVisible] = React.useState(TippyProps.visible === undefined ? false : TippyProps.visible)

    // Rendereamos el componente
    return (
        <Tippy
            {...TippyProps}
            visible={Visible}
            onClickOutside={() => definirVisible(false)}
        >
            <div onClick={() => definirVisible(!Visible)}>
                {Launcher}
            </div>
        </Tippy>
    )
}

export default PopOverDialogo