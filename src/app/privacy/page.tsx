import type { Metadata } from 'next';
import { LegalPage } from '@/components/shared/LegalPage';
import { whatsappLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy — CosmoLink',
  description: 'Come CosmoLink tratta i dati personali di chi crea una pagina e di chi la visita.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Informativa sulla privacy" updated="14 novembre 2026">
      <section>
        <h2>Chi tratta i tuoi dati</h2>
        <p>
          Il titolare del trattamento è Daniele Spalletti (CosmoNet), con sede a Spoleto (PG), Italia.
          CosmoLink è un servizio del progetto{' '}
          <a href="https://www.cosmonet.info/" target="_blank" rel="noopener noreferrer">CosmoNet</a>.
          Per qualsiasi richiesta sui dati puoi scriverci su{' '}
          <a href={whatsappLink('Ciao, ho una richiesta sulla privacy di CosmoLink')} target="_blank" rel="noopener noreferrer">WhatsApp</a>{' '}
          o dal sito CosmoNet. Rispondiamo entro 30 giorni.
        </p>
      </section>

      <section>
        <h2>Quali dati raccogliamo</h2>
        <ul>
          <li>
            <strong>Account:</strong> email, nome utente e password (gestita da un servizio di autenticazione che non
            conserva la password in chiaro). Se accedi con Google riceviamo il nome e l&apos;email del tuo profilo Google.
          </li>
          <li>
            <strong>Contenuti della tua pagina:</strong> nome visualizzato, descrizione, immagine del profilo, link,
            icone social e tema scelto. Questi dati sono pubblici: chiunque conosca il tuo indirizzo può vederli, quindi
            non inserire informazioni che non vuoi rendere visibili.
          </li>
          <li>
            <strong>Statistiche di chi visita la tua pagina:</strong> quando qualcuno apre una pagina o clicca un link
            registriamo data e ora, tipo di dispositivo (cellulare, computer, tablet), browser e sito di provenienza.
            Non salviamo l&apos;indirizzo IP nel nostro database e non identifichiamo i singoli visitatori.
          </li>
          <li>
            <strong>Piano PRO:</strong> se passi a PRO, memorizziamo il piano attivo sul tuo profilo. L&apos;attivazione
            avviene su richiesta, ad esempio via WhatsApp, e non raccogliamo dati di carte o conti bancari sul sito.
          </li>
        </ul>
        <p>
          I dati dell&apos;account e della pagina servono a fornire il servizio: senza di essi non possiamo creare la tua
          pagina.
        </p>
      </section>

      <section>
        <h2>Indirizzo IP</h2>
        <p>
          Per limitare gli abusi (ad esempio richieste ripetute alle statistiche) l&apos;indirizzo IP viene letto per
          pochi istanti e tenuto solo in memoria, senza essere salvato. I fornitori di hosting e database, come ogni
          servizio web, possono registrare l&apos;IP nei propri log tecnici secondo le loro informative.
        </p>
      </section>

      <section>
        <h2>Perché li usiamo e su quale base</h2>
        <ul>
          <li>Per fornirti il servizio (creare e mostrare la tua pagina, farti accedere): esecuzione del contratto.</li>
          <li>Per mostrarti le statistiche della tua pagina e proteggere il servizio da abusi: legittimo interesse.</li>
          <li>Per l&apos;accesso con Google: il tuo consenso, che dai scegliendo quel metodo di accesso.</li>
        </ul>
        <p>Non vendiamo i tuoi dati e non li usiamo per pubblicità o profilazione.</p>
      </section>

      <section>
        <h2>Cookie</h2>
        <p>
          Usiamo solo cookie tecnici necessari per mantenerti connesso. Non usiamo cookie di profilazione né
          pubblicitari, quindi non serve un banner di consenso.
        </p>
      </section>

      <section>
        <h2>Servizi esterni</h2>
        <p>Per far funzionare CosmoLink ci appoggiamo a questi fornitori:</p>
        <ul>
          <li>Vercel, per l&apos;hosting del sito.</li>
          <li>Supabase, per database, autenticazione e archiviazione delle immagini (server in Europa, Irlanda).</li>
          <li>Google, solo se scegli di accedere con il tuo account Google.</li>
          <li>WhatsApp (Meta), solo se ci scrivi lì per richieste o per attivare il piano PRO.</li>
        </ul>
        <p>
          Per mostrare le icone dei link, la pagina carica immagini da Simple Icons e dal servizio di icone dei siti di
          Google. Questi servizi possono ricevere l&apos;indirizzo IP di chi visita la pagina.
        </p>
        <p>
          Alcuni fornitori hanno sede negli Stati Uniti, quindi i dati possono essere trattati fuori dallo Spazio
          economico europeo. In questo caso i fornitori dichiarano di basarsi sulle garanzie previste dal GDPR, come le
          clausole contrattuali standard o il Data Privacy Framework UE-USA.
        </p>
      </section>

      <section>
        <h2>Per quanto tempo conserviamo i dati</h2>
        <p>
          Finché il tuo account resta attivo. Se chiedi di cancellarlo, eliminiamo account, pagina, link e statistiche
          collegate. Eventuali copie di sicurezza presso i fornitori vengono sovrascritte nei loro tempi ordinari. I
          log tecnici dei fornitori seguono le loro regole di conservazione.
        </p>
      </section>

      <section>
        <h2>I tuoi diritti</h2>
        <p>
          Puoi chiederci di accedere ai tuoi dati, correggerli, cancellarli, limitarne il trattamento, riceverli in un
          formato portabile o opporti al trattamento. Per la cancellazione dell&apos;account scrivici ai contatti
          indicati sopra, dal tuo indirizzo di registrazione. Puoi anche presentare reclamo al{' '}
          <a href="https://www.garanteprivacy.it/" target="_blank" rel="noopener noreferrer">Garante per la protezione dei dati personali</a>.
        </p>
      </section>

      <section>
        <h2>Minori</h2>
        <p>
          CosmoLink non è pensato per chi ha meno di 14 anni. Se pensi che un minore di quell&apos;età si sia
          registrato, scrivici e cancelleremo l&apos;account.
        </p>
      </section>

      <section>
        <h2>Modifiche</h2>
        <p>
          Se cambieremo qualcosa di importante aggiorneremo questa pagina e la data in alto.
        </p>
      </section>
    </LegalPage>
  );
}
