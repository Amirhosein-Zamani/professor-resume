import {
  GOLESTAN_REPORT_IDS,
  GOLESTAN_PUBLICATION_REPORT_SECURITY_CODE,
} from '../modules/golestan/constants/golestan-report.constant';
import {
  buildPublicationReport1304MorXml,
  buildPublicationReport1304PriXml,
  buildPublicationReport1304PubXml,
} from '../modules/golestan/builders/publication-report-1304.builder';
import { GolestanClient } from '../modules/golestan/clients/golestan.client';
import { golestanConfig } from '../modules/golestan/configs/golestan.config';
import {
  GolestanClientError,
  GolestanXmlSerializationMode,
} from '../modules/golestan/types/golestan.type';

async function main() {
  const requestedMode =
    (process.argv[2] as GolestanXmlSerializationMode | 'both') ?? 'both';
  const modes: GolestanXmlSerializationMode[] =
    requestedMode === 'both' ? ['cdata', 'escaped'] : [requestedMode];
  const client = new GolestanClient();
  const payload = {
    login: golestanConfig.login,
    pass: golestanConfig.pass,
    sec: golestanConfig.sec || GOLESTAN_PUBLICATION_REPORT_SECURITY_CODE,
    pub: buildPublicationReport1304PubXml(),
    pri: buildPublicationReport1304PriXml(),
    mor: buildPublicationReport1304MorXml(),
    iFID: GOLESTAN_REPORT_IDS.PUBLICATIONS,
  };

  for (const mode of modes) {
    try {
      const result = await client.callReport(golestanConfig.baseUrl, payload, {
        xmlMode: mode,
      });

      console.log(
        JSON.stringify(
          {
            mode,
            status: result.diagnostics.status,
            durationMs: result.diagnostics.durationMs,
            rawResponse: result.responseBody,
          },
          null,
          2,
        ),
      );
    } catch (error) {
      if (error instanceof GolestanClientError) {
        console.log(
          JSON.stringify(
            {
              mode,
              classification: error.kind,
              status: error.diagnostics.status,
              durationMs: error.diagnostics.durationMs,
              rawResponse: error.diagnostics.responseBody,
              error: error.diagnostics.error,
            },
            null,
            2,
          ),
        );
        continue;
      }

      throw error;
    }
  }
}

void main();
