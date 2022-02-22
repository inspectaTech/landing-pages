  /*
  * @notes ### docs @ lib/main/section prefs notes.md
  */

  const default_sections = [
  "sunzao_sunzao",
  "library_library",
  "bookmarks_bookmarks",
  "profile_profile",
  "recent_recent",
  "pin_pin",
  // "projects_projects"
  ];

  const default_section_data = {
    "sunzao_sunzao":{
      home: false,
      icon: "flame-icon",
      name: "sunzao",
      type: "sunzao",
      owner: true,
      guest: true
    },
    "library_library":{
      home: true,
      icon: "books",
      name: "library",
      type: "library",
      owner: true,
      guest: true
    },
    "bookmarks_bookmarks":{
      home: false,
      icon: "bookmark",
      name: "bookmarks",
      type: "bookmarks",
      owner: true,
      guest: true
    },
    "profile_profile":{
      home: false,
      icon: "user",
      name: "profile",
      type: "profile",
      owner: true,
      guest: true
    },
    "recent_recent":{
      home: false,
      icon: "clock",
      name: "recent",
      type: "recent",
      owner: true,
      guest: true
    },
    "pin_pin":{
      home: false,
      icon: "pushpin",
      name: "pin",
      type: "pin",
      owner: true,
      guest: false
    },
    "projects_projects":{
      home: false,
      icon: "users",
      name: "projects",
      type: "projects",
      owner: true,
      guest: false
    }
  };

  const default_prefs = {
    bookmarks: {
        protected:["bookmarks","faith","recommended","community","events","discussions","wishlist","projects"],
        active:"bookmarks",
        bookmarks:{
          icon:"bookmark2",
          data:[]
        }
    },
    "section_views" : [ ...default_sections],
    "section_data": {...default_section_data},
    "section_home" : "library"
  }

  // feature no-fly list - items that appear hear won't be processed by feature section
  const feature_restricted = ["library","profile","sunzao"];// recent is in question
  // docs @ lib/main/section prefs notes.md


  module.exports = {
    default_prefs,
    default_sections,
    default_section_data,
    feature_restricted
  }
