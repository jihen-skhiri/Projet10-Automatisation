#**EcoBishBath**

EcoBlishBath est une startup de 20 personnes spécialisée dans la vente de produits de beautés éco-responsable dont le produit principal est un savon solide.

#**Prérequis**

Pour le lancement du projet vous aurez besoin de Docker, Node.js, NPM, Cypress et d'un navigateur Chrome ou FireFox recommandé.


# Installation du projet
1. Téléchargez ou clonez le dépôt
2. Depuis un terminal ouert dans le dossier du projet, lancer la commande : `sudo docker-compose up --build`
3. Ouvrez le site depuis la page http://localhost:8080 

Nb : à l'étape 2, ne pas ajouter le `sudo` si vous êtes sous Windows (sauf dernière version de Windows 11) (PowerShell ou Shell) : sudo n'existant pas et Docker Desktop configurant automatiquement Docker pour ne pas avoir besoin des droits administrateurs.

#**Procédure pour l'exécution du projet**

1. Lancer le Backend:
- Ouvrir un terminal de commande.
- Accéder au répertoire du projet cloné.
- Taper la commande suivante pour lancer le Backend: docker-compose up

2. Lancer le Frontend:
- Ouvrer un terminal de commande.
- Accéder au répertoire du projet cloné.
- Taper les commandes suivantes : npm install  npm start  

#**Procédure pour lancer les tests**

1. Installer Cypress:
- Ouvrir un terminal de commande.
- accéder au répertoire du projet cloné.
- Taper la commande suivante pour installer Cypress : npm install cypress --save-dev*

2. Ouvrir Cypress:
- Dans le terminal taper : npx cypress open

#**Procédure pour la génération du rapport**

1. Lancer les tests et générer un rapport :
-  Ouvrir un terminal de commande.
- accéder au répertoire du projet cloné.
- Taper la commande suivante pour exécuter les tests et générer le rapport : npx cypress run

#**Login**
Identifiant : test2@test.fr
Mot de passe : testtest

#**API**

lien swagger : http://localhost:8081/api/doc

#**Auteurs**
Nom et Prénom : Skhiri Jihen
Email : jihen.skhiri@gmail.com

#**Historique des versions**
Version 1.0.0 tests manuels 
Version 2.0.0 ajout de cypress, tests automatisés.

