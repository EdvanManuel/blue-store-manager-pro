
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Twitter } from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-dark">
        Sobre o Desenvolvedor
      </h1>
      
      <Card className="border-blue-light/30 overflow-hidden">
        <CardHeader className="blue-gradient-bg text-white text-center py-10">
          <div className="w-32 h-32 rounded-full bg-white mx-auto mb-6 flex items-center justify-center text-blue-dark text-5xl font-bold">
            EM
          </div>
          <CardTitle className="text-2xl">Edvan Manuel</CardTitle>
          <p className="text-white/80 mt-2">Desenvolvedor de Software</p>
        </CardHeader>
        <CardContent className="px-6 py-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-dark">Sobre o Projeto</h2>
            <p className="text-gray-600">
              Este sistema foi desenvolvido por Edvan Manuel para otimizar a gestão de lojas, 
              permitindo o controle eficiente de múltiplas unidades, monitoramento de estoque, 
              análise de faturamento e gestão de produtos. Com uma interface intuitiva e 
              responsiva, o sistema facilita a tomada de decisões e ajuda a maximizar os 
              resultados do seu negócio.
            </p>
          </div>
          
          <h2 className="text-xl font-semibold mb-4 text-blue-dark">Entre em Contato</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-light/20">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-light/10 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-blue-dark" />
                </div>
                <h3 className="font-medium mb-2">E-mail</h3>
                <a 
                  href="mailto:edvanmanuelmanuel@gmail.com" 
                  className="text-blue-light hover:underline hover:text-blue-dark transition-colors"
                >
                  edvanmanuelmanuel@gmail.com
                </a>
                <Button asChild className="mt-4 w-full">
                  <a href="mailto:edvanmanuelmanuel@gmail.com">
                    Enviar Email
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-blue-light/20">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-light/10 flex items-center justify-center mb-4">
                  <Twitter className="w-6 h-6 text-blue-dark" />
                </div>
                <h3 className="font-medium mb-2">X (Twitter)</h3>
                <a 
                  href="https://twitter.com/edvanmanuel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-light hover:underline hover:text-blue-dark transition-colors"
                >
                  @edvanmanuel
                </a>
                <Button asChild className="mt-4 w-full">
                  <a 
                    href="https://twitter.com/edvanmanuel"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Seguir
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-blue-light/20">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-light/10 flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-blue-dark" />
                </div>
                <h3 className="font-medium mb-2">Telefone</h3>
                <a 
                  href="tel:+244974334771"
                  className="text-blue-light hover:underline hover:text-blue-dark transition-colors"
                >
                  +244 974334771
                </a>
                <Button asChild className="mt-4 w-full">
                  <a href="tel:+244974334771">
                    Ligar
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
