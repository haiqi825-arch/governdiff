import { ReviewerIcon as Icon } from "./reviewer-icon";
import { useI18n } from "../i18n";
import type { ReviewState } from "../reviewer-types";

const decisions = [
  ["confirmed", "1", "decision.confirmed"],
  ["rejected", "2", "decision.rejected"],
  ["modified", "3", "decision.modified"],
  ["waived", "4", "decision.waived"],
] as const;

export function DecisionPanel({
  state,
  note,
  approver,
  waiverExpiry,
  onDecision,
  onNote,
  onApprover,
  onWaiverExpiry,
  onGenerateWaiver,
  onDecisionAndNext,
}: {
  state: ReviewState;
  note: string;
  approver: string;
  waiverExpiry: string;
  onDecision: (state: ReviewState) => void;
  onNote: (note: string) => void;
  onApprover: (approver: string) => void;
  onWaiverExpiry: (expiry: string) => void;
  onGenerateWaiver: () => void;
  onDecisionAndNext: (state: Exclude<ReviewState, "unreviewed">) => void;
}) {
  const { t } = useI18n();
  const advanceState = state === "unreviewed" ? "confirmed" : state;
  const advanceDecision = decisions.find(([value]) => value === advanceState) ?? decisions[0];
  return (
    <aside className="decision-card" aria-label={t("decision.aria")}>
      <div className="pane-heading">
        <div>
          <span>{t("decision.title")}</span>
          <strong>{t(`state.${state}`)}</strong>
        </div>
        <span className={`review-state review-${state}`}>{t(`state.${state}`)}</span>
      </div>
      <div className="decision-stack">
        {decisions.map(([value, shortcut, labelKey]) => (
          <button
            key={value}
            aria-pressed={state === value}
            className={state === value ? `active decision-${value}` : `decision-${value}`}
            onClick={() => onDecision(value)}
          >
            <span className="keycap">{shortcut}</span>
            {t(labelKey)}
            {state === value && <Icon name="check" />}
          </button>
        ))}
      </div>
      <div className="decision-advance">
        <button
          className="button button-primary"
          aria-label={t("decision.andNext", { label: t(advanceDecision[2]) })}
          onClick={() => onDecisionAndNext(advanceState)}
        >
          <span>{t("decision.andNext", { label: t(advanceDecision[2]) })}</span>
          <Icon name="arrow" />
        </button>
        <small>{t("decision.advanceHint")}</small>
      </div>
      <label className="note-field">
        {t("decision.note")}
        <textarea
          value={note}
          onChange={(event) => onNote(event.target.value)}
          placeholder={t("decision.notePlaceholder")}
        />
      </label>

      {state === "waived" && (
        <section className="waiver-flow" aria-label={t("decision.waiverAria")}>
          <div>
            <span>{t("decision.waiveFlow")}</span>
            <strong>{t("decision.documentException")}</strong>
          </div>
          <label>
            {t("decision.approver")}
            <input
              value={approver}
              onChange={(event) => onApprover(event.target.value)}
              placeholder={t("decision.approverPlaceholder")}
            />
          </label>
          <label>
            {t("decision.expires")}
            <input
              inputMode="numeric"
              pattern="\d{4}-\d{2}-\d{2}"
              placeholder="YYYY-MM-DD"
              value={waiverExpiry}
              onChange={(event) => onWaiverExpiry(event.target.value)}
            />
          </label>
          <button className="button button-primary" onClick={onGenerateWaiver}>
            {t("decision.generateWaiver")}
          </button>
        </section>
      )}

      <button className="reset-review" onClick={() => onDecision("unreviewed")}>
        {t("decision.reset")}
      </button>
      <p className="privacy-note">
        {t("decision.privacy")}
      </p>
    </aside>
  );
}
