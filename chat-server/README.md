# cb-chat-01/chat-server

Modulo Node.js per il servizo server di chat

### Installazione

1. installare il modulo tramite npm  
```
npm install ../packages/chat-server-1.0.0.tgz
```

2. importare il modulo all'interno della propria applicazione Node.js  
```
const WSServer = require('chat-server');
new WSServer.wsserver(8000);
```

### Utilizzo

Una volta effettuata la connessione il client dovrà "autenticarsi" tramite uno scambio di messaggi (formato JSON) con il server

```
{
    "command": "HELO",      comando di autorizzazione
    "room": "***",          nome della stanza a cui collegarsi
    "username": "***"       username da utilizzare per accedere
}
```

Appena connessi il server invierà una serie di messaggi al client

```
{
    "type": "USERS",        comando di elenco utenti connessi alla stanza
    "users":[               array di utenti connessi
        {
            "id":"158d219c-89ee",           identificativo utente
            "name":"---"                    nome utente
        }
    ],
    "uid":"158d219c-89ee"   proprio identificativo all'interno della stanza
}
```

seguito dagli ultimi 20 messaggi inseriti nella stanza

```
{
    "type": "MSG",          comando di messaggio
    "message": "---",       testo del messaggio
    "author_name": "---",   username dell'autore
    "author_uid": "---",    identificativo dell'autore
    "created_at": "---"     timestamp di invio del messaggio
}
```

Per l'invio di un nuovo messaggio il client dovrà inviare al server il seguente comando

```
{
    "command": "MSG",       comando di messaggio
    "message": "---"        testo del messaggio
}
```

### Eventi

Gli eventi di sistema verranno inviati a tutti i client connessi tramite invio di messaggi

* connessione di un nuovo utente
```
{
    "type": "CONNECTION",       comando di connessione
    "message": "---",           testo del messaggio, ininfluente in questo caso
    "author_name": "---",       username dell'utente connesso
    "author_uid": "---",        identificativo dell'utente connesso
    "created_at": "---"         timestamp di connessione
}
```

* disconnessione di un utente dalla stanza
```
{
    "type": "DISCONNECTION",    comando di disconnessione
    "message": "---",           testo del messaggio, ininfluente in questo caso
    "author_name": "---",       username dell'utente connesso
    "author_uid": "---",        identificativo dell'utente connesso
    "created_at": "---"         timestamp di disconnessione
}
```

* ricezione di un nuovo messaggio
```
{
    "type": "MSG",          comando di messaggio
    "message": "---",       testo del messaggio
    "author_name": "---",   username dell'autore
    "author_uid": "---",    identificativo dell'autore
    "created_at": "---"     timestamp di invio del messaggio
}
```

### Linter

In questo progetto è stato configurato un linter per mantenere regole di sviluppo coerenti in tutte le sue parti. Per eseguirlo
```
npm run lint
```

Anche il comando di build prevede al suo interno l'esecuzione del linter, impedendo quindi la generazione in caso di inconsistenza nel codice,

#### Note

Se in fase di autenticazione viene passato il nome di una stanza non esistente il server procederà a crearla e a permetterne l'utilizzo.

E' possibile impostare una porta diversa su cui mettersi in ascolto passando il valore come parametro.