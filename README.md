# leaderboard

This project is a RESTful API Node.js leaderboards module designed for use in games and other projects.
It is a continuation of my work at Nationwide Children's Hospital, converting a simple
MySQL leaderboard into a MVC driven API using Sequelize for modeling.

This conversion began approximately on 01/14/19.


### Progress Report:

...

- 02/21/19: I finished the Semantic Ui front end implementation and Ajax calls using the reformatted Ejs. I also used Semantic's search plugin to provide game and username suggestions.  
  Using Semantic, I was able to provide front end form validation using their built-in form validation.

  TODO:

  - Provide a method to destroy all dummy data (regardless of delete_stamp) in the footer, possibly using Semantic's modal ui elements
  - Possibly display a validation error if no games exist
  - Hide search result if no results are found
  - Make layout more responsive for mobile

- 02/25/19: I hid Semantic's default popup if no search results are found by digging in the script file (the documentation doesn't mention the function properties).
  I was also able to add custom validation functions for each field, tweaking forms to display an error if no games exist.
  I additionally added a Semantic modal for fun to be able to hard delete data from the database (this would never be implemented in a real API but it lets me practice
  routing and additionally makes it easier for me to test data regardless). I still have to implement the functionality.

  TODO:

  - Finish "hard delete" modal route/ajax call
  - Make layout more responsive for mobile
