# GovernDiff Action release policy

The composite Action has two independent compatibility labels:

- `governdiff-action/1.0` is the aggregate manifest and output contract;
- `v1` is the compatible major Action release channel.

When the repository is published, every release must first create an immutable
SemVer tag such as `v1.0.0`. The moving `v1` tag may then advance only to a
release compatible with `governdiff-action/1.x`. It must never be moved to a
breaking `v2` contract. Published SemVer tags must not be rewritten.

Consumers can choose one of three pinning levels:

```yaml
# Recommended default: compatible fixes within Action major v1.
- uses: haiqi825-arch/governdiff@v1

# Immutable release behavior.
- uses: haiqi825-arch/governdiff@v1.0.1

# Strongest supply-chain pin; update intentionally.
- uses: haiqi825-arch/governdiff@403dfa795d788e2d5aa2e5d70b9f58ff527e5dd1
```

Before advancing `v1`, maintainers must run the full Python suite, the Phase 6
real-Git integration suite, schema validation, and the checked-in GitHub-hosted
canary workflow. The release notes must name the package version, immutable
tag, Action schema, report schema, review schema, and waiver schema.

The current compatible channel is `v1`. Immutable `v1.0.1` and moving `v1` both
resolve to the tested clean-source fix commit recorded above. Future compatible
updates must repeat the same canary and supply-chain gates before `v1` moves.
