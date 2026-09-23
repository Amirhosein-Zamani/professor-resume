import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { parseStringPromise } from 'xml2js';
import { PrismaService } from '../../../database';
import { GolestanClient } from '../clients/golestan.client';
import { golestanConfig } from '../configs/golestan.config';
import {
  GOLESTAN_PUBLICATION_REPORT_SECURITY_CODE,
  GOLESTAN_REPORT_IDS,
} from '../constants/golestan-report.constant';
import {
  buildPublicationReport1304MorXml,
  buildPublicationReport1304PriXml,
  buildPublicationReport1304PubXml,
} from '../builders/publication-report-1304.builder';
import {
  GolestanCallResult,
  GolestanClientError,
  GolestanXmlSerializationMode,
} from '../types/golestan.type';

type ProbeMode = GolestanXmlSerializationMode | 'both';
type GolestanRow = Record<string, string | undefined>;
type GolestanSoapFaultNode = {
  faultstring?: string;
  faultcode?: string;
};
type GolestanParsedResponse = {
  'soap:Envelope'?: {
    'soap:Body'?: {
      golInfoResponse?: {
        golInfoResult?: {
          Root?: {
            N?: GolestanRow | GolestanRow[];
          };
        };
      };
      'soap:Fault'?: GolestanSoapFaultNode;
      Fault?: GolestanSoapFaultNode;
    };
  };
};

interface GolestanProbeResult {
  mode: GolestanXmlSerializationMode;
  classification:
    | 'ok'
    | 'timeout'
    | 'network'
    | 'http'
    | 'soap_fault'
    | 'empty_root'
    | 'parse_error'
    | 'unknown';
  durationMs: number;
  status?: number;
  rowCount?: number;
  soapFault?: string;
}

@Injectable()
export class GolestanPublicationService {
  private readonly logger = new Logger(GolestanPublicationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly golestanClient: GolestanClient,
  ) {}

  private buildRequestPayload() {
    return {
      login: golestanConfig.login,
      pass: golestanConfig.pass,
      sec: golestanConfig.sec || GOLESTAN_PUBLICATION_REPORT_SECURITY_CODE,
      pub: buildPublicationReport1304PubXml(),
      pri: buildPublicationReport1304PriXml(),
      mor: buildPublicationReport1304MorXml(),
      iFID: GOLESTAN_REPORT_IDS.PUBLICATIONS,
    };
  }

  private extractRows(parsed: GolestanParsedResponse): GolestanRow[] {
    const rows =
      parsed?.['soap:Envelope']?.['soap:Body']?.golInfoResponse?.golInfoResult
        ?.Root?.N;

    if (!rows) {
      return [];
    }

    return Array.isArray(rows) ? rows : [rows];
  }

  private extractSoapFault(parsed: GolestanParsedResponse): string | null {
    const fault =
      parsed?.['soap:Envelope']?.['soap:Body']?.['soap:Fault'] ??
      parsed?.['soap:Envelope']?.['soap:Body']?.Fault;

    if (!fault) {
      return null;
    }

    return fault.faultstring ?? fault.faultcode ?? 'Unknown SOAP fault';
  }

  private async parseReportResponse(
    response: GolestanCallResult,
  ): Promise<{ rows: GolestanRow[]; soapFault: string | null }> {
    const parsedUnknown: unknown = await parseStringPromise(
      response.responseBody,
      {
        explicitArray: false,
        mergeAttrs: true,
        trim: true,
      },
    );
    const parsed = parsedUnknown as GolestanParsedResponse;

    return {
      rows: this.extractRows(parsed),
      soapFault: this.extractSoapFault(parsed),
    };
  }

  private toNullable(value: string | undefined): string | null {
    return value || null;
  }

  private toFacultyName(row: GolestanRow): string {
    return this.toNullable(row['4']) ?? 'نامشخص';
  }

  private toProfessorRelationData(row: GolestanRow) {
    const facultyName = this.toFacultyName(row);

    return {
      faculty: facultyName,
      facultyName,
      facultyRecord: {
        connectOrCreate: {
          where: { name: facultyName },
          create: { name: facultyName },
        },
      },
    };
  }

