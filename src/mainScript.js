const USERNAME_DEFAULT = "octocat";
const DARK_THEME_NAME = "dark";
const LIGHT_THEME_NAME = "light";
const PREFERS_COLOR_SCHEME_DARK = "(prefers-color-scheme: dark)";

new Vue({
  el: "#app",

  data: {
    currentTheme: LIGHT_THEME_NAME,
    search: "",
    isSearchError: false,
    searchResult: null,
  },

  methods: {
    toggleTheme: function() {
      this.currentTheme = LIGHT_THEME_NAME === this.currentTheme ? DARK_THEME_NAME : LIGHT_THEME_NAME;
    },

    submit: async function(event) {
      event?.preventDefault();
      try {
        let resp = await fetch(`https://api.github.com/users/${this.search || USERNAME_DEFAULT}`);
        if (resp.status !== 200) throw new Error("Fail fetch");
        resp = await resp.json();
        this.searchResult = resp;
        this.isSearchError = false;
      } catch (error) {
        this.isSearchError = true;
      }
    },
  },

  created: function() {
    this.submit();
    if (window.matchMedia(PREFERS_COLOR_SCHEME_DARK).matches) this.toggleTheme();
  },
});
