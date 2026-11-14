import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/shared/LegalPage';
import { PRICING, whatsappLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Termini di servizio — CosmoLink',
  description: 'Le regole per usare CosmoLink, i piani Free e PRO e i contenuti consentiti.',
};

export default function TerminiPage() {
  return (
    <LegalPage title="Termini di servizio" updated="14 novembre 2026">
      <section>
        <h2>Il servizio</h2>
        <p>
          CosmoLink permette di creare una pagina personale con i propri link, con statistiche e QR Code. Il servizio è
          offerto da Daniele Spalletti (CosmoNet), Spoleto (PG), Italia. Usandolo accetti queste regole e la nostra{' '}
          <Link href="/privacy">informativa sulla privacy</Link>.
        </p>
      </section>

      <section>
        <h2>Il tuo account</h2>
        <ul>
          <li>Devi fornire un indirizzo email valido e custodire le tue credenziali.</li>
          <li>Sei responsabile di ciò che accade con il tuo account.</li>
          <li>Puoi chiedere in qualsiasi momento la cancellazione dell&apos;account.</li>
        </ul>
      </section>

      <section>
        <h2>Contenuti consentiti</h2>
        <p>Sei responsabile dei link e dei contenuti che pubblichi. Non sono ammessi:</p>
        <ul>
          <li>link a contenuti illegali, truffe, phishing, malware o siti che imitano altri siti;</li>
          <li>contenuti che violano diritti d&apos;autore o altri diritti di terzi;</li>
          <li>contenuti offensivi, discriminatori, violenti o a sfondo sessuale esplicito;</li>
          <li>spam o l&apos;uso della pagina per ingannare altre persone.</li>
        </ul>
        <p>
          Possiamo rimuovere contenuti o sospendere account che non rispettano queste regole, in particolare se c&apos;è un
          rischio per altre persone.
        </p>
      </section>

      <section>
        <h2>Piani Free e PRO</h2>
        <ul>
          <li>Il piano Free è gratuito e non richiede carta.</li>
          <li>
            Il piano PRO costa {PRICING.monthly.price} {PRICING.monthly.period} oppure {PRICING.yearly.price}{' '}
            {PRICING.yearly.period}, e sblocca link illimitati, temi esclusivi, personalizzazione completa, statistiche
            avanzate e le altre funzioni elencate nella pagina <Link href="/pricing">Prezzi</Link>.
          </li>
          <li>
            Il PRO viene attivato su richiesta, ad esempio{' '}
            <a href={whatsappLink('Ciao, voglio attivare CosmoLink PRO')} target="_blank" rel="noopener noreferrer">via WhatsApp</a>.
            Le modalità di pagamento ti vengono comunicate al momento dell&apos;attivazione.
          </li>
          <li>Funzioni e prezzi possono cambiare in futuro; se succede ti avvisiamo prima che si applichino a te.</li>
        </ul>
      </section>

      <section>
        <h2>Disponibilità del servizio</h2>
        <p>
          Facciamo il possibile perché CosmoLink funzioni sempre, ma il servizio è fornito &quot;così com&apos;è&quot; e può
          avere interruzioni o modifiche. Ti consigliamo di tenere una copia dei tuoi link.
        </p>
      </section>

      <section>
        <h2>Diritti dei consumatori e legge applicabile</h2>
        <p>
          Se sei un consumatore restano validi i diritti che la legge ti riconosce, compresi quelli previsti dal Codice
          del Consumo. Questi termini sono regolati dalla legge italiana; per i consumatori resta valido il foro del
          luogo di residenza o domicilio.
        </p>
      </section>

      <section>
        <h2>Contatti</h2>
        <p>
          Per domande o segnalazioni scrivici su{' '}
          <a href={whatsappLink('Ciao, ho una domanda su CosmoLink')} target="_blank" rel="noopener noreferrer">WhatsApp</a>{' '}
          o dal sito{' '}
          <a href="https://www.cosmonet.info/" target="_blank" rel="noopener noreferrer">CosmoNet</a>.
        </p>
      </section>
    </LegalPage>
  );
}
