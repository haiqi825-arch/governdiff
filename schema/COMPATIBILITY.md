# GovernDiff schema compatibility policy

GovernDiff publishes independent versioned contracts for analysis reports,
portable reviews, waiver files, and aggregate Action runs. Their current
identifiers are:

- report `1.5`;
- review `governdiff-review/1.1`;
- waiver `governdiff-waiver/1.0`.
- Action manifest `governdiff-action/1.0`.

## Compatible 1.x changes

A 1.x minor release may add optional object properties, new enum values whose
consumers are required to treat as unknown, new diagnostic codes, and new
optional report filters. Existing required fields do not change meaning or
type. Consumers should ignore unknown optional properties and preserve unknown
review or waiver metadata when round-tripping files.

GovernDiff keeps reading the immediately preceding 1.x review and waiver shape
for at least one minor release. The legacy waiver key `approver` is accepted by
the 0.6 loader as an alias for canonical `approved_by`, but all newly generated
files use `approved_by`.

## Deprecation

A field is documented as deprecated for at least one minor release before it is
removed from a supported 1.x reader. Deprecation notices identify the replacement
and the earliest removal release. Published schema files and examples are never
silently replaced under the same versioned identifier.

## When 2.0 is required

GovernDiff uses a 2.0 contract when a required field is removed or renamed, a
field changes type or meaning, a review/waiver state changes semantics, or a
previously valid document must become invalid without an additive migration.
The migration guide must describe lossless and lossy cases, and the CLI must
reject unsupported major versions with an actionable error.
