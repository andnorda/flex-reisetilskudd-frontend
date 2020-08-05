import { KvitteringInterface } from './kvittering';

export interface ReisetilskuddInterface {
  fnr?: string,
  fom?: string,
  tom?: string,

  utbetalingTilArbeidsgiver?: string,

  går?: boolean,
  sykler?: boolean,
  kollektivtransport?: number,
  egenBil?: number,

  orgNavn?: string,
  orgNummer?: string,
  reisetilskuddId?: string,
  sykmeldingId?: string,

  kvitteringer: KvitteringInterface[]
}
