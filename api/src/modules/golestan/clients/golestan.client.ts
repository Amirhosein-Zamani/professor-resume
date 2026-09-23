import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  GolestanCallDiagnostics,
  GolestanCallOptions,
  GolestanCallResult,
  GolestanClientError,
  GolestanReportRequest,
  GolestanSerializedAxiosError,
  GolestanXmlSerializationMode,
} from '../types/golestan.type';

@Injectable()
export class GolestanClient {
  private static readonly SOAP_ACTION = 'urn:nowpardaz/golInfo';

  async callReport(
    baseUrl: string,
    payload: GolestanReportRequest,
    options: GolestanCallOptions = {},
  ): Promise<GolestanCallResult> {
    const url = `${baseUrl}/gservice.asmx`;
    const xmlMode = options.xmlMode ?? 'cdata';
    const timeoutMs = options.timeoutMs ?? 120000;
    const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <golInfo xmlns="urn:nowpardaz">
      <login>${this.escapeXml(payload.login)}</login>
      <pass>${this.escapeXml(payload.pass)}</pass>
      <sec>${this.escapeXml(payload.sec)}</sec>
      <pub>${this.serializeSoapXml(payload.pub, xmlMode)}</pub>
      <pri>${this.serializeSoapXml(payload.pri, xmlMode)}</pri>
      <mor>${this.serializeSoapXml(payload.mor ?? '', xmlMode)}</mor>
      <iFID>${payload.iFID}</iFID>
    </golInfo>
  </soap:Body>
</soap:Envelope>`;
    const diagnostics: GolestanCallDiagnostics = {
      url,
      soapAction: GolestanClient.SOAP_ACTION,
      xmlMode,
      durationMs: 0,
      maskedPayload: {
        ...payload,
        pass: this.maskSecret(payload.pass),
        sec: this.maskSecret(payload.sec),
      },
      requestBody: this.maskRequestBody(soapBody, payload),
    };
    const startedAt = Date.now();

    console.log('[Golestan] SOAP request', diagnostics);

    try {
      const response = await axios.post<string>(url, soapBody, {
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          SOAPAction: `"${GolestanClient.SOAP_ACTION}"`,
        },
        responseType: 'text',
        timeout: timeoutMs,
        validateStatus: () => true,
      });

      diagnostics.durationMs = Date.now() - startedAt;
      diagnostics.status = response.status;
      diagnostics.responseBody = response.data;
      diagnostics.responseHeaders = response.headers as Record<
        string,
        string | string[] | undefined
      >;

      console.log('[Golestan] SOAP response', diagnostics);

      if (response.status >= 400) {
        throw new GolestanClientError(
          'http',
          diagnostics,
          `Golestan returned HTTP ${response.status}`,
        );
      }

      return {
        responseBody: response.data,
        diagnostics,
      };
    } catch (error) {
      diagnostics.durationMs = Date.now() - startedAt;
      const serializedError = this.serializeAxiosError(error);
      diagnostics.error = serializedError;

      if (!diagnostics.status && serializedError?.status) {
        diagnostics.status = serializedError.status;
      }

      if (!diagnostics.responseBody && serializedError?.responseData) {
        diagnostics.responseBody = serializedError.responseData;
      }

      console.log('[Golestan] SOAP error', diagnostics);

      if (error instanceof GolestanClientError) {
        throw error;
      }

      throw new GolestanClientError(
        this.classifyAxiosError(serializedError),
        diagnostics,
        serializedError?.message ?? 'Unknown Golestan transport error',
      );
    }
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private serializeSoapXml(
    value: string,
    xmlMode: GolestanXmlSerializationMode,
  ): string {
    if (!value) {
      return '';
    }

    if (xmlMode === 'cdata') {
      return `<![CDATA[${value}]]>`;
    }

    return this.escapeXml(value);
  }

  private maskSecret(value: string): string {
    if (!value) {
      return '';
    }

    return '*'.repeat(Math.min(value.length, 8));
  }

  private maskRequestBody(
    soapBody: string,
    payload: GolestanReportRequest,
  ): string {
    return soapBody
      .replace(payload.pass, this.maskSecret(payload.pass))
      .replace(payload.sec, this.maskSecret(payload.sec));
  }

  private serializeAxiosError(error: unknown): GolestanSerializedAxiosError {
    if (!axios.isAxiosError(error)) {
      return {
        message: error instanceof Error ? error.message : String(error),
      };
    }

    return {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.response?.status,
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      responseHeaders: error.response?.headers as
        | Record<string, string | string[] | undefined>
        | undefined,
      responseData:
        typeof error.response?.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response?.data ?? null),
    };
  }

  private classifyAxiosError(
    error?: GolestanSerializedAxiosError,
  ): 'timeout' | 'network' | 'unknown' {
    if (!error) {
      return 'unknown';
    }

    if (error.code === 'ECONNABORTED' || /timeout/i.test(error.message)) {
      return 'timeout';
    }

    if (
      ['ECONNRESET', 'ECONNREFUSED', 'ENOTFOUND', 'EAI_AGAIN'].includes(
        error.code ?? '',
      ) ||
      /network error/i.test(error.message)
    ) {
      return 'network';
    }

    return 'unknown';
  }
}
