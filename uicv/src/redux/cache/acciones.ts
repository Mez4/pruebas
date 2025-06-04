import { OBJETO_CACHE } from '../../interfaces/cache/ICache'
import { IAccion } from '../../interfaces/redux/IAccion'
import * as st from './tipos'

export const DefinirCache = (Payload: OBJETO_CACHE): IAccion => ({ Payload, type: st.CACHE_DEFINIR })