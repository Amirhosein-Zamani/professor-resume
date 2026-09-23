export function buildGolInfoPubXml(): string {
  return `
<Root>
  <N id="2" F1="1" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="3" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="4" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="6" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="8" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="10" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="11" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="12" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="22" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="24" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="26" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="28" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="30" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="31" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
  <N id="32" F1="" T1="" F2="" T2="" A="" S="" Q="" B="" />
</Root>
`.trim();
}

export function buildGolInfoPriXml(): string {
  return `
<Root>
  <N UQID="40" id="2" F="0" T="" />
</Root>
`.trim();
}

export function buildGolInfoMorXml(): string {
  return '';
}
