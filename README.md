# automation-raci-check

**Contrôle de matrice RACI** — Vérifie une seule autorité (A) et au moins un exécutant (R) par tâche, et signale les charges concentrées sur une personne.

> **EN** — *RACI matrix check.* Checks exactly one accountable (A) and at least one responsible (R) per task, and flags work concentrated on one person.

Node.js 18+, **aucune dépendance**, licence **MIT**. Aucune donnée n'est envoyée nulle part. Les messages affichés sont en français.

## Utilisation

```bash
node src/raci-check.mjs raci.csv
```

Des fichiers d'exemple sont fournis dans `samples/`.

Aide intégrée (`--help`) :

```text
Usage : node src/raci-check.mjs raci.csv
Première colonne : la tâche ; les suivantes : un rôle ou une personne, avec R/A/C/I.
Code de sortie 2 s'il y a au moins une erreur.
```

## Tests

```bash
npm test
```

## Limites

- Les exemples de `samples/` sont fictifs ; adaptez les en-têtes de colonnes à vos propres exports.
- Essayez d'abord sur une copie de vos données.
- Fourni tel quel, sans garantie (voir `LICENSE`).

## La série

Ce script fait partie d'une série de **scripts d'automatisation libres** (public : gestion et processus, entre autres) : [présentation, guides et archive complète](https://monsieurelzam.com/scripts) · [tous les dépôts](https://github.com/MonsieurElzam?tab=repositories&q=automation-).

---

Par [Elzam MAMAH](https://monsieurelzam.com) — business analyst, optimisation de processus. Licence MIT.
