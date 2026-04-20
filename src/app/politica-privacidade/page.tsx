import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade do ScaleMind.',
}

export default function PoliticaPrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose-content">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">
        Política de Privacidade
      </h1>

      <p className="text-sm text-gray-400 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Informações que coletamos</h2>
          <p>O ScaleMind pode coletar informações como endereço de e-mail (quando você se inscreve na newsletter), dados de navegação anônimos via Google Analytics e cookies de publicidade via Google AdSense.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Como usamos as informações</h2>
          <p>Usamos as informações coletadas para enviar a newsletter (quando solicitado), melhorar o conteúdo do blog e exibir anúncios relevantes via Google AdSense.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Google AdSense e Cookies</h2>
          <p>Este site utiliza o Google AdSense para exibir anúncios. O Google pode usar cookies para exibir anúncios baseados em visitas anteriores a este e outros sites. Você pode desativar o uso de cookies acessando as <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">Configurações de anúncios do Google</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Links de terceiros</h2>
          <p>Nosso blog pode conter links de afiliados. Isso significa que podemos receber uma comissão se você comprar um produto através de nossos links, sem custo adicional para você.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Seus direitos</h2>
          <p>Você tem o direito de solicitar acesso, correção ou exclusão dos seus dados pessoais. Entre em contato conosco através da página de contato.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Contato</h2>
          <p>Para dúvidas sobre esta política, acesse nossa <a href="/contato" className="text-brand-600 dark:text-brand-400 hover:underline">página de contato</a>.</p>
        </section>
      </div>
    </div>
  )
}
