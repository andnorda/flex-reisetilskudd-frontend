import 'moment/locale/nb'

import moment from 'moment'

moment.locale('nb')

export enum DatoFormat {
    TALL = 'DD.MM.YYYY',
    NATURLIG_KORT = 'Do MMMM',
    NATURLIG_LANG = 'Do MMMM YYYY',
    NATURLIG_FULL = 'dddd Do MMMM YYYY',
    FLATPICKR = 'YYYY-MM-DD',
}

export enum TidsFormat {
    VANLIG = 'HH:mm',
    TIMER = 'HH',
    MINUTTER = 'mm'
}

export const getIDag = (format?: string): string => moment().format(format || DatoFormat.TALL)

export const getNåTid = (format?: string): string => moment().format(format || TidsFormat.VANLIG)

export const formatertDato = (date: Date | string, format?: string): string => (
    moment(date).format(format || DatoFormat.TALL)
)
