# cb-chat-01

Gestione di una web chat. Il progetto è composto da 6 parti

- #### [chat-server](chat-server/README.md)
  Modulo node per la gestione del server di chat

- #### [chat-server-test](chat-server-test/README.md)
  Applicazione di esempio per il modulo chat-server

- #### [ui-components-stencil](ui-components-stencil/readme.md)
  Modulo stencil con i componenti di UI creati per la web chat

- #### [ui-components-react](ui-components-react/README.md)
  Wrapper di stencil per react - autogenerato dalla build di ui-component-stencil

- #### [chat-web-react](chat-web-react/README.md)
  Modulo react per la gestione del frontend di chat

- #### packages  
  I moduli non sono stati pubblicati su npm e, per gestire le dipendenze tra i progetti, si sono creati i diversi package poi importati come dipendenze locali dei vari progetti.  
Soluzione ovviamente non ottimale ma usata solo a fini dell'esercitazione.

## Note di sviluppo
Per testare la piattaforma
```
git clone https://github.com/grentis/cb-chat-01.git
```

Per avviare il server di chat
```
cd cb-chat-01
cd chat-server-test
npm install
npm run start
```

Per avviare il modulo web
```
cd chat-web-react
npm install
npm run start
```

Per la gestione del "multi-pagina" (login e stanza) non è stato utilizzato il modulo routing di React per permettere l'esportazione del componente come ulteriore modulo indipendente. La gestione del cambio pagina è stata quindi sviluppata basandosi semplicemente sul submit della form di login.
  
La gestione degli utenti, delle stanze e dei messaggio è gestita in memoria dal server di chat.