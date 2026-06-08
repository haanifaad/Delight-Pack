const http = require('http');

const TALLY_HOST = process.env.TALLY_HOST || 'localhost';
const TALLY_PORT = parseInt(process.env.TALLY_PORT || '9000', 10);
const WEB_BACKEND_URL =
  process.env.WEB_BACKEND_URL || 'http://localhost:3000/api/auth/protected/sync-tally-to-web';
const API_SECRET = process.env.LOCAL_BRIDGE_SECRET || 'LOCAL_BRIDGE_SECRET_123';
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '60000', 10);
const TALLY_REPORT = process.env.TALLY_REPORT || 'Stock Summary';
const TALLY_COMPANY = process.env.TALLY_COMPANY || '';

function buildTallyExportXml(reportName) {
  const companyVar = TALLY_COMPANY
    ? `<SVCURRENTCOMPANY>${TALLY_COMPANY}</SVCURRENTCOMPANY>`
    : '';

  return `<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export Data</TALLYREQUEST>
    <TYPE>Data</TYPE>
    <ID>${reportName}</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <EXPLODEFLAG>Yes</EXPLODEFLAG>
        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        ${companyVar}
      </STATICVARIABLES>
      <TDL>
        <TDLMESSAGE>
          <REPORT NAME="${reportName}" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
            <FORMS>${reportName}</FORMS>
          </REPORT>
          <FORM NAME="${reportName}" ISMODIFY="No" ISFIXED="No" ISINITIALIZE="No" ISOPTION="No" ISINTERNAL="No">
            <TOPPARTS>${reportName}</TOPPARTS>
            <XMLTAG>${reportName}</XMLTAG>
          </FORM>
        </TDLMESSAGE>
      </TDL>
    </DESC>
  </BODY>
</ENVELOPE>`;
}

const TALLY_REQ_XML = buildTallyExportXml(TALLY_REPORT);

function fetchFromTally() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: TALLY_HOST, port: TALLY_PORT, method: 'POST', headers: { 'Content-Type': 'text/xml' } },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`Tally HTTP ${res.statusCode}`));
            return;
          }
          resolve(data);
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.setTimeout(30000, () => {
      req.destroy(new Error('Tally request timed out after 30s'));
    });
    req.write(TALLY_REQ_XML);
    req.end();
  });
}

async function pushToWebBackend(xmlData) {
  const response = await fetch(WEB_BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_SECRET}`,
    },
    body: JSON.stringify({ tallyXml: xmlData }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`Backend sync failed (${response.status}): ${body.error || body.detail || 'unknown'}`);
  }

  return body;
}

function isTallyError(xml) {
  if (!xml || xml.trim().length === 0) return true;
  const lower = xml.toLowerCase();
  return lower.includes('<lineerror>') || lower.includes('<errors>') || lower.includes('could not find');
}

async function syncJob() {
  try {
    console.log(`[${new Date().toISOString()}] Polling Tally Prime (${TALLY_REPORT})...`);
    const xml = await fetchFromTally();

    if (isTallyError(xml)) {
      console.warn('Tally returned an error or empty response.');
      console.warn('Response preview:', xml.slice(0, 300));
      return;
    }

    const result = await pushToWebBackend(xml);
    console.log(
      `[${new Date().toISOString()}] Synced to backend — parsed: ${result.itemsParsed}, upserted: ${result.itemsUpserted}`
    );
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Tally Bridge Error:`, err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.error('Hint: Is Tally Prime running with XML/HTTP server enabled on port 9000?');
    }
  }
}

console.log('Tally-to-Web Bridge started.');
console.log(`  Tally:      http://${TALLY_HOST}:${TALLY_PORT}`);
console.log(`  Report:     ${TALLY_REPORT}`);
console.log(`  Backend:    ${WEB_BACKEND_URL}`);
console.log(`  Interval:   ${POLL_INTERVAL_MS}ms`);
if (TALLY_COMPANY) console.log(`  Company:    ${TALLY_COMPANY}`);

setInterval(syncJob, POLL_INTERVAL_MS);
syncJob();
