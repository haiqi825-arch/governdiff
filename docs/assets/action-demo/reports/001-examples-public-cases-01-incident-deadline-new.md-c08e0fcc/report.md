# GovernDiff report

> GovernDiff provides machine-assisted document comparison and review cues. It does not constitute legal advice, a policy-effect assessment, or a compliance determination. Important changes must be verified by a person with the appropriate responsibility and expertise.

- Generator: `governdiff/0.6.0`; schema `1.5`
- Generated: `2026-08-21T13:07:56.172001+00:00`
- Scope: `all`; redacted: `no`
- Old: `examples/public-cases/01-incident-deadline/old\.md` (`55dbb4cf8170d29e82169ecbbd0962b479f649b07e0db89b992d5dd269f9947c`)
- New: `examples/public-cases/01-incident-deadline/new\.md` (`516f8aa9aa304f2789595d14160245dd816ea65b9a40ebe743e1e50f1176a65f`)
- Displayed changes: **1**
- Displayed findings: **2**
- Displayed active findings: **2**
- Highest displayed severity: **HIGH**

| Fingerprint | Review | Severity | Confidence | Check | Field | Machine → effective | Summary |
|---|---|---:|---:|---|---|---|---|
| `GVD-CA93F47FA2` | unreviewed | high | high `0.92` | `modality-strengthened` | `modality` | may → must | Normative force was strengthened\. |
| `GVD-FE2A1C4EB0` | unreviewed | high | high `0.94` | `deadline-shortened` | `deadline` | 72 hours → 24 hours | A deadline changed from 72 hours to 24 hours\. |

## `GVC-81A584FE55` — modified

Section: **Vendor incident response policy \> Notification** · confidence **HIGH** `0.92` · review **unreviewed**

### `GVD-CA93F47FA2` · modality-strengthened · HIGH

Detected a shift from permitted language to mandatory language\.

- Before: Vendors may report a security incident within 72 hours after discovery\.
- After: Vendors must report a security incident within 24 hours after discovery\.
- Review state: unreviewed
- Machine value: may → must
- Effective value: may → must

### `GVD-FE2A1C4EB0` · deadline-shortened · HIGH

A relative duration with the same unit appears once in both aligned clauses\.

- Before: Vendors may report a security incident within 72 hours after discovery\.
- After: Vendors must report a security incident within 24 hours after discovery\.
- Review state: unreviewed
- Machine value: 72 hours → 24 hours
- Effective value: 72 hours → 24 hours
