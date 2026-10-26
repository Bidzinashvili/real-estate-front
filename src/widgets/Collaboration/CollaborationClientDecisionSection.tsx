import Link from "next/link";
import type { CollaborationClient } from "@/features/collaboration/collaborationApi.types";
import { mapCollaborationRequirementsToClientRequirements } from "@/features/collaboration/collaborationClientRequirements";
import { collaborationClientHasRevealedContact } from "@/features/collaboration/collaborationClientContact";
import {
  formatClientBudgetAmount,
  parseClientBudgetCurrency,
} from "@/features/clients/clientBudgetCurrency";
import { formatClientPetDisplay } from "@/features/clients/clientRequirementValues";
import {
  CLIENT_STATUS_LABELS,
  DEAL_TYPE_LABELS,
  lookupEnumLabel,
} from "@/shared/i18n/enumLabels";
import { ClientDetailsRequirementsSection } from "@/widgets/ClientDetails/ClientDetailsRequirementsSection";

type CollaborationClientDecisionSectionProps = {
  clientRecord: CollaborationClient;
  showClientLink: boolean;
};

function noopLockChange(): void {}

function readOnlyLock(): "none" {
  return "none";
}

export function CollaborationClientDecisionSection({
  clientRecord,
  showClientLink,
}: CollaborationClientDecisionSectionProps) {
  const requirements = mapCollaborationRequirementsToClientRequirements(
    clientRecord.id,
    clientRecord.requirements,
  );
  const budgetCurrency = parseClientBudgetCurrency(clientRecord.budgetCurrency);
  const contactRevealed = collaborationClientHasRevealedContact(clientRecord);
  const trimmedPublicComment = clientRecord.publicComment?.trim() ?? "";

  return (
    <section className="space-y-4 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">კლიენტის მოთხოვნა</h2>
        <p className="text-xs text-muted-foreground">
          გადააწყვიტეთ თანამშრომლობა კლიენტის მოთხოვნების მიხედვით.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {clientRecord.dealType ? (
          <div>
            <p className="text-xs text-muted-foreground">გარიგების ტიპი</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {lookupEnumLabel(DEAL_TYPE_LABELS, clientRecord.dealType) ??
                clientRecord.dealType}
            </p>
          </div>
        ) : null}
        {clientRecord.status ? (
          <div>
            <p className="text-xs text-muted-foreground">სტატუსი</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {lookupEnumLabel(CLIENT_STATUS_LABELS, clientRecord.status) ??
                clientRecord.status}
            </p>
          </div>
        ) : null}
        {clientRecord.budgetMin !== undefined && clientRecord.budgetMin !== null ? (
          <div>
            <p className="text-xs text-muted-foreground">მინ. ბიუჯეტი</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {formatClientBudgetAmount(clientRecord.budgetMin, budgetCurrency)}
            </p>
          </div>
        ) : null}
        {clientRecord.budgetMax !== undefined && clientRecord.budgetMax !== null ? (
          <div>
            <p className="text-xs text-muted-foreground">მაქს. ბიუჯეტი</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {formatClientBudgetAmount(clientRecord.budgetMax, budgetCurrency)}
            </p>
          </div>
        ) : null}
        {formatClientPetDisplay(clientRecord.pet) ? (
          <div>
            <p className="text-xs text-muted-foreground">შინაური ცხოველი</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {formatClientPetDisplay(clientRecord.pet)}
            </p>
          </div>
        ) : null}
      </div>

      {clientRecord.districts && clientRecord.districts.length > 0 ? (
        <div>
          <p className="text-xs text-muted-foreground">უბნები</p>
          <div className="mt-1 space-y-0.5">
            {clientRecord.districts.map((district, districtIndex) => (
              <p key={districtIndex} className="text-sm text-foreground">
                {district}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {clientRecord.addresses && clientRecord.addresses.length > 0 ? (
        <div>
          <p className="text-xs text-muted-foreground">მისამართები</p>
          <div className="mt-1 space-y-0.5">
            {clientRecord.addresses.map((address, addressIndex) => (
              <p key={addressIndex} className="text-sm text-foreground">
                {address}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {requirements ? (
        <ClientDetailsRequirementsSection
          requirements={requirements}
          getLock={readOnlyLock}
          onLockChange={noopLockChange}
          showLockControls={false}
        />
      ) : null}

      {trimmedPublicComment !== "" ? (
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground">საჯარო კომენტარი</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
            {trimmedPublicComment}
          </p>
        </div>
      ) : null}

      {contactRevealed ? (
        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">საკონტაქტო ინფორმაცია</p>
          {clientRecord.name?.trim() ? (
            <p className="text-sm font-medium text-foreground">{clientRecord.name.trim()}</p>
          ) : null}
          {clientRecord.phones && clientRecord.phones.length > 0 ? (
            <p className="text-sm text-foreground">{clientRecord.phones.join(", ")}</p>
          ) : null}
          {clientRecord.whatsapp?.trim() ? (
            <p className="text-xs text-muted-foreground">WhatsApp: {clientRecord.whatsapp}</p>
          ) : null}
        </div>
      ) : null}

      {showClientLink && contactRevealed ? (
        <Link
          href={`/clients/${clientRecord.id}`}
          className="inline-flex text-sm font-medium text-foreground underline-offset-2 hover:underline"
        >
          კლიენტის გახსნა
        </Link>
      ) : null}
    </section>
  );
}
