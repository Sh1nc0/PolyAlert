# Poly Alert

## Sommaire

- [Poly Alert](#poly-alert)
  - [Sommaire](#sommaire)
  - [Contexte](#contexte)
  - [Installation](#installation)
    - [Tests](#tests)
  - [Architecture](#architecture)
  - [Technologies utilisées](#technologies-utilisées)
  - [Routes](#routes)
    - [Client](#client)
    - [API endpoints](#api-endpoints)
      - [POST `/api/login`](#post-apilogin)
      - [**POST** `/api/logout`](#post-apilogout)
      - [**GET** `/api/user`](#get-apiuser)
      - [**GET** `/api/user/:id`](#get-apiuserid)
      - [**PATCH** `/api/user/:id`](#patch-apiuserid)
      - [**GET** `/api/report`](#get-apireport)
      - [**POST** `/api/report`](#post-apireport)
      - [**GET** `/api/issue`](#get-apiissue)
      - [**POST** `/api/issue`](#post-apiissue)
      - [**POST** `/api/issues/:issueID/handle`](#post-apiissuesissueidhandle)
      - [**POST** `/api/issues/:issueID/close`](#post-apiissuesissueidclose)
      - [**DELETE** `/api/issues/:issueID`](#delete-apiissuesissueid)
      - [**GET** `/api/issues/:issueID/messages`](#get-apiissuesissueidmessages)
      - [**POST** `/api/issues/:issueID/messages`](#post-apiissuesissueidmessages)
  - [CI/CD](#cicd)



## Contexte

Ceci est la troisième phase du projet conception web.
Mon équipe (3D) et moi sommes chargé du développement du Sujet n°1: **Outil de signalement des problèmes techniques sur le campus**.
Pour ce faire nous avons récupérer le travail du 1er groupe (3B) qui à realisé le design de l'application. Nous avons également récupéré le travail du 2ème groupe (3C) qui c'est chargé de la conception de l'application (Les différentes fonctionnalité à implémenter, les routes de l'api, etc.).


## Installation

```bash
$ npm install
$ npm run createDB
$ npm run start
```

OU via docker:

Il faut installer docker et docker-compose.

Pour lancer et build l'image docker:
```bash
$ docker build -t poly-alert .
$ docker run -p 8080:8080 poly-alert
```

Pour lancer sans build l'image docker:
```bash
$ docker-compose up
```

Ensuite rendez vous sur `http://localhost:8080`. Vous pouvez vous conncter avec les identifiants suivants:
- Technicien:
  - email: `admin`
  - password: `admin`

- Utilisateur:
  - email: `etudiant`
  - password: `etudiant`

### Tests

```bash
$ npm run test
```
Ceci lancera les tests des differents endpoints de l'api.

## Architecture

```
.
|-- admin           # Les pages accessibles seulement par les admins ('Technicien')
|-- api
|   |-- routes      # Les routes de l'api et la logique associée
|   |-- schemas     # Les schemas de validation des données d'entrée
|
|-- auth            # La logique d'authentification passport JS
|-- data            # Les fichiers relatifs à la base de données, pour la créer, récuperer les données, etc.
|-- private         # Les pages accessibles seulement par les utilisateurs authentifiés
|-- public          # la page de connexion et les fichiers statiques
|-- Tests
|   |-- api         # Les tests des differents endpoints de l'api

```

## Technologies utilisées

- [Connect-SQLite3](https://www.npmjs.com/package/connect-sqlite3): Pour la gestion des sessions et la persistance des données
- [Express](https://expressjs.com/): Pour le serveur
- [Express-Validator](https://express-validator.github.io/docs/): Pour valider les données d'entrée de l'api
- [Gulp](https://gulpjs.com/): Pour le linting et le formatage du code
- [Jest](https://jestjs.io/): Pour les tests
- [Passport JS](http://www.passportjs.org/): Pour l'authentification
- [Socket.io](https://socket.io/): Utilisé pour la messagerie temps réel
- [SQLite3](https://www.sqlite.org): Pour la base de données
- [Supertest](https://www.npmjs.com/package/supertest): Pour les tests de l'api utilisé avec Jest

## Routes

### Client

- `/`: Page d'accueil (accessible en étant authentifié)
- `/login`: Page de connexion
- `/report`: Page de signalement d'un problème technique (accessible en étant authentifié)
- `/issue?id=issueID`: Page d'un problème technique (accessible en étant authentifié)
- `/my-issues`: Page de la liste des problèmes techniques que l'utilisateur à signalé (accessible en étant authentifié)
- `/manage-issues`: Page de la liste des problèmes techniques (accessible en étant authentifié et en étant un technicien)
- `/manage-issue?id=issueID`: Page pour prendre en charge un problème technique, communiquer avec l'utilisateur qui à signalé le problème et fermer le problème (accessible en étant authentifié et en étant un technicien)

### API endpoints

#### POST `/api/login`
Permet de se connecter

**Status code:** 200

#### **POST** `/api/logout`
Permet de se déconnecter

**Status code:** 204

#### **GET** `/api/user`
Retourne la liste de tous les utilisateurs et leurs informations

**Status code:** 200

#### **GET** `/api/user/:id`
Retourne les informations de l'utilisateur avec l'id `:id`

**Status code:** 200

#### **PATCH** `/api/user/:id`
Met à jour les informations de l'utilisateur avec l'id `:id`

**Status code:** 204

**Payload:**
```json
{
  "lastname": "String",
  "firstname": "String",
  "email": "String",
  "password": "String",
  "type": "Int"
}
```
On peut envoyer uniquement les champs que l'on souhaite mettre à jour. Ou bien tous les champs.

#### **GET** `/api/report`
Retourne la liste de tous les signalements contre les utilisateurs qui ont été signalés pour faux signalement d'un problème technique

**Status code:** 200

**Query params:**

- `reportedID`: Les signalements contre l'utilisateur avec l'id `reportedID`
- `reporterID`: Les signalements de l'utilisateur avec l'id `reporterID`
- `issueID`: Les signalements utilisateur sur un problème technique avec l'id `issueID`

#### **POST** `/api/report`
Permet de signaler un utilisateur pour faux signalement d'un problème technique

**Status code:** 201

**Payload:**
```json
{
  "issueID": "Int",
  "reportedID": "String",
  "reporterID": "String",
  "reason": "String"
}
```
#### **GET** `/api/issue`
Retourne la liste de tous les problèmes techniques signalés.

**Status code:** 200

**Query params:**

- `userID`: Les problèmes techniques signalés par l'utilisateur avec l'id `userID`
- `technicianID`: Les problèmes techniques pris en charge par le technicien avec l'id `technicianID`
- `ìssueID`: Le problème technique avec l'id `issueID`

#### **POST** `/api/issue`

Permet de signaler un problème technique.

**Status code:** 201

**Payload:**
```json
{
  "userID": "String",
  "technicianID": "String",
  "title": "String",
  "description": "String",
  "location": "String",
  "type": "Int",
  "criticity": "Int",
  "anonymous": "Boolean"
}
```

#### **POST** `/api/issues/:issueID/handle`
Permet de prendre en charge un problème technique.

**Status code:** 204

**Payload:**
```json
{
  "technicianID": "String"
}
```

#### **POST** `/api/issues/:issueID/close`
Permet de fermer un problème technique.

**Status code:** 204

#### **DELETE** `/api/issues/:issueID`
Permet de supprimer un problème technique.

**Status code:** 204

#### **GET** `/api/issues/:issueID/messages`
Retourne la liste de tous les messages envoyé du problème technique avec l'id `issueID`.

**Status code:** 200

#### **POST** `/api/issues/:issueID/messages`
Envoie un message au problème technique avec l'id `issueID`.

**Status code:** 201

**Payload:**
```json
{
  "authorID": "String",
  "content": "String"
}
```


## CI/CD

On a mis en place un pipeline CI/CD gitlab qui permet de lancer automatiquement le linter gulp et les tests jest à chaque push. Cela permet de s'assurer que le code est bien formaté et qu'il fonctionne correctement avant d'étre merge sur main.
Il aurait été possible d'aller plus loin en déployant automatiquement l'application sur un serveur de test à chaque merge sur main. Cela aurait permis de s'assurer que l'application fonctionne. Cependant nous avons pas de serveur sur lequel déployer l'application.
