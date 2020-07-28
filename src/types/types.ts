export interface Svaralternativ {
  label: string,
  value: string,
}

export interface RadioSpørsmålProps {
  tittel: string,
  name: string,
  spørsmålstekst: string,
  hjelpetekst?: string,
  svaralternativer: Svaralternativ[],
  id: string,
}

export interface CheckboxProps {
  tittel: string;
  svaralternativer: Svaralternativ[];
  id: string;
}

export interface InputProps {
  tittel: string;
  inputMode: 'numeric';
  bredde: 'fullbredde' | 'XXL' | 'XL' | 'L' | 'M' | 'S' | 'XS' | 'XXS';
  value?: number | string | undefined;
  onChange?: (s : string) => void;
  id: string;
  feil?: string;
}

export interface VeilederProps {
  hjelpetekst: string;
}