  private async upsertPublicationRow(row: GolestanRow): Promise<void> {
    const professorNo = row['10'];
    const articleNo = row['3'];

    if (!articleNo) {
      this.logger.warn('Skipping a Golestan row with no article number.');
      return;
    }

    const professor = professorNo
      ? await this.prisma.professor.upsert({
          where: { golestanProfessorNo: professorNo },
          update: {
            ...this.toProfessorRelationData(row),
            employeeNo: this.toNullable(row['11']),
            studentNo: this.toNullable(row['12']),
            researchGroupName: this.toNullable(row['6']),
            organizationName: this.toNullable(row['8']),
          },
          create: {
            slug: `golestan-${professorNo}`,
            firstName: 'نامشخص',
            lastName: professorNo,
            displayName: `استاد ${professorNo}`,
            rank: 'نامشخص',
            ...this.toProfessorRelationData(row),
            isFaculty: true,
            avatar: '/Images/professors/default-avatar.png',
            golestanProfessorNo: professorNo,
            employeeNo: this.toNullable(row['11']),
            studentNo: this.toNullable(row['12']),
            researchGroupName: this.toNullable(row['6']),
            organizationName: this.toNullable(row['8']),
          },
        })
      : null;

    await this.prisma.publication.upsert({
      where: { golestanArticleNo: articleNo },
      update: {
        printPlace: this.toNullable(row['2']),
        language: this.toNullable(row['22']),
        journalArticleType: this.toNullable(row['24']),
        latinJournalOrConfTitle: this.toNullable(row['26']),
        persianJournalOrConfTitle: this.toNullable(row['28']),
        professorId: professor?.id ?? null,
        rawData: row,
      },
      create: {
        golestanArticleNo: articleNo,
        printPlace: this.toNullable(row['2']),
        language: this.toNullable(row['22']),
        journalArticleType: this.toNullable(row['24']),
        latinJournalOrConfTitle: this.toNullable(row['26']),
        persianJournalOrConfTitle: this.toNullable(row['28']),
        professorId: professor?.id ?? null,
        rawData: row,
      },
    });
  }

  private toProbeResult(
    mode: GolestanXmlSerializationMode,
    response: GolestanCallResult,
    parsed: { rows: GolestanRow[]; soapFault: string | null },
  ): GolestanProbeResult {
    if (parsed.soapFault) {
      return {
        mode,
        classification: 'soap_fault',
        durationMs: response.diagnostics.durationMs,
        status: response.diagnostics.status,
        soapFault: parsed.soapFault,
      };
    }

    if (parsed.rows.length === 0) {
      return {
        mode,
        classification: 'empty_root',
        durationMs: response.diagnostics.durationMs,
        status: response.diagnostics.status,
        rowCount: 0,
      };
    }

    return {
      mode,
      classification: 'ok',
      durationMs: response.diagnostics.durationMs,
      status: response.diagnostics.status,
      rowCount: parsed.rows.length,
    };
  }

  async probePublications(mode: ProbeMode = 'both'): Promise<{
    baseUrl: string;
    results: GolestanProbeResult[];
  }> {
    const modes: GolestanXmlSerializationMode[] =
      mode === 'both' ? ['cdata', 'escaped'] : [mode];
    const payload = this.buildRequestPayload();
    const results: GolestanProbeResult[] = [];

    for (const currentMode of modes) {
      try {
        const response = await this.golestanClient.callReport(
          golestanConfig.baseUrl,
          payload,
          { xmlMode: currentMode },
        );
        const parsed = await this.parseReportResponse(response);

        results.push(this.toProbeResult(currentMode, response, parsed));
      } catch (error) {
        if (error instanceof GolestanClientError) {
          results.push({
            mode: currentMode,
            classification: error.kind,
            durationMs: error.diagnostics.durationMs,
            status: error.diagnostics.status,
          });
          continue;
        }

        results.push({
          mode: currentMode,
          classification: 'parse_error',
          durationMs: 0,
          soapFault: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      baseUrl: golestanConfig.baseUrl,
      results,
    };
  }

  async syncPublications(): Promise<{ synced: number }> {
    this.logger.log(
      `Starting Golestan publication sync for report ${GOLESTAN_REPORT_IDS.PUBLICATIONS}.`,
    );

    let normalizedRows: GolestanRow[];

    try {
      const response = await this.golestanClient.callReport(
        golestanConfig.baseUrl,
        this.buildRequestPayload(),
        { xmlMode: 'cdata' },
      );
      const parsed = await this.parseReportResponse(response);

      if (parsed.soapFault) {
        throw new BadGatewayException({
          message: 'Golestan returned a SOAP fault.',
          soapFault: parsed.soapFault,
        });
      }

      normalizedRows = parsed.rows;
    } catch (error) {
      if (error instanceof GolestanClientError) {
        if (error.kind === 'timeout') {
          throw new GatewayTimeoutException(
            'Golestan SOAP call timed out before returning a report.',
          );
        }

        if (error.kind === 'network') {
          throw new ServiceUnavailableException(
            'Golestan SOAP service could not be reached over the network.',
          );
        }

        throw new BadGatewayException({
          message: 'Golestan SOAP call failed.',
          kind: error.kind,
          status: error.diagnostics.status,
        });
      }

      throw error;
    }

    if (normalizedRows.length === 0) {
      this.logger.warn('Golestan returned an empty Root for report 1304.');
      return { synced: 0 };
    }

    let synced = 0;

    for (const row of normalizedRows) {
      const articleNo = row['3'];
      await this.upsertPublicationRow(row);

      if (articleNo) {
        synced++;
      }
    }

    this.logger.log(`Golestan sync completed. Total synced: ${synced}.`);

    return { synced };
  }
}
