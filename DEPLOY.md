## Préparation du déploiement

Le but de cette partie sera de rendre disponible notre application de n'importe où sur internet.

On va devoir faire quelques changements en commençant par lancer la commande `npm init` à la racine du projet. Cette commande va créer un `package.json` en posant quelques questions pour personnaliser le fichier. Tu peux garder les choix par défaut en faisant Enter sur le clavier.

Toujours à la racine, on va lancer un `npm install concurrently`. Concurrently est une dépendance qui va nous permettre de lancer plusieurs scripts npm en //.

Nous allons ensuite ajouter les scripts suivants dans la partie `scripts` du fichier `package.json`:

```json
  "scripts": {
    "client-install": "npm install --prefix client",
    "server-install": "npm install --prefix server",
    "postinstall": "concurrently \"npm run server-install\" \"npm run client-install\"",
    "build": "cd client && npm run build",
    "start": "cd server && npm run start"
  }
```

Ainsi qu'une partie `engines` qui servira à la plateforme pour savoir à quel type de projet elle à affaire, dans notre cas une application NodeJS en version minimale `14.X`:

```json
  "engines": {
    "node": "14.x"
  }
```

Le script postinstall sera automatiquement lancée après avoir lancé un `npm install` à la racine, c'est une fonctionnalité permise par `npm`. ;)

Il va donc faire en sorte de lancer en // les scripts `client-install` et `server-install`... Càd lancer l'installation des dépendances dans le dossier `server` et `client` automatiquement.

Pour tourner sur notre future plateforme Heroku, nous avons ajouté deux scripts: `build` et `install` qui seront automatiquement lancé par Heroku avant de lancer l'application.

Il executera donc le script `build` en premier, qui s'occuera de lancer un `npm run build` dans le dossier `client`, puis il lancera le serveur.

Il faut donc ajouter ce script `build` dans le `package.json` du client:

```json
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
```

Cette commande `react-scripts build` va faire en sorte d'optimiser notre application React et de mettre le résultat dans le dossier `build` du `client`... Comme tu peux le constater, les fichiers sont illisibles pour nous !

## Déploiement sur Heroku

Je te laisse créer un espace sur Heroku, une plateforme où l'on peut déployer gratuitement des applications. Cette gratuité implique simplement que le nom de domaine de notre application soit postfixé de `xxxxx.herokuapp.com` et qu'au bout de 30min, l'application se met en "veille"... Autrement dit ça passe pour notre usage ! ;)
