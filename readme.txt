Commencer par git clone le repo : https://github.com/zephyr-dassouli/radixui-primitives
On a créé une branche pour chaque composant.
Choisir la branche du composant à tester avec git checkout.

1) Se rendre dans le dossier ssr-testing du repo

2) Installation de Node.js
sudo apt install npm

3) Installation de yarn
sudo npm install -g yarn

4) Setup de yarn dans le repo
sudo yarn install

5) Build du projet
sudo yarn build

6) Lancement du serveur local de test
sudo yarn start
Par défaut, le port utilisé est le 3000. Si déjà utilisé
sudo PORT=3001 yarn start

7) Test du composant associé à la branche
