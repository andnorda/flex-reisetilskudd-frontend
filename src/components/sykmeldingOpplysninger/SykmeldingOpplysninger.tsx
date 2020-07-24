import React, { ReactElement } from 'react';
import './sykmeldingOpplysninger.less';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { useAppStore } from '../../data/stores/app-store';
import Vis from '../Vis';
import { SykmeldingOpplysningEnum } from '../../models/sykmelding';
import ManglendeOpplysninger from './ManglendeOpplysninger';
import PeriodeTekst from './PeriodeTekst';

const SykmeldingOpplysninger = () : ReactElement => {
  const { opplysningerSykmeldinger } = useAppStore();
  const vårSykmelding = opplysningerSykmeldinger ? opplysningerSykmeldinger[0] : undefined;

  const fåVerdiEllerManglendeOpplysninger = (
    hvilkenVerdi : SykmeldingOpplysningEnum,
  ) => vårSykmelding?.[hvilkenVerdi] || <ManglendeOpplysninger />;

  const fraDato : string = vårSykmelding?.[SykmeldingOpplysningEnum.FRA_DATO] || '';
  const tilDato : string = vårSykmelding?.[SykmeldingOpplysningEnum.TIL_DATO] || '';

  const tittelKlasseNavn = 'soknad-tittel';

  return (
    <div className="sykmelding-opplysninger-wrapper">
      <Vis hvis={vårSykmelding !== undefined}>
        <Element className={tittelKlasseNavn}>Periode</Element>
        <PeriodeTekst fraDato={fraDato} tilDato={tilDato} />
        <Element className={tittelKlasseNavn}>Diagnose</Element>
        {fåVerdiEllerManglendeOpplysninger(SykmeldingOpplysningEnum.DIAGNOSE)}
        <Element className={tittelKlasseNavn}>Bidiagnose</Element>
        {fåVerdiEllerManglendeOpplysninger(SykmeldingOpplysningEnum.BI_DIAGNOSER)}
        <Element className={tittelKlasseNavn}>Reisetilskudd</Element>
        {fåVerdiEllerManglendeOpplysninger(SykmeldingOpplysningEnum.REISETILSKUDD)}
        <Element className={tittelKlasseNavn}>
          Beskriv eventelle hesyn som må tas på arbeidsplassen
        </Element>
        {fåVerdiEllerManglendeOpplysninger(SykmeldingOpplysningEnum.BESKRIV_HENSYN)}
        <Element className={tittelKlasseNavn}>Arbeidsgiver som legen har skrevet inn</Element>
        {fåVerdiEllerManglendeOpplysninger(SykmeldingOpplysningEnum.ARBEIDSGIVER)}
        <Element className={tittelKlasseNavn}>Lege/sykmelder</Element>
        {fåVerdiEllerManglendeOpplysninger(SykmeldingOpplysningEnum.SYKMELDER)}
      </Vis>
      <Vis hvis={vårSykmelding === undefined}>
        <Normaltekst>
          Vi kunne dessverre ikke hente opplysninger fra sykmeldingen din, prøv igjen senere
        </Normaltekst>
      </Vis>
    </div>
  );
};

export default SykmeldingOpplysninger;