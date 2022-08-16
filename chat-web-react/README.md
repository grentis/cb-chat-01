# cb-chat-01/chat-web-react

Modulo react per la gestione del frontend dell'applicazione di web chat

### Installazione

1. installare il modulo tramite npm  
```
npm install ../packages/chat-web-react-0.0.1.tgz
```

2. importare il modulo all'interno della propria applicazione react  
```
import { ChatSystem } from 'chat-web-react';
```

3. aggiungere il componente nel proprio template
```
<ChatSystem server='ws://192.168.1.11:8000'></ChatSystem>
```

### Utilizzo

Passare, tramite parametro, l'url di connessione al server di chat

#### Note

Il modulo prevede anche una app di test per verificarne il funzionamento eseguibile tramite
```
npm run start
```

Ricordarsi di modificare l'url di connessione al server nel file src/App.tsx