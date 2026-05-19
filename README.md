# 🎬 Cinémathèque

Mon catalogue personnel de films — un site statique GitHub Pages où je note chaque film que je vois.

👉 **[Voir le site](https://almaju.github.io/cinema/)**

---

## 📊 Système de notation

Chaque film est noté de 1 à 5 étoiles :

| Note | Étoiles | Signification |
|------|---------|---------------|
| 5 | ★★★★★ | **Incontournable** — À voir absolument |
| 4 | ★★★★☆ | **Excellent** — Très bon film |
| 3 | ★★★☆☆ | **Bon moment** — Agréable à regarder |
| 2 | ★★☆☆☆ | **Pas fou** — Rien d'extraordinaire |
| 1 | ★☆☆☆☆ | **Mauvais** — À éviter |

---

## 🎞️ Ajouter un film

Pour ajouter un nouveau film au catalogue, créez un fichier `.md` dans le dossier `_films/` avec le frontmatter suivant :

```yaml
---
title: "Nom du Film"
realisateur: "Prénom Nom"
annee: 2024
genre:
  - Drame
  - Thriller
note: 4
imdb: "https://www.imdb.com/title/tt1234567/"
---

Votre critique ou commentaire ici (optionnel).
```

### Champs disponibles

| Champ | Requis | Description |
|-------|--------|-------------|
| `title` | ✅ | Titre du film |
| `realisateur` | ✅ | Nom du réalisateur |
| `annee` | ✅ | Année de sortie |
| `genre` | ✅ | Liste des genres (tableau YAML) |
| `note` | ✅ | Note de 1 à 5 |
| `imdb` | ❌ | Lien vers la fiche IMDb |

Le nom du fichier détermine le slug dans l'URL. Par exemple, `_films/inception.md` sera accessible à `/cinema/films/inception/`.

---

## 🛠️ Stack technique

- **[Jekyll](https://jekyllrb.com/)** — Générateur de site statique
- **[GitHub Pages](https://pages.github.com/)** — Hébergement gratuit
- **Vanilla JS** — Recherche, filtrage et tri côté client
- **Aucune dépendance front-end** — Pas de framework, pas de build

---

## 🚀 Développement local

```bash
# Installer les dépendances
bundle install

# Lancer le serveur de développement
bundle exec jekyll serve

# Le site est accessible à http://localhost:4000/cinema/
```

---

## 📄 Licence

MIT
