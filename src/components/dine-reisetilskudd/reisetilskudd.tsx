import './reisetilskudd.less'

import { HoyreChevron } from 'nav-frontend-chevron'
import { Element, Systemtittel } from 'nav-frontend-typografi'
import React from 'react'
import { Link } from 'react-router-dom'

import { SøknadsIkon } from '../../assets/ikoner'
import { ReisetilskuddInterface } from '../../models/reisetilskudd'
import { DatoFormat, formatertDato } from '../../utils/dato'
import Vis from '../vis'
import useReisetilskuddTilGlobalState from './useReisetilskuddTilGlobalState'

interface Props {
    reisetilskudd: ReisetilskuddInterface,
}

const Reisetilskudd = ({ reisetilskudd }: Props) => {
    const settReisetilskuddTilGlobalState = useReisetilskuddTilGlobalState()

    return (
        <Link to={`/soknaden/${reisetilskudd.reisetilskuddId}/1`}
            className="reisetilskudd-element-wrapper"
            onClick={() => settReisetilskuddTilGlobalState(reisetilskudd)}
        >
            <div className="reisetilskudd-ikon">
                <SøknadsIkon />
            </div>
            <div className="reisetilskudd-innhold">
                <Systemtittel className="reisetilskudd-innhold-tittel">Søknad om reisetilskudd</Systemtittel>
                <Vis hvis={reisetilskudd.fom && reisetilskudd.tom}>
                    <Element className="reisetilskudd-periode">
                        Gjelder perioden fra
                        {' '}
                        {reisetilskudd.fom ? formatertDato(reisetilskudd.fom, DatoFormat.NATURLIG_LANG) : ''}
                        {' '}
                        til
                        {' '}
                        {reisetilskudd.tom ? formatertDato(reisetilskudd.tom, DatoFormat.NATURLIG_LANG) : ''}
                    </Element>
                </Vis>
                <Element className="reisetilskudd-orgnavn">
                    {reisetilskudd.orgNavn}
                    {' '}
                    org.nr
                    {reisetilskudd.orgNummer}
                </Element>
            </div>
            <HoyreChevron className="reisetilskudd-chevron" />
        </Link>
    )
}

export default Reisetilskudd
