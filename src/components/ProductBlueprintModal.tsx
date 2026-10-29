import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Layers, 
  Target, 
  Compass, 
  ShieldAlert, 
  Sparkles, 
  FileCheck,
  BookOpen,
  Database,
  CheckSquare,
  ShieldCheck
} from 'lucide-react';
import { productBlueprintData } from '../data/product-blueprint';

interface ProductBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductBlueprintModal: React.FC<ProductBlueprintModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'functional' | 'nonfunctional' | 'schemas' | 'markdown'>('functional');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getFullMarkdown = () => {
    return `# Lumina Digital Library — Functional & Non-Functional Requirements & Data Schemas
*Role: Senior EdTech Product Architect*
*Application: Minimalist Distraction-Free Single-Page Web Prototype*

---

## 1. Problem Statement
${productBlueprintData.problemStatement}

---

## 2. Core Value Proposition
**Headline**: ${productBlueprintData.coreValueProposition.headline}

${productBlueprintData.coreValueProposition.pillars.map(p => `- **${p.name}**: ${p.description}`).join('\n')}

---

## 3. Functional Requirements (MVP Specifications)
${productBlueprintData.functionalRequirements.map(fr => `### ${fr.id}: ${fr.title}
- **Description**: ${fr.description}
- **Acceptance Criteria**:
${fr.acceptanceCriteria.map(ac => `  - [x] ${ac}`).join('\n')}
`).join('\n')}

---

## 4. Non-Functional Requirements
${productBlueprintData.nonFunctionalRequirements.map(nfr => `### ${nfr.id} [${nfr.category}]
- **Requirement**: ${nfr.requirement}
- **Target Metric**: ${nfr.targetMetric}
`).join('\n')}

---

## 5. Data Schemas
${productBlueprintData.dataSchemas.map(schema => `### ${schema.name} (Storage: ${schema.storageTarget})
*${schema.description}*

| Field Name | Type | Required | Description |
|---|---|---|---|
${schema.fields.map(f => `| \`${f.name}\` | \`${f.type}\` | ${f.required ? 'Yes' : 'No'} | ${f.description} |`).join('\n')}
`).join('\n')}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blueprint-modal-title"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E4DDD2] flex flex-col overflow-hidden text-[#2C2825]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E8E2D9] flex items-center justify-between bg-[#F4EFE6]/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2C2825] text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4 text-[#EADBC8]" />
            </div>
            <div>
              <h2 id="blueprint-modal-title" className="font-serif text-xl font-medium text-[#24201D] leading-tight">
                Lumina Functional & Technical Specifications
              </h2>
              <p className="text-xs text-[#78716A]">
                Senior EdTech Product Architect · Requirements, Schemas & MVP Specifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-[#DDD5C7] text-[#423C36] hover:bg-[#F2ECE1] transition-colors shadow-2xs"
              aria-label="Copy specification"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#78716A] hover:text-[#1F1B18] hover:bg-[#EAE4D9] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#E8E2D9] flex items-center gap-4 sm:gap-6 bg-[#FAF7F2] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('functional')}
            className={`py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'functional'
                ? 'border-[#2C2825] text-[#2C2825]'
                : 'border-transparent text-[#78716A] hover:text-[#2C2825]'
            }`}
          >
            Functional Requirements (FR 1-5)
          </button>
          <button
            onClick={() => setActiveTab('nonfunctional')}
            className={`py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'nonfunctional'
                ? 'border-[#2C2825] text-[#2C2825]'
                : 'border-transparent text-[#78716A] hover:text-[#2C2825]'
            }`}
          >
            Non-Functional Requirements (NFR)
          </button>
          <button
            onClick={() => setActiveTab('schemas')}
            className={`py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'schemas'
                ? 'border-[#2C2825] text-[#2C2825]'
                : 'border-transparent text-[#78716A] hover:text-[#2C2825]'
            }`}
          >
            Data Schemas & Persistence
          </button>
          <button
            onClick={() => setActiveTab('strategy')}
            className={`py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'strategy'
                ? 'border-[#2C2825] text-[#2C2825]'
                : 'border-transparent text-[#78716A] hover:text-[#2C2825]'
            }`}
          >
            Problem & Strategy
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'markdown'
                ? 'border-[#2C2825] text-[#2C2825]'
                : 'border-transparent text-[#78716A] hover:text-[#2C2825]'
            }`}
          >
            Raw Markdown Export
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
          
          {/* TAB 1: Functional Requirements */}
          {activeTab === 'functional' && (
            <div className="space-y-4">
              <div className="text-xs text-[#78716A]">
                Structured functional specifications implemented in the Lumina prototype according to the architectural brief:
              </div>

              <div className="space-y-3.5">
                {productBlueprintData.functionalRequirements.map((fr) => (
                  <div 
                    key={fr.id}
                    className="p-4 rounded-xl bg-white border border-[#EAE4D9] shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#2C2825] text-white font-mono text-[11px] font-bold">
                          {fr.id}
                        </span>
                        <h4 className="font-medium text-[#24201D] text-sm">
                          {fr.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Implemented
                      </span>
                    </div>

                    <p className="text-xs text-[#554E48] leading-relaxed">
                      {fr.description}
                    </p>

                    <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EDE7DD] space-y-1">
                      <div className="text-[11px] font-semibold text-[#8A7458] uppercase tracking-wider">
                        Acceptance Criteria:
                      </div>
                      <ul className="space-y-1 text-xs text-[#524B45]">
                        {fr.acceptanceCriteria.map((ac, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{ac}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Non-Functional Requirements */}
          {activeTab === 'nonfunctional' && (
            <div className="space-y-4">
              <div className="text-xs text-[#78716A]">
                Quality attributes, performance criteria, and usability standards governing Lumina's implementation:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {productBlueprintData.nonFunctionalRequirements.map((nfr) => (
                  <div
                    key={nfr.id}
                    className="p-4 rounded-xl bg-white border border-[#EAE4D9] shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#8A7458]">
                        {nfr.id} · {nfr.category}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-[#5F8D6E]" />
                    </div>

                    <p className="text-xs text-[#3E3833] leading-relaxed">
                      {nfr.requirement}
                    </p>

                    <div className="text-[11px] font-mono text-[#6B5A46] bg-[#FAF7F2] p-2 rounded border border-[#EDE7DD]">
                      Metric: {nfr.targetMetric}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Data Schemas */}
          {activeTab === 'schemas' && (
            <div className="space-y-5">
              <div className="text-xs text-[#78716A]">
                Data structures, entity models, and storage targets powering the single-page prototype:
              </div>

              {productBlueprintData.dataSchemas.map((schema, sIdx) => (
                <div 
                  key={sIdx}
                  className="p-4 rounded-xl bg-white border border-[#EAE4D9] shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-base font-medium text-[#221E1B]">
                        {schema.name}
                      </h4>
                      <p className="text-xs text-[#78716A]">
                        {schema.description}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono px-2 py-1 rounded bg-[#F4EFE6] text-[#695843] border border-[#DDD5C7]">
                      Storage: {schema.storageTarget}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#E8E2D9] text-[#78716A]">
                          <th className="py-2 pr-4 font-medium">Field</th>
                          <th className="py-2 pr-4 font-medium">Type</th>
                          <th className="py-2 pr-4 font-medium">Required</th>
                          <th className="py-2 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2ECE1]">
                        {schema.fields.map((f, fIdx) => (
                          <tr key={fIdx}>
                            <td className="py-2 pr-4 font-mono font-medium text-[#2C2825]">{f.name}</td>
                            <td className="py-2 pr-4 font-mono text-[#8A7458]">{f.type}</td>
                            <td className="py-2 pr-4">{f.required ? 'Yes' : 'No'}</td>
                            <td className="py-2 text-[#5A524A]">{f.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Problem Statement & Strategy */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#F3EDE2] border border-[#E5DCce]">
                <div className="flex items-center gap-2 mb-2 text-xs font-medium tracking-wide uppercase text-[#876F53]">
                  <Target className="w-3.5 h-3.5" />
                  <span>Problem Statement</span>
                </div>
                <p className="font-serif text-lg text-[#25211E] leading-relaxed italic">
                  "{productBlueprintData.problemStatement}"
                </p>
              </div>

              <div>
                <h3 className="font-serif text-base font-semibold text-[#25211E] mb-3 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#8A7458]" />
                  <span>Core Value Proposition</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productBlueprintData.coreValueProposition.pillars.map((pillar, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white border border-[#EAE4D9]">
                      <div className="font-medium text-xs text-[#2A2623] mb-1">
                        {pillar.name}
                      </div>
                      <div className="text-xs text-[#635B53] leading-normal">
                        {pillar.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Raw Markdown */}
          {activeTab === 'markdown' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#78716A]">
                  Full technical specification ready for documentation and PRDs:
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs rounded bg-[#2C2825] text-white hover:bg-[#433D39] transition-colors"
                >
                  {copied ? 'Copied to Clipboard!' : 'Copy Document'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#23201D] text-[#ECE7DF] font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[400px]">
                {getFullMarkdown()}
              </pre>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E8E2D9] bg-[#F4EFE6]/50 flex items-center justify-between">
          <span className="text-[11px] text-[#78716A]">
            Lumina Prototype · Functional & Architectural Specifications
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-[#2C2825] text-white hover:bg-[#423C36] transition-colors shadow-2xs"
          >
            Back to Application
          </button>
        </div>

      </div>
    </div>
  );
};
