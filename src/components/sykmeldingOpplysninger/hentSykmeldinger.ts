import { SykmeldingOpplysningInterface } from '../../models/sykmelding';
import { logger } from '../../utils/logger';

interface Periode {
  fom: string,
  tom: string,
  reisetilskudd: boolean,
}

interface Diagnose {
  diagnose: string,
  diagnosekode: string,
  diagnosesystem: string,
}

interface Sykmelding {
  mulighetForArbeid: {
    perioder: Periode[],
    aktivitetIkkeMulig433: string[],
  },
  diagnose: {
    hoveddiagnose: Diagnose,
    bidiagnoser: Diagnose[],
  },
  mottakendeArbeidsgiver : {
    navn: string,
    virksomhetsnummer: string
  },
  bekreftelse: {
    sykmelder: string,
  }
}

type SykMeldingAPI = Sykmelding[];

const fåSykmeldingOpplysningSomInterface = (
  response : Sykmelding,
) : SykmeldingOpplysningInterface => {
  const sykmeldingOpplysninger = {
    fraDato: response?.mulighetForArbeid?.perioder[0]?.fom,
    tilDato: response?.mulighetForArbeid?.perioder[0]?.tom,
    diagnose: response?.diagnose?.hoveddiagnose?.diagnose,
    bidiagnoser: 'ADHD',
    reisetilskudd: response?.mulighetForArbeid?.perioder[0]?.reisetilskudd ? 'Reisetilskudd' : 'Ikke reisetilskudd',
    beskrivHensyn: 'Må ha eget toalett på jobb',
    arbeidsgiver: response?.mottakendeArbeidsgiver?.navn,
    sykmelder: response?.bekreftelse?.sykmelder,
    aktivitetIkkeMulig434: 'a',
  };

  return sykmeldingOpplysninger;
};

export const finnSykmeldingerMedReisetilskudd = (
  response : SykMeldingAPI,
) : SykMeldingAPI => {
  const filtrerteSykmeldinger = response.filter((sykmelding : Sykmelding) => {
    const reisetilskuddPerioder = sykmelding?.mulighetForArbeid?.perioder?.filter(
      (
        periode : Periode,
      ) => {
        if (periode?.reisetilskudd === true) {
          return true;
        }

        return false;
      });
    return reisetilskuddPerioder.length > 0;
  });
  return filtrerteSykmeldinger;
};

// TODO: Hent aktiv sykmelding
export const faaRiktigSykmelding = (
  response : SykMeldingAPI,
) : Sykmelding => response[0];

export const hentSykmeldinger = (
  settOpplysningerSykmeldinger : (s : SykmeldingOpplysningInterface[]) => void,
) : void => {
  fetch('http://localhost:1993/syforest/sykmeldinger', {
    credentials: 'include',
  })
    .then(
      (response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      },
    )
    .then((response) => finnSykmeldingerMedReisetilskudd(response))
    .then((sykmeldingerMedReisetilskudd) => faaRiktigSykmelding(sykmeldingerMedReisetilskudd))
    .then((riktigSykmelding) => fåSykmeldingOpplysningSomInterface(riktigSykmelding))
    .then((parsedOpplysninger : SykmeldingOpplysningInterface) => {
      settOpplysningerSykmeldinger([parsedOpplysninger]);
    })
    .catch((err) => logger.error(err));
};
