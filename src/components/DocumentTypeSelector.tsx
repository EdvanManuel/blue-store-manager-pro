
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Receipt, CreditCard, AlertTriangle, FileCheck, Undo } from "lucide-react";

export type DocumentType = 'factura' | 'recibo' | 'credito' | 'debito' | 'proforma' | 'devolucao';

interface DocumentTypeSelectorProps {
  selectedType: DocumentType;
  onTypeSelect: (type: DocumentType) => void;
}

const DocumentTypeSelector = ({ selectedType, onTypeSelect }: DocumentTypeSelectorProps) => {
  const documentTypes = [
    {
      value: 'factura' as DocumentType,
      label: 'Fatura',
      icon: <FileText className="h-4 w-4" />,
      description: 'Documento fiscal principal'
    },
    {
      value: 'recibo' as DocumentType,
      label: 'Recibo',
      icon: <Receipt className="h-4 w-4" />,
      description: 'Comprovativo de pagamento'
    },
    {
      value: 'credito' as DocumentType,
      label: 'Nota de Crédito',
      icon: <CreditCard className="h-4 w-4" />,
      description: 'Valor a creditar ao cliente'
    },
    {
      value: 'debito' as DocumentType,
      label: 'Nota de Débito',
      icon: <AlertTriangle className="h-4 w-4" />,
      description: 'Valor a debitar do cliente'
    },
    {
      value: 'proforma' as DocumentType,
      label: 'Fatura Pró-forma',
      icon: <FileCheck className="h-4 w-4" />,
      description: 'Cotação/Orçamento'
    },
    {
      value: 'devolucao' as DocumentType,
      label: 'Nota de Devolução',
      icon: <Undo className="h-4 w-4" />,
      description: 'Devolução de mercadoria'
    }
  ];

  const selectedDoc = documentTypes.find(doc => doc.value === selectedType);

  return (
    <div className="space-y-2">
      <Label>Tipo de Documento</Label>
      <Select value={selectedType} onValueChange={onTypeSelect}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Selecione o tipo de documento">
            {selectedDoc && (
              <div className="flex items-center gap-2">
                {selectedDoc.icon}
                <span>{selectedDoc.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {documentTypes.map((docType) => (
            <SelectItem key={docType.value} value={docType.value}>
              <div className="flex items-center gap-2">
                {docType.icon}
                <div className="flex flex-col">
                  <span>{docType.label}</span>
                  <span className="text-xs text-gray-500">{docType.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentTypeSelector;
