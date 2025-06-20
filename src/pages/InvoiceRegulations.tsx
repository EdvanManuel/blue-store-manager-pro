
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Scale, Receipt } from "lucide-react";

const InvoiceRegulations = () => {
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Scale className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-dark">
          Regime Jurídico das Facturas
        </h1>
      </div>

      <Tabs defaultValue="regulations" className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-2 w-full">
          <TabsTrigger value="regulations">Regulamentações</TabsTrigger>
          <TabsTrigger value="example">Exemplo de Factura</TabsTrigger>
        </TabsList>

        <TabsContent value="regulations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Decreto Presidencial Nº149/13 de 1 de Outubro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                O Decreto Presidencial Nº149/13 de 1 de Outubro regulamenta os requisitos 
                para a emissão, conservação e arquivamento das facturas e documentos 
                equivalentes que o contribuinte deve obedecer no exercício da sua actividade 
                comercial e industrial.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">O referido diploma estabelece:</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">1. Obrigação de Emissão</p>
                    <p className="text-sm text-gray-600">
                      Todas as pessoas singulares ou colectivas, com domicílio, sede, direcção 
                      efectiva ou estabelecimento estável em Angola que procedam a transmissões 
                      onerosas de bens corpóreos ou incorpóreos e prestações de serviços devem 
                      emitir facturas ou documentos equivalentes.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">2. Dispensa de Emissão</p>
                    <p className="text-sm text-gray-600">
                      Existe dispensa de emissão de factura mas não de talão de venda ou de 
                      recibo com indicação do nome do vendedor dos bens ou prestador do serviço.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">3. Transmissão Electrónica</p>
                    <p className="text-sm text-gray-600">
                      Transmissão de bens feita através de aparelhos de distribuição automática, 
                      ou de recurso aos sistemas electrónicos.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">4. Prestação de Serviços</p>
                    <p className="text-sm text-gray-600">
                      Prestação de serviços em que seja habitual a emissão de talão, bilhete de 
                      ingresso ou de transporte, senhas, ou outro documento impresso.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <p className="font-medium">5. Valor Limite</p>
                    <p className="text-sm text-gray-600">
                      Transmissão de bens e prestações de serviços cujo valor unitário seja 
                      igual ou inferior a KZ1.000,00 (mil kwanzas).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-3">Penalidades por Não Emissão:</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <p className="text-sm">20% do valor da factura não emitida</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <p className="text-sm">40% no caso de incumprimento reiterado (mais de 4 transmissões)</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-3">Elementos Obrigatórios na Factura:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Informações da Empresa:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Nome, firma ou denominação social</li>
                      <li>• Sede ou domicílio</li>
                      <li>• Número de contribuinte</li>
                      <li>• Numeração sequencial</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Informações do Cliente:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Nome do destinatário</li>
                      <li>• Número de identificação fiscal</li>
                      <li>• Data da factura</li>
                      <li>• Discriminação dos bens/serviços</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="example">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Exemplo de Factura Conforme a Lei
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white border-2 border-gray-300 p-6 font-mono text-sm">
                <div className="border border-gray-400 p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p><strong>Nome da Empresa</strong></p>
                      <p>Morada</p>
                      <p>Telefone</p>
                      <p>Nº de Contribuinte</p>
                    </div>
                    <div className="text-right">
                      <p><strong>Nome do Cliente</strong></p>
                      <p>Morada</p>
                      <p>Telefone</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-400 pt-4 mb-4">
                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div className="border border-gray-400 p-2">
                        <p><strong>Nº</strong></p>
                        <p><strong>Requisição</strong></p>
                      </div>
                      <div className="border border-gray-400 p-2">
                        <p><strong>Moeda</strong></p>
                        <p>AKZ</p>
                      </div>
                      <div className="border border-gray-400 p-2">
                        <p><strong>Data</strong></p>
                        <p><strong>Factura</strong></p>
                      </div>
                      <div className="border border-gray-400 p-2">
                        <p><strong>Data</strong></p>
                        <p><strong>Vencimento</strong></p>
                      </div>
                      <div className="border border-gray-400 p-2">
                        <p><strong>Factura nº 1/2016</strong></p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="mb-2"><strong>Original</strong></p>
                    <div className="grid grid-cols-6 gap-1 text-xs">
                      <div className="border border-gray-400 p-1 text-center">V/Nº Contribuinte</div>
                      <div className="border border-gray-400 p-1 text-center">Desc. Cli.</div>
                      <div className="border border-gray-400 p-1 text-center">Condições de Pagamento</div>
                      <div className="border border-gray-400 p-1 text-center">Desc. Financ</div>
                      <div className="border border-gray-400 p-1 text-center">IPC</div>
                      <div className="border border-gray-400 p-1 text-center">Pag. 1/1</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="grid grid-cols-8 gap-1 text-xs border-b border-gray-400 pb-1">
                      <div className="font-bold">Cod. Artigo</div>
                      <div className="font-bold">Descrição</div>
                      <div className="font-bold">Qtd.</div>
                      <div className="font-bold">Un.</div>
                      <div className="font-bold">Pr. Unitário</div>
                      <div className="font-bold">Desc.</div>
                      <div className="font-bold">IPC</div>
                      <div className="font-bold">Total Líquido</div>
                    </div>
                    
                    {/* Empty rows for products */}
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="grid grid-cols-8 gap-1 text-xs border-b border-gray-200 py-1">
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                        <div className="border border-gray-400 p-1 text-center font-bold">Taxa</div>
                        <div className="border border-gray-400 p-1 text-center font-bold">Incidência</div>
                        <div className="border border-gray-400 p-1 text-center font-bold">Valor</div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="font-bold text-xs mb-1">Forma de Pagamento</p>
                        <p className="text-xs">Pagamento a Dinheiro</p>
                        <p className="text-xs">Coordenadas Bancárias</p>
                        <p className="text-xs ml-4">BFA (AKZ) - XXXXXX</p>
                        <p className="text-xs ml-4">BFA (USD) - YYYYYY</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Mercadoria/Serviço</span>
                          <span></span>
                        </div>
                        <div className="flex justify-between">
                          <span>Descontos Comerciais</span>
                          <span></span>
                        </div>
                        <div className="flex justify-between">
                          <span>Descontos Financeiros</span>
                          <span></span>
                        </div>
                        <div className="flex justify-between border-t border-gray-400 pt-1">
                          <span>IPC</span>
                          <span></span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-gray-400 pt-1">
                          <span>Total (AKZ)</span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs">
                    <p>Todos os bens foram colocados à disposição do adquirente na data da factura</p>
                    <p><strong>Processado por computador</strong></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceRegulations;
