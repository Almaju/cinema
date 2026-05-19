/**
 * search.js — Système de recherche, filtrage et tri côté client
 * pour le catalogue de films Jekyll.
 *
 * Aucune dépendance externe requise (vanilla JS).
 */

document.addEventListener("DOMContentLoaded", function () {

  // ──────────────────────────────────────────────
  // Références aux éléments du DOM
  // ──────────────────────────────────────────────

  /** @type {NodeListOf<HTMLElement>} Toutes les cartes de films présentes sur la page */
  const filmCards = document.querySelectorAll(".film-card");

  /** @type {HTMLInputElement} Champ de saisie pour la recherche textuelle */
  const searchInput = document.getElementById("search-input");

  /** @type {NodeListOf<HTMLElement>} Boutons de filtre par note */
  const filterButtons = document.querySelectorAll(".filter-btn");

  /** @type {NodeListOf<HTMLElement>} Boutons de tri */
  const sortButtons = document.querySelectorAll(".sort-btn");

  /**
   * Élément affichant le nombre de films visibles.
   * On tente de le trouver dans le DOM ; s'il n'existe pas on le crée.
   * @type {HTMLElement}
   */
  let filmCount = document.getElementById("film-count");
  if (!filmCount) {
    filmCount = document.createElement("span");
    filmCount.id = "film-count";
  }

  /**
   * Élément affichant un message « aucun résultat ».
   * Créé dynamiquement s'il n'existe pas encore.
   * @type {HTMLElement}
   */
  let noResults = document.getElementById("no-results");
  if (!noResults) {
    noResults = document.createElement("p");
    noResults.id = "no-results";
    noResults.textContent = "Aucun film ne correspond à votre recherche.";
    noResults.classList.add("hidden");
    // On insère le message juste après le conteneur des cartes, s'il existe
    const container = document.querySelector(".films-container") ||
                      (filmCards.length > 0 ? filmCards[0].parentElement : document.body);
    container.appendChild(noResults);
  }

  // ──────────────────────────────────────────────
  // État interne des filtres
  // ──────────────────────────────────────────────

  /** @type {Set<string>} Notes actuellement sélectionnées (ex. "4", "5") */
  const activeRatings = new Set();

  /** @type {string} Texte de recherche courant (en minuscules) */
  let currentQuery = "";

  // ──────────────────────────────────────────────
  // Recherche textuelle
  // ──────────────────────────────────────────────

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      currentQuery = this.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // ──────────────────────────────────────────────
  // Filtrage par note (toggle)
  // ──────────────────────────────────────────────

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const rating = this.getAttribute("data-rating");

      // Basculer l'état actif du bouton
      if (activeRatings.has(rating)) {
        activeRatings.delete(rating);
        this.classList.remove("active");
      } else {
        activeRatings.add(rating);
        this.classList.add("active");
      }

      applyFilters();
    });
  });

  // ──────────────────────────────────────────────
  // Tri
  // ──────────────────────────────────────────────

  sortButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const sortType = this.getAttribute("data-sort");

      // Mettre à jour l'état visuel des boutons de tri
      sortButtons.forEach(function (b) { b.classList.remove("active"); });
      this.classList.add("active");

      sortFilms(sortType);
    });
  });

  /**
   * Trie les cartes de films dans le DOM selon le critère choisi.
   *
   * @param {string} sortType — "title" | "rating" | "year"
   */
  function sortFilms(sortType) {
    // Convertir la NodeList en tableau pour pouvoir trier
    const cardsArray = Array.from(filmCards);

    cardsArray.sort(function (a, b) {
      switch (sortType) {
        // Tri alphabétique par titre (A → Z)
        case "title": {
          const titleA = (a.getAttribute("data-title") || "").toLowerCase();
          const titleB = (b.getAttribute("data-title") || "").toLowerCase();
          return titleA.localeCompare(titleB, "fr");
        }

        // Tri par note décroissante (la meilleure en premier)
        case "rating": {
          const ratingA = parseFloat(a.getAttribute("data-rating")) || 0;
          const ratingB = parseFloat(b.getAttribute("data-rating")) || 0;
          return ratingB - ratingA;
        }

        // Tri par année décroissante (le plus récent en premier)
        case "year": {
          const yearA = parseInt(a.getAttribute("data-year"), 10) || 0;
          const yearB = parseInt(b.getAttribute("data-year"), 10) || 0;
          return yearB - yearA;
        }

        default:
          return 0;
      }
    });

    // Réinsérer les cartes triées dans leur conteneur parent
    const parent = filmCards[0] && filmCards[0].parentElement;
    if (parent) {
      cardsArray.forEach(function (card) {
        parent.appendChild(card);
      });
    }
  }

  // ──────────────────────────────────────────────
  // Logique combinée de filtrage
  // ──────────────────────────────────────────────

  /**
   * Applique simultanément la recherche textuelle et le filtre par note.
   * Une carte est visible uniquement si elle satisfait **les deux** critères.
   * Quand aucun filtre de note n'est actif, seule la recherche compte.
   */
  function applyFilters() {
    let visibleCount = 0;

    filmCards.forEach(function (card) {
      const title    = (card.getAttribute("data-title") || "").toLowerCase();
      const director = (card.getAttribute("data-director") || "").toLowerCase();
      const year     = (card.getAttribute("data-year") || "").toLowerCase();
      const rating   = card.getAttribute("data-rating") || "";

      // — Correspondance texte : le titre, le réalisateur ou l'année contient la requête
      const matchesQuery = currentQuery === "" ||
        title.indexOf(currentQuery) !== -1 ||
        director.indexOf(currentQuery) !== -1 ||
        year.indexOf(currentQuery) !== -1;

      // — Correspondance note : aucun filtre actif ⇒ tout passe ;
      //   sinon la note doit figurer parmi les notes sélectionnées
      const matchesRating = activeRatings.size === 0 || activeRatings.has(rating);

      // Les deux conditions doivent être remplies
      if (matchesQuery && matchesRating) {
        card.classList.remove("hidden");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    // Mettre à jour le compteur de films affichés
    updateCount(visibleCount);

    // Afficher ou masquer le message « aucun résultat »
    if (visibleCount === 0) {
      noResults.classList.remove("hidden");
    } else {
      noResults.classList.add("hidden");
    }
  }

  /**
   * Met à jour le texte du compteur de films visibles.
   *
   * @param {number} count — Nombre de films actuellement affichés
   */
  function updateCount(count) {
    const total = filmCards.length;
    filmCount.textContent = count + " / " + total + " film" + (count > 1 ? "s" : "");
  }

  // ──────────────────────────────────────────────
  // Initialisation
  // ──────────────────────────────────────────────

  // Afficher le compte initial (tous les films visibles)
  updateCount(filmCards.length);
});
