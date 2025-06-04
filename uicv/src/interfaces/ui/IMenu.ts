import React from "react";
import { iUI } from "./iUI";

export type IMenu = {
    label: string,
    disabled?: boolean,
    icon?: string,
    to?: string,
    items?: IMenu[],
    badge?: JSX.Element,
    badgeStyleClass?: string,
    command?: (event: React.MouseEvent, item: IMenu) => void
}